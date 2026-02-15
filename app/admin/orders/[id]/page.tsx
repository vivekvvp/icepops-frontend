'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, MapPin, CreditCard, User, Phone, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatDate } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/lib/services/api';
import { toast } from 'sonner';

const orderStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
  PACKED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800 border-orange-300',
  DELIVERED: 'bg-green-100 text-green-800 border-green-300',
  CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  RETURNED: 'bg-gray-100 text-gray-800 border-gray-300',
};

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: orderData, isLoading, error } = useGetOrderByIdQuery(orderId);
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const order = orderData?.data;

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load order details');
    }
  }, [error]);

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus({
        id: orderId,
        status: selectedStatus,
        trackingNumber: trackingNumber || undefined,
      }).unwrap();
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Order not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-1">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Update */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Update Order Status
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Current Status</Label>
                <div className={`mt-2 px-4 py-2 rounded-lg border-2 inline-flex items-center font-medium ${orderStatusColors[order.status]}`}>
                  {order.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(selectedStatus === 'SHIPPED' || selectedStatus === 'OUT_FOR_DELIVERY') && (
                <div>
                  <Label htmlFor="tracking">Tracking Number (Optional)</Label>
                  <Input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="mt-2"
                  />
                </div>
              )}

              <Button
                onClick={handleUpdateStatus}
                disabled={isUpdating || selectedStatus === order.status}
                className="w-full"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  {(item.image || item.productId?.images?.[0]) ? (
                    <img
                      src={item.image || item.productId.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium mt-1">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress.phone}</p>
              <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{order.userId?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{order.userId?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{order.userId?.phone || 'N/A'}</span>
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <p className="font-medium mt-1">{order.paymentMethod.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Status:</span>
                <p className={`font-medium mt-1 ${order.paymentStatus === 'COMPLETED' ? 'text-green-600' : order.paymentStatus === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus}
                </p>
              </div>
              {order.trackingNumber && (
                <div>
                  <span className="text-gray-600">Tracking Number:</span>
                  <p className="font-medium mt-1">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Billing Address */}
          {order.billingAddress && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.billingAddress.fullName}</p>
                <p className="text-gray-600">{order.billingAddress.phone}</p>
                <p className="text-gray-600">{order.billingAddress.addressLine1}</p>
                {order.billingAddress.addressLine2 && (
                  <p className="text-gray-600">{order.billingAddress.addressLine2}</p>
                )}
                <p className="text-gray-600">
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                </p>
                <p className="text-gray-600">{order.billingAddress.country}</p>
              </div>
            </Card>
          )}

          {/* Order Timeline */}
          {order.deliveredAt && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Placed:</span>
                  <p className="font-medium">{formatDateTime(order.createdAt)}</p>
                </div>
                {order.deliveredAt && (
                  <div>
                    <span className="text-gray-600">Delivered:</span>
                    <p className="font-medium">{formatDateTime(order.deliveredAt)}</p>
                  </div>
                )}
                {order.cancelledAt && (
                  <div>
                    <span className="text-gray-600">Cancelled:</span>
                    <p className="font-medium">{formatDateTime(order.cancelledAt)}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Cancellation Reason */}
          {order.cancellationReason && (
            <Card className="p-6 bg-red-50 border-red-200">
              <h2 className="text-xl font-semibold mb-2 text-red-900">Cancellation Reason</h2>
              <p className="text-sm text-red-800">{order.cancellationReason}</p>
            </Card>
          )}

          {/* Order Notes */}
          {order.notes && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Order Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
