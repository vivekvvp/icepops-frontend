'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Tag, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useValidateCouponMutation
} from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

function CartPage() {
  const router = useRouter();
  const { data: cartData, isLoading } = useGetCartQuery(undefined);
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [applyCoupon] = useApplyCouponMutation();
  const [removeCoupon] = useRemoveCouponMutation();
  const [validateCoupon] = useValidateCouponMutation();
  
  const [couponInput, setCouponInput] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const cart = cartData?.data;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const total = cart?.total || 0;
  const couponCode = cart?.couponCode;

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem({ productId, quantity: newQuantity }).unwrap();
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId).unwrap();
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove item');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    try {
      setLoadingCoupon(true);
      const validationResult = await validateCoupon({ code: couponInput, cartTotal: subtotal }).unwrap();
      if (validationResult.data.valid) {
        await applyCoupon(couponInput).unwrap();
        toast.success('Coupon applied successfully');
        setCouponInput('');
      } else {
        toast.error(validationResult.data.message || 'Invalid coupon');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to apply coupon');
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon(undefined).unwrap();
      toast.success('Coupon removed');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove coupon');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
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
            <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => {
            // Safety check for missing product - cart stores productId
            const product = item.productId || item.product;
            if (!product || !product._id) {
              return null;
            }
            
            const itemTotal = (item.price || product.price || 0) * item.quantity;
            const compareTotal = product.comparePrice ? product.comparePrice * item.quantity : null;
            const savings = compareTotal ? compareTotal - itemTotal : 0;
            
            return (
              <Card key={product._id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-6">
                  <Link href={`/products/${product._id}`} className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={item.image || product.images?.[0] || '/placeholder.png'}
                      alt={item.name || product.name || 'Product'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Link href={`/products/${product._id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                            {item.name || product.name}
                          </h3>
                        </Link>
                        
                        {product.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {product.description}
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(product._id)}
                        className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {item.variant && (
                      <div className="flex gap-3 text-sm text-gray-600 mb-3">
                        {item.variant.size && (
                          <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.variant.size}</span>
                        )}
                        {item.variant.color && (
                          <span className="bg-gray-100 px-2 py-1 rounded">Color: {item.variant.color}</span>
                        )}
                      </div>
                    )}
                    
                    {product.stock !== undefined && (
                      <p className={`text-sm mb-3 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-lg shadow-sm">
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-6 font-medium min-w-[60px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity >= (product.stock || 0)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">₹{itemTotal.toFixed(2)}</p>
                        {compareTotal && (
                          <div className="flex items-center gap-2 justify-end">
                            <p className="text-sm text-gray-500 line-through">
                              ₹{compareTotal.toFixed(2)}
                            </p>
                            {savings > 0 && (
                              <p className="text-sm text-green-600 font-medium">
                                Save ₹{savings.toFixed(2)}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          ₹{(item.price || product.price)?.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            {/* Coupon Input */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  disabled={!!couponCode}
                  className="bg-white"
                />
                {couponCode ? (
                  <Button variant="outline" onClick={handleRemoveCoupon} className="whitespace-nowrap">
                    Remove
                  </Button>
                ) : (
                  <Button onClick={handleApplyCoupon} disabled={loadingCoupon} className="whitespace-nowrap">
                    {loadingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                )}
              </div>
              
              {couponCode && (
                <div className="mt-3 flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">Coupon &quot;{couponCode}&quot; applied successfully!</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-medium text-green-600">
                  {subtotal > 500 ? 'FREE' : '₹50.00'}
                </span>
              </div>
              
              {subtotal <= 500 && (
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                  Add items worth ₹{(500 - subtotal).toFixed(2)} more to get FREE shipping!
                </div>
              )}
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Discount</span>
                  <span className="font-medium">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
                    {discount > 0 && (
                      <p className="text-xs text-gray-500">You saved ₹{discount.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mb-3" 
              size="lg"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
            
            <Link href="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            
            <div className="mt-6 pt-6 border-t text-xs text-gray-600 space-y-2">
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedCartPage() {
  return (
    <UserProtectedRoute>
      <CartPage />
    </UserProtectedRoute>
  );
}
