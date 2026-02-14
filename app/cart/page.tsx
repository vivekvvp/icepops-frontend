'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => {
            // Safety check for missing product
            if (!item.product || !item.product._id) {
              return null;
            }
            
            return (
              <Card key={item.product._id} className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product?.images?.[0] || '/placeholder.png'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Link href={`/products/${item.product._id}`}>
                      <h3 className="font-semibold hover:text-primary">{item.product.name}</h3>
                    </Link>
                    
                    {item.selectedVariant && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.selectedVariant.size && `Size: ${item.selectedVariant.size}`}
                        {item.selectedVariant.color && ` | Color: ${item.selectedVariant.color}`}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                          disabled={item.quantity >= (item.product.stock || 0)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹{(item.product.price || 0) * item.quantity}</p>
                    {item.product.comparePrice && (
                      <p className="text-sm text-gray-500 line-through">
                        ₹{item.product.comparePrice * item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            {/* Coupon Input */}
            <div className="mb-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  disabled={!!couponCode}
                />
                {couponCode ? (
                  <Button variant="outline" onClick={handleRemoveCoupon}>
                    Remove
                  </Button>
                ) : (
                  <Button onClick={handleApplyCoupon} disabled={loadingCoupon}>
                    Apply
                  </Button>
                )}
              </div>
              
              {couponCode && (
                <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                  <Tag className="w-4 h-4" />
                  <span>Coupon &quot;{couponCode}&quot; applied</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
            
            <Link href="/products">
              <Button variant="outline" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
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
