'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Plus, CreditCard, Package, CheckCircle, Home, ShoppingCart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  useGetCartQuery,
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useCreateOrderMutation,
} from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'CASH_ON_DELIVERY', name: 'Cash on Delivery', icon: Package },
  { id: 'CARD', name: 'Credit/Debit Card', icon: CreditCard },
];

function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(undefined);
  const { data: addressesData, isLoading: addressLoading } = useGetAllAddressesQuery(undefined);
  const [createAddress] = useCreateAddressMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('CASH_ON_DELIVERY');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  });

  const cart = cartData?.data;
  const addresses = addressesData?.data || [];
  const defaultAddress = addresses.find((addr: any) => addr.isDefault);

  useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress._id);
    }
  }, [defaultAddress, selectedAddress]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createAddress(addressForm).unwrap();
      toast.success('Address added successfully');
      setShowAddressForm(false);
      setSelectedAddress(result.data._id);
      setAddressForm({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'USA',
      });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        shippingAddressId: selectedAddress,
        paymentMethod: selectedPayment as 'CASH_ON_DELIVERY' | 'CARD' | 'UPI' | 'NET_BANKING',
      };

      const result = await createOrder(orderData).unwrap();
      setOrderId(result.data._id);
      setOrderPlaced(true);
      
      toast.success('Order placed successfully!', {
        description: `Order #${result.data.orderNumber}`,
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/orders/${result.data._id}`);
      }, 2000);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to place order');
    }
  };

  if (cartLoading || addressLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to proceed with checkout</p>
          <Button onClick={() => router.push('/products')}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center max-w-md mx-auto">
          <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
          <h2 className="text-3xl font-bold mb-2 text-green-600">Order Placed!</h2>
          <p className="text-gray-600 mb-6">Thank you for your order. We'll send you a confirmation email shortly.</p>
          <Button onClick={() => router.push(`/orders/${orderId}`)}>View Order</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/cart" className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Checkout</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Address
            </h2>

            {addresses.length > 0 && !showAddressForm && (
              <div className="space-y-3 mb-4">
                {addresses.map((address: any) => (
                  <div
                    key={address._id}
                    onClick={() => setSelectedAddress(address._id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAddress === address._id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {address.fullName}
                          {address.isDefault && (
                            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                      </div>
                      <input
                        type="radio"
                        checked={selectedAddress === address._id}
                        onChange={() => setSelectedAddress(address._id)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit">Save Address</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {!showAddressForm && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddressForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            )}
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <method.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Items ({cart.items.length})</h2>
            <div className="space-y-3">
              {cart.items.map((item: any) => {
                // Safety check for missing product - cart stores productId
                const product = item.productId || item.product;
                if (!product || !product._id) {
                  return null;
                }
                
                const itemTotal = (item.price || product.price || 0) * item.quantity;
                
                return (
                  <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border border-gray-200">
                      <Image
                        src={item.image || product.images?.[0] || '/placeholder.png'}
                        alt={item.name || product.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2">{item.name || product.name || 'Product'}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.color && ` | Color: ${item.variant.color}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{itemTotal.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">₹{(item.price || product.price || 0).toFixed(2)} each</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
                <span className="font-medium">₹{cart.subtotal?.toFixed(2)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-medium">-₹{cart.discount.toFixed(2)}</span>
                </div>
              )}
              {cart.couponCode && (
                <div className="mt-2 flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">Coupon &quot;{cart.couponCode}&quot; applied</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-medium text-green-600">
                  {cart.subtotal > 500 ? 'FREE' : '₹50.00'}
                </span>
              </div>
              {cart.subtotal <= 500 && (
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                  Add items worth ₹{(500 - cart.subtotal).toFixed(2)} more to get FREE shipping!
                </div>
              )}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">₹{cart.total?.toFixed(2)}</span>
                    {cart.discount > 0 && (
                      <p className="text-xs text-gray-500">You saved ₹{cart.discount.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full mb-4"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || isCreatingOrder}
            >
              {isCreatingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>

            <div className="text-xs text-gray-600 space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Easy returns within 7 days</span>
              </div>
              <p className="text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPageWrapper() {
  return (
    <UserProtectedRoute>
      <CheckoutPage />
    </UserProtectedRoute>
  );
}
