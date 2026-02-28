'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Plus, CreditCard, Package, CheckCircle,
  ShoppingCart, Tag, ChevronRight, ArrowRight,
  Truck, Shield, RotateCcw, X,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  useGetCartQuery,
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useCreateOrderMutation,
} from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated } from '@/lib/store/authSlice';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'CASH_ON_DELIVERY', name: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Package },
  { id: 'CARD', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay & more', icon: CreditCard },
];

function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const { data: addressesData, isLoading: addressLoading } = useGetAllAddressesQuery(undefined, { skip: !isAuthenticated });
  const [createAddress] = useCreateAddressMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('CASH_ON_DELIVERY');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', addressLine1: '',
    addressLine2: '', city: '', state: '', postalCode: '', country: 'India',
  });

  const cart = cartData?.data;
  const addresses = addressesData?.data || [];
  const defaultAddress = addresses.find((addr: any) => addr.isDefault);
  const shippingFree = (cart?.subtotal || 0) > 500;
  const shippingCost = shippingFree ? 0 : 50;

  useEffect(() => {
    if (defaultAddress && !selectedAddress) setSelectedAddress(defaultAddress._id);
  }, [defaultAddress, selectedAddress]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createAddress(addressForm).unwrap();
      toast.success('Address added successfully');
      setShowAddressForm(false);
      setSelectedAddress(result.data._id);
      setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Please select a delivery address');
    if (!cart || cart.items.length === 0) return toast.error('Your cart is empty');
    try {
      const result = await createOrder({
        shippingAddressId: selectedAddress,
        paymentMethod: selectedPayment as 'CASH_ON_DELIVERY' | 'CARD' | 'UPI' | 'NET_BANKING',
      }).unwrap();
      setOrderId(result.data._id);
      setOrderPlaced(true);
      toast.success('Order placed successfully!', { description: `Order #${result.data.orderNumber}` });
      setTimeout(() => router.push(`/orders/${result.data._id}`), 2000);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to place order');
    }
  };

  const inputStyle = {
    borderRadius: '4px',
    border: '1px solid rgb(220, 223, 230)',
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(15, 20, 35)',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  };

  /* ── Loading ── */
  if (cartLoading || addressLoading) {
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
              Loading checkout...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Empty Cart ── */
  if (!cart || cart.items.length === 0) {
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
              style={{ borderRadius: '8px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
            >
              <Package className="w-7 h-7" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>Your cart is empty</h2>
            <p className="text-sm mb-6" style={{ color: 'rgb(110, 118, 135)' }}>Add some products to proceed with checkout</p>
            <Link href="/products">
              <button
                className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 transition-colors"
                style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                Browse Products <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Order Placed ── */
  if (orderPlaced) {
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
              maxWidth: '460px',
              width: '100%',
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center mb-4"
              style={{ borderRadius: '8px', backgroundColor: 'rgb(240, 253, 244)', border: '1px solid rgb(187, 247, 208)' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'rgb(21, 91, 48)' }} />
            </div>
            <h2 className="text-xl font-extrabold mb-1" style={{ color: 'rgb(21, 91, 48)' }}>Order Placed!</h2>
            <p className="text-sm mb-6" style={{ color: 'rgb(110, 118, 135)' }}>
              Thank you for your order. Redirecting to order details...
            </p>
            <button
              onClick={() => router.push(`/orders/${orderId}`)}
              className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 transition-colors"
              style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
            >
              View Order <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
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
                <span className="transition-colors cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}>
                  Home
                </span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/cart">
                <span className="transition-colors cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}>
                  Cart
                </span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>Checkout</span>
            </div>

            {/* ── Page Title ── */}
            <div
              className="pb-5"
              style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
            >
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
                Checkout
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} · Complete your order
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Left Column ── */}
              <div className="lg:col-span-2 space-y-5">

                {/* ── Delivery Address ── */}
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  {/* Section Header */}
                  <div
                    className="flex items-center gap-2 px-5 py-4"
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7"
                      style={{ borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                    >
                      <MapPin className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Delivery Address</h2>
                      <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Select or add a shipping address</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Saved Addresses */}
                    {addresses.length > 0 && !showAddressForm && (
                      <div className="space-y-3">
                        {addresses.map((address: any) => {
                          const isSelected = selectedAddress === address._id;
                          return (
                            <div
                              key={address._id}
                              onClick={() => setSelectedAddress(address._id)}
                              className="flex items-start gap-3 p-4 cursor-pointer transition-all"
                              style={{
                                borderRadius: '4px',
                                border: isSelected ? '1.5px solid rgb(185, 28, 28)' : '1px solid rgb(220, 223, 230)',
                                backgroundColor: isSelected ? 'rgb(254, 242, 242)' : 'rgb(255, 255, 255)',
                              }}
                              onMouseEnter={e => {
                                if (!isSelected) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)'
                              }}
                              onMouseLeave={e => {
                                if (!isSelected) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                              }}
                            >
                              {/* Radio */}
                              <div
                                className="shrink-0 mt-0.5 w-4 h-4 flex items-center justify-center"
                                style={{
                                  borderRadius: '50%',
                                  border: isSelected ? '4px solid rgb(185, 28, 28)' : '1.5px solid rgb(150, 158, 175)',
                                  backgroundColor: 'rgb(255, 255, 255)',
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                                    {address.fullName}
                                  </p>
                                  {address.isDefault && (
                                    <span
                                      className="text-xs font-bold px-2 py-0.5"
                                      style={{
                                        borderRadius: '4px',
                                        backgroundColor: 'rgb(254, 242, 242)',
                                        color: 'rgb(185, 28, 28)',
                                        border: '1px solid rgb(254, 202, 202)',
                                      }}
                                    >
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgb(75, 85, 99)' }}>
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}, {address.city}, {address.state} — {address.postalCode}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                                  📞 {address.phone}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Address Form */}
                    {showAddressForm && (
                      <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: 'fullName', label: 'Full Name', placeholder: 'John Doe', required: true, type: 'text' },
                            { id: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', required: true, type: 'tel' },
                          ].map(field => (
                            <div key={field.id}>
                              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(75, 85, 99)' }}>
                                {field.label} {field.required && <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>}
                              </label>
                              <input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={(addressForm as any)[field.id]}
                                onChange={e => setAddressForm({ ...addressForm, [field.id]: e.target.value })}
                                required={field.required}
                                style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                              />
                            </div>
                          ))}
                        </div>

                        {[
                          { id: 'addressLine1', label: 'Address Line 1', placeholder: 'House no., Building, Street', required: true },
                          { id: 'addressLine2', label: 'Address Line 2', placeholder: 'Apartment, landmark (optional)', required: false },
                        ].map(field => (
                          <div key={field.id}>
                            <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(75, 85, 99)' }}>
                              {field.label} {field.required && <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>}
                            </label>
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              value={(addressForm as any)[field.id]}
                              onChange={e => setAddressForm({ ...addressForm, [field.id]: e.target.value })}
                              required={field.required}
                              style={inputStyle}
                              onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                              onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                            />
                          </div>
                        ))}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'city', label: 'City', placeholder: 'Mumbai', required: true },
                            { id: 'state', label: 'State', placeholder: 'Maharashtra', required: true },
                            { id: 'postalCode', label: 'Postal Code', placeholder: '400001', required: true },
                          ].map(field => (
                            <div key={field.id}>
                              <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(75, 85, 99)' }}>
                                {field.label} <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                              </label>
                              <input
                                type="text"
                                placeholder={field.placeholder}
                                value={(addressForm as any)[field.id]}
                                onChange={e => setAddressForm({ ...addressForm, [field.id]: e.target.value })}
                                required={field.required}
                                style={inputStyle}
                                onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors"
                            style={{ borderRadius: '4px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors"
                            style={{
                              borderRadius: '4px',
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
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Add New Address Button */}
                    {!showAddressForm && (
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 transition-colors"
                        style={{
                          borderRadius: '4px',
                          border: '1.5px dashed rgb(185, 28, 28)',
                          backgroundColor: 'rgb(255, 255, 255)',
                          color: 'rgb(185, 28, 28)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Add New Address
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Payment Method ── */}
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-5 py-4"
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7"
                      style={{ borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                    >
                      <CreditCard className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Payment Method</h2>
                      <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Choose how you want to pay</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {paymentMethods.map(method => {
                      const isSelected = selectedPayment === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className="flex items-center gap-3 p-4 cursor-pointer transition-all"
                          style={{
                            borderRadius: '4px',
                            border: isSelected ? '1.5px solid rgb(185, 28, 28)' : '1px solid rgb(220, 223, 230)',
                            backgroundColor: isSelected ? 'rgb(254, 242, 242)' : 'rgb(255, 255, 255)',
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgb(185, 28, 28)' }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                        >
                          {/* Radio */}
                          <div
                            className="shrink-0 w-4 h-4 flex items-center justify-center"
                            style={{
                              borderRadius: '50%',
                              border: isSelected ? '4px solid rgb(185, 28, 28)' : '1.5px solid rgb(150, 158, 175)',
                              backgroundColor: 'rgb(255, 255, 255)',
                            }}
                          />
                          <div
                            className="flex items-center justify-center w-8 h-8 shrink-0"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: isSelected ? 'rgb(255, 255, 255)' : 'rgb(248, 249, 251)',
                              border: '1px solid rgb(240, 242, 245)',
                            }}
                          >
                            <method.icon className="w-4 h-4" style={{ color: isSelected ? 'rgb(185, 28, 28)' : 'rgb(110, 118, 135)' }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>{method.name}</p>
                            <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>{method.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Order Items ── */}
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-5 py-4"
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7"
                      style={{ borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                        Order Items ({cart.items.length})
                      </h2>
                      <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Review your items before placing order</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {cart.items.map((item: any) => {
                      const product = item.productId || item.product;
                      if (!product || !product._id) return null;
                      const itemTotal = (item.price || product.price || 0) * item.quantity;

                      return (
                        <div
                          key={product._id}
                          className="flex items-center gap-4 p-3"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(248, 249, 251)',
                            border: '1px solid rgb(240, 242, 245)',
                          }}
                        >
                          <Link
                            href={`/products/${product._id}`}
                            className="relative shrink-0 overflow-hidden"
                            style={{
                              width: '72px',
                              height: '72px',
                              borderRadius: '4px',
                              border: '1px solid rgb(220, 223, 230)',
                              backgroundColor: 'rgb(243, 244, 246)',
                            }}
                          >
                            <Image
                              src={item.image || product.images?.[0] || '/placeholder.png'}
                              alt={item.name || product.name || 'Product'}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

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
                            <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                              Qty: {item.quantity} × ₹{(item.price || product.price || 0).toFixed(2)}
                            </p>
                            {item.variant && (
                              <div className="flex items-center gap-2 mt-1">
                                {item.variant.size && (
                                  <span
                                    className="text-xs px-1.5 py-0.5 font-medium"
                                    style={{ borderRadius: '3px', backgroundColor: 'rgb(240, 242, 245)', color: 'rgb(75, 85, 99)' }}
                                  >
                                    {item.variant.size}
                                  </span>
                                )}
                                {item.variant.color && (
                                  <span
                                    className="text-xs px-1.5 py-0.5 font-medium"
                                    style={{ borderRadius: '3px', backgroundColor: 'rgb(240, 242, 245)', color: 'rgb(75, 85, 99)' }}
                                  >
                                    {item.variant.color}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-sm font-extrabold" style={{ color: 'rgb(185, 28, 28)' }}>
                              ₹{itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Order Summary</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                      {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="p-5 space-y-5">

                    {/* Coupon Applied */}
                    {cart.couponCode && (
                      <div
                        className="flex items-center gap-2 px-3 py-2.5"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(240, 253, 244)',
                          border: '1px solid rgb(187, 247, 208)',
                        }}
                      >
                        <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgb(21, 91, 48)' }} />
                        <p className="text-xs font-bold" style={{ color: 'rgb(21, 91, 48)' }}>
                          Coupon &quot;{cart.couponCode}&quot; applied
                        </p>
                      </div>
                    )}

                    {/* Free Shipping Banner */}
                    {!shippingFree && (
                      <div
                        className="flex items-center gap-2 px-3 py-2.5"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: 'rgb(239, 246, 255)',
                          border: '1px solid rgb(219, 234, 254)',
                        }}
                      >
                        <Truck className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgb(29, 78, 216)' }} />
                        <p className="text-xs" style={{ color: 'rgb(29, 78, 216)' }}>
                          Add <span className="font-bold">₹{(500 - cart.subtotal).toFixed(2)}</span> more for <span className="font-bold">FREE shipping</span>
                        </p>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'rgb(75, 85, 99)' }}>
                          Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'rgb(15, 20, 35)' }}>
                          ₹{cart.subtotal?.toFixed(2)}
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

                      {cart.discount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'rgb(75, 85, 99)' }}>Discount</span>
                          <span className="text-sm font-semibold" style={{ color: 'rgb(21, 91, 48)' }}>
                            -₹{cart.discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Divider */}
                      <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Total</span>
                        <span className="text-xl font-extrabold" style={{ color: 'rgb(185, 28, 28)' }}>
                          ₹{(cart.total + shippingCost).toFixed(2)}
                        </span>
                      </div>

                      {cart.discount > 0 && (
                        <div
                          className="flex items-center justify-center gap-1.5 py-2"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(240, 253, 244)',
                            border: '1px solid rgb(187, 247, 208)',
                          }}
                        >
                          <span className="text-xs font-bold" style={{ color: 'rgb(21, 91, 48)' }}>
                            🎉 You're saving ₹{cart.discount.toFixed(2)}!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Place Order CTA */}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!selectedAddress || isCreatingOrder}
                      className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderRadius: '6px',
                        backgroundColor: 'rgb(185, 28, 28)',
                        color: 'rgb(255, 255, 255)',
                      }}
                      onMouseEnter={e => { if (selectedAddress && !isCreatingOrder) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                    >
                      {isCreatingOrder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          Place Order
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: Shield, label: 'Secure Checkout' },
                        { icon: RotateCcw, label: 'Easy Returns' },
                        { icon: Truck, label: 'Fast Delivery' },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1 text-center">
                          <Icon className="w-4 h-4" style={{ color: 'rgb(185, 28, 28)', strokeWidth: 2 }} />
                          <span className="text-xs font-semibold" style={{ color: 'rgb(110, 118, 135)' }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                    {/* Terms */}
                    <p className="text-xs text-center leading-relaxed" style={{ color: 'rgb(150, 158, 175)' }}>
                      By placing your order, you agree to our{' '}
                      <Link href="/terms">
                        <span className="underline cursor-pointer transition-colors"
                          onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}>
                          Terms of Service
                        </span>
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy">
                        <span className="underline cursor-pointer transition-colors"
                          onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}>
                          Privacy Policy
                        </span>
                      </Link>
                    </p>
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

export default function CheckoutPageWrapper() {
  return (
    <UserProtectedRoute>
      <CheckoutPage />
    </UserProtectedRoute>
  );
}
