'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Minus, Plus, Trash2, ShoppingBag,
  Tag, ChevronRight, Truck, Shield,
  RotateCcw, ArrowRight, X,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useValidateCouponMutation,
} from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated } from '@/lib/store/authSlice';
import { toast } from 'sonner';

function CartPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: cartData, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
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
  const shippingFree = subtotal > 500;
  const shippingCost = shippingFree ? 0 : 50;

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

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgb(185, 28, 28)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm font-medium" style={{ color: 'rgb(110, 118, 135)' }}>
              Loading your cart...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Empty Cart ── */
  if (items.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div
            className="flex flex-col items-center text-center p-10"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(220, 223, 230)',
              borderRadius: '6px',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center mb-4"
              style={{
                borderRadius: '8px',
                backgroundColor: 'rgb(254, 242, 242)',
                border: '1px solid rgb(254, 202, 202)',
              }}
            >
              <ShoppingBag className="w-7 h-7" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>
              Your cart is empty
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgb(110, 118, 135)' }}>
              Looks like you haven't added anything yet. Start shopping!
            </p>
            <Link href="/products">
              <button
                className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 transition-colors"
                style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                Browse Products
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
      <Header />

      <main className="flex-1">
        <section className="px-4 md:px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* ── Breadcrumb ── */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
              <Link href="/">
                <span
                  className="transition-colors cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}
                >Home</span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>Shopping Cart</span>
            </div>

            {/* ── Page Title ── */}
            <div
              className="flex items-center justify-between pb-5"
              style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
            >
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
                  Shopping Cart
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <Link href="/products">
                <button
                  className="hidden md:flex items-center gap-1.5 text-sm font-bold transition-colors"
                  style={{ color: 'rgb(185, 28, 28)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(153, 27, 27)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Link>
            </div>

            {/* ── Free Shipping Bar ── */}
            {!shippingFree && (
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(239, 246, 255)',
                  border: '1px solid rgb(219, 234, 254)',
                }}
              >
                <Truck className="w-4 h-4 shrink-0" style={{ color: 'rgb(29, 78, 216)' }} />
                <p className="text-sm" style={{ color: 'rgb(29, 78, 216)' }}>
                  Add
                  <span className="font-bold">₹{(500 - subtotal).toFixed(2)}</span>
                  {' '}more to get <span className="font-bold">FREE shipping!</span>
                </p>
              </div>
            )}
            {shippingFree && (
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(240, 253, 244)',
                  border: '1px solid rgb(187, 247, 208)',
                }}
              >
                <Truck className="w-4 h-4 shrink-0" style={{ color: 'rgb(21, 91, 48)' }} />
                <p className="text-sm font-semibold" style={{ color: 'rgb(21, 91, 48)' }}>
                  🎉 You've unlocked FREE shipping!
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Cart Items ── */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item: any) => {
                  const product = item.productId || item.product;
                  if (!product || !product._id) return null;

                  const itemTotal = (item.price || product.price || 0) * item.quantity;
                  const compareTotal = product.comparePrice
                    ? product.comparePrice * item.quantity
                    : null;
                  const savings = compareTotal ? compareTotal - itemTotal : 0;
                  const stockLevel =
                    product.stock > 10 ? 'in' : product.stock > 0 ? 'low' : 'out';

                  return (
                    <div
                      key={product._id}
                      className="overflow-hidden transition-shadow"
                      style={{
                        backgroundColor: 'rgb(255, 255, 255)',
                        border: '1px solid rgb(220, 223, 230)',
                        borderRadius: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="p-4 flex gap-4">

                        {/* Image */}
                        <Link
                          href={`/products/${product._id}`}
                          className="relative shrink-0 overflow-hidden"
                          style={{
                            width: '96px',
                            height: '96px',
                            borderRadius: '4px',
                            border: '1px solid rgb(220, 223, 230)',
                            backgroundColor: 'rgb(243, 244, 246)',
                          }}
                        >
                          <Image
                            src={item.image || product.images?.[0] || '/placeholder.png'}
                            alt={item.name || product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${product._id}`}>
                                <h3
                                  className="font-bold text-sm line-clamp-1 transition-colors"
                                  style={{ color: 'rgb(15, 20, 35)' }}
                                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(15, 20, 35)')}
                                >
                                  {item.name || product.name}
                                </h3>
                              </Link>

                              {product.description && (
                                <p
                                  className="text-xs mt-0.5 line-clamp-1"
                                  style={{ color: 'rgb(110, 118, 135)' }}
                                >
                                  {product.description}
                                </p>
                              )}
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemoveItem(product._id)}
                              className="shrink-0 p-1.5 transition-colors"
                              style={{
                                borderRadius: '4px',
                                color: 'rgb(150, 158, 175)',
                                backgroundColor: 'transparent',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                                e.currentTarget.style.color = 'rgb(185, 28, 28)'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = 'rgb(150, 158, 175)'
                              }}
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Variant tags */}
                          {item.variant && (
                            <div className="flex gap-2">
                              {item.variant.size && (
                                <span
                                  className="text-xs font-semibold px-2 py-0.5"
                                  style={{
                                    borderRadius: '4px',
                                    backgroundColor: 'rgb(248, 249, 251)',
                                    border: '1px solid rgb(220, 223, 230)',
                                    color: 'rgb(75, 85, 99)',
                                  }}
                                >
                                  Size: {item.variant.size}
                                </span>
                              )}
                              {item.variant.color && (
                                <span
                                  className="text-xs font-semibold px-2 py-0.5"
                                  style={{
                                    borderRadius: '4px',
                                    backgroundColor: 'rgb(248, 249, 251)',
                                    border: '1px solid rgb(220, 223, 230)',
                                    color: 'rgb(75, 85, 99)',
                                  }}
                                >
                                  Color: {item.variant.color}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Stock badge */}
                          <div>
                            {stockLevel === 'in' && (
                              <span className="text-xs font-semibold" style={{ color: 'rgb(21, 91, 48)' }}>
                                ✓ In Stock
                              </span>
                            )}
                            {stockLevel === 'low' && (
                              <span className="text-xs font-semibold" style={{ color: 'rgb(161, 72, 10)' }}>
                                ⚠ Only {product.stock} left!
                              </span>
                            )}
                            {stockLevel === 'out' && (
                              <span className="text-xs font-semibold" style={{ color: 'rgb(185, 28, 28)' }}>
                                ✗ Out of Stock
                              </span>
                            )}
                          </div>

                          {/* Quantity + Price Row */}
                          <div className="flex items-center justify-between mt-1">

                            {/* Quantity */}
                            <div
                              className="flex items-center overflow-hidden"
                              style={{
                                border: '1px solid rgb(220, 223, 230)',
                                borderRadius: '4px',
                              }}
                            >
                              <button
                                onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="px-2.5 py-1.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'rgb(248, 249, 251)', color: 'rgb(55, 65, 81)' }}
                                onMouseEnter={e => { if (item.quantity > 1) e.currentTarget.style.backgroundColor = 'rgb(240, 242, 245)' }}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)')}
                              >
                                <Minus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                              <span
                                className="px-4 py-1.5 text-sm font-bold text-center"
                                style={{
                                  borderLeft: '1px solid rgb(220, 223, 230)',
                                  borderRight: '1px solid rgb(220, 223, 230)',
                                  color: 'rgb(15, 20, 35)',
                                  minWidth: '44px',
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                                disabled={item.quantity >= (product.stock || 0)}
                                className="px-2.5 py-1.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'rgb(248, 249, 251)', color: 'rgb(55, 65, 81)' }}
                                onMouseEnter={e => { if (item.quantity < product.stock) e.currentTarget.style.backgroundColor = 'rgb(240, 242, 245)' }}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)')}
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-base font-extrabold" style={{ color: 'rgb(185, 28, 28)' }}>
                                ₹{itemTotal.toFixed(2)}
                              </p>
                              {compareTotal && (
                                <p className="text-xs line-through" style={{ color: 'rgb(150, 158, 175)' }}>
                                  ₹{compareTotal.toFixed(2)}
                                </p>
                              )}
                              <p className="text-xs mt-0.5" style={{ color: 'rgb(150, 158, 175)' }}>
                                ₹{(item.price || product.price)?.toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          {/* Savings badge */}
                          {savings > 0 && (
                            <span
                              className="self-start text-xs font-bold px-2 py-0.5"
                              style={{
                                borderRadius: '4px',
                                backgroundColor: 'rgb(240, 253, 244)',
                                color: 'rgb(21, 91, 48)',
                                border: '1px solid rgb(187, 247, 208)',
                              }}
                            >
                              You save ₹{savings.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Order Summary ── */}
              <div className="lg:col-span-1">
                <div
                  className="sticky top-24 overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  {/* Header */}
                  <div
                    className="px-5 py-4"
                    style={{
                      borderBottom: '1px solid rgb(240, 242, 245)',
                      backgroundColor: 'rgb(248, 249, 251)',
                    }}
                  >
                    <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                      Order Summary
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="p-5 space-y-5">

                    {/* Coupon */}
                    <div
                      className="p-4 space-y-3"
                      style={{
                        borderRadius: '4px',
                        backgroundColor: 'rgb(248, 249, 251)',
                        border: '1px solid rgb(240, 242, 245)',
                      }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(150, 158, 175)' }}>
                        Coupon Code
                      </p>

                      {couponCode ? (
                        <div
                          className="flex items-center justify-between px-3 py-2"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(240, 253, 244)',
                            border: '1px solid rgb(187, 247, 208)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5" style={{ color: 'rgb(21, 91, 48)' }} />
                            <span className="text-xs font-bold" style={{ color: 'rgb(21, 91, 48)' }}>
                              {couponCode}
                            </span>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="p-0.5 transition-colors"
                            style={{ color: 'rgb(21, 91, 48)', borderRadius: '3px' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(187, 247, 208)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            placeholder="Enter code"
                            value={couponInput}
                            onChange={e => setCouponInput(e.target.value.toUpperCase())}
                            className="flex-1 text-sm outline-none px-3 py-2 transition-colors"
                            style={{
                              borderRadius: '4px',
                              border: '1px solid rgb(220, 223, 230)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 20, 35)',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                            onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={loadingCoupon || !couponInput.trim()}
                            className="text-xs font-bold px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: 'rgb(185, 28, 28)',
                              color: 'rgb(255, 255, 255)',
                            }}
                            onMouseEnter={e => { if (!loadingCoupon && couponInput.trim()) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                          >
                            {loadingCoupon ? '...' : 'Apply'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── Price Breakdown ── */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'rgb(75, 85, 99)' }}>
                          Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'rgb(15, 20, 35)' }}>
                          ₹{subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'rgb(75, 85, 99)' }}>Shipping</span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: shippingFree ? 'rgb(21, 91, 48)' : 'rgb(15, 20, 35)' }}
                        >
                          {shippingFree ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'rgb(75, 85, 99)' }}>Discount</span>
                          <span className="text-sm font-semibold" style={{ color: 'rgb(21, 91, 48)' }}>
                            -₹{discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Divider */}
                      <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Total</span>
                        <span className="text-xl font-extrabold" style={{ color: 'rgb(185, 28, 28)' }}>
                          ₹{(total + shippingCost).toFixed(2)}
                        </span>
                      </div>

                      {discount > 0 && (
                        <div
                          className="flex items-center justify-center gap-1.5 py-2"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(240, 253, 244)',
                            border: '1px solid rgb(187, 247, 208)',
                          }}
                        >
                          <span className="text-xs font-bold" style={{ color: 'rgb(21, 91, 48)' }}>
                            🎉 You're saving ₹{discount.toFixed(2)} on this order!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ── CTA Buttons ── */}
                    <div className="space-y-2.5">
                      <button
                        onClick={() => router.push('/checkout')}
                        className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 transition-colors"
                        style={{
                          borderRadius: '6px',
                          backgroundColor: 'rgb(185, 28, 28)',
                          color: 'rgb(255, 255, 255)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                      >
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      <Link href="/products" className="block">
                        <button
                          className="w-full text-sm font-bold py-2.5 transition-colors"
                          style={{
                            borderRadius: '6px',
                            border: '1px solid rgb(220, 223, 230)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            color: 'rgb(75, 85, 99)',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)'
                            e.currentTarget.style.borderColor = 'rgb(185, 28, 28)'
                            e.currentTarget.style.color = 'rgb(185, 28, 28)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)'
                            e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                            e.currentTarget.style.color = 'rgb(75, 85, 99)'
                          }}
                        >
                          Continue Shopping
                        </button>
                      </Link>
                    </div>

                    {/* ── Trust Badges ── */}
                    <div
                      style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      { [
                        { icon: Shield, label: 'Secure Checkout' },
                        { icon: RotateCcw, label: 'Easy Returns' },
                        { icon: Truck, label: 'Fast Delivery' },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1 text-center">
                          <Icon className="w-4 h-4" style={{ color: 'rgb(185, 28, 28)', strokeWidth: 2 }} />
                          <span className="text-xs font-semibold" style={{ color: 'rgb(110, 118, 135)' }}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
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
