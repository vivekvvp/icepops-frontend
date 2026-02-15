'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Package, MapPin, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetOrderByIdQuery, useCancelOrderMutation } from '@/lib/services/api';
import { formatDateTime } from '@/lib/utils';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

const orderStatusSteps = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { data: orderData, isLoading, error } = useGetOrderByIdQuery(id);
  const [cancelOrder] = useCancelOrderMutation();

  const currentOrder = orderData?.data;

  useEffect(() => {
    if (error) {
      toast.error('Failed to load order');
      router.push('/orders');
    }
  }, [error, router]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await cancelOrder(id).unwrap();
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel order');
    }
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const currentStepIndex = orderStatusSteps.findIndex(step => step.key === currentOrder.status);
  const isCancelled = currentOrder.status === 'CANCELLED';
  const canCancel = ['PENDING', 'CONFIRMED'].includes(currentOrder.status);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders" className="text-primary hover:underline mb-2 inline-block">
          ← Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order #{currentOrder.orderNumber}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDateTime(currentOrder.createdAt)}
            </p>
          </div>
          
          {canCancel && (
            <Button variant="destructive" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Order Status Tracker */}
      {!isCancelled && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="relative">
            <div className="flex justify-between">
              {orderStatusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isCurrent ? 'font-semibold' : ''}`}>
                      {step.label}
                    </p>
                    {index < orderStatusSteps.length - 1 && (
                      <div
                        className={`absolute top-5 left-0 h-0.5 ${
                          index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                        }`}
                        style={{
                          width: `calc((100% / ${orderStatusSteps.length}) * ${index + 1})`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {isCancelled && (
        <Card className="p-6 mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Order Cancelled</h3>
              <p className="text-sm">This order has been cancelled and refund is being processed.</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            
            <div className="space-y-4">
              {currentOrder.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg">
                    {(item.image || item.productId?.images?.[0]) ? (
                      <Image
                        src={item.image || item.productId.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {item.productId?.slug ? (
                      <Link href={`/products/${item.productId.slug}`}>
                        <h3 className="font-semibold hover:text-primary">{item.name}</h3>
                      </Link>
                    ) : (
                      <h3 className="font-semibold">{item.name}</h3>
                    )}
                    {item.selectedVariant && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.selectedVariant.size && `Size: ${item.selectedVariant.size}`}
                        {item.selectedVariant.color && ` | Color: ${item.selectedVariant.color}`}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <div className="text-gray-700">
              <p className="font-semibold">{currentOrder.shippingAddress.fullName}</p>
              <p>{currentOrder.shippingAddress.phone}</p>
              <p className="mt-2">
                {currentOrder.shippingAddress.addressLine1}
                {currentOrder.shippingAddress.addressLine2 && `, ${currentOrder.shippingAddress.addressLine2}`}
              </p>
              <p>
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pinCode}
              </p>
              <p>{currentOrder.shippingAddress.country}</p>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{currentOrder.subtotal}</span>
              </div>
              
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{currentOrder.discount}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {currentOrder.shippingCost === 0 ? 'FREE' : `₹${currentOrder.shippingCost}`}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Tax (GST)</span>
                <span>₹{currentOrder.tax}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{currentOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">Payment Method</h3>
              </div>
              <p className="text-sm">{currentOrder.paymentMethod}</p>
              <p className={`text-sm mt-1 ${
                currentOrder.paymentStatus === 'PAID' ? 'text-green-600' :
                currentOrder.paymentStatus === 'FAILED' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                Status: {currentOrder.paymentStatus}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedOrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <UserProtectedRoute>
      <OrderDetailPage params={params} />
    </UserProtectedRoute>
  );
}
