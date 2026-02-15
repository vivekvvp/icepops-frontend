'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useGetUserOrdersQuery } from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';
import { useEffect } from 'react';

const orderStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data: ordersData, isLoading, error } = useGetUserOrdersQuery({ page, limit: 10 });

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination;

  useEffect(() => {
    if (error) {
      toast.error('Failed to load orders');
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <Link href="/products">
            <Button>Browse Products</Button>
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
            <BreadcrumbPage>My Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order: any) => {
          // Safety check for missing order data
          if (!order || !order._id) {
            return null;
          }
          
          return (
            <Card key={order._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Order #{order.orderNumber || 'N/A'}</h3>
                  <p className="text-sm text-gray-600">
                    Placed on {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {(order.status || 'PENDING').replace(/_/g, ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-800'}`}>
                      {order.paymentStatus || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>{order.items?.length || 0} item(s)</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold">₹{order.total || 0}</p>
                </div>
                
                <Link href={`/orders/${order._id}`}>
                  <Button variant="outline" className="gap-2">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === pagination.page ? 'default' : 'outline'}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProtectedOrdersPage() {
  return (
    <UserProtectedRoute>
      <OrdersPage />
    </UserProtectedRoute>
  );
}
