'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllOrdersQuery } from '@/lib/services/api';
import { toast } from 'sonner';

const orderStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  
  const { data: ordersData, isLoading, error } = useGetAllOrdersQuery({ 
    page, 
    limit: 20, 
    status: statusFilter || undefined 
  });

  const orders = ordersData?.data?.orders || [];
  const totalPages = ordersData?.data?.pagination?.totalPages || 1;

  useEffect(() => {
    if (error) {
      toast.error('Failed to load orders');
    }
  }, [error]);

  const filteredOrders = orders.filter((order: any) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by order number, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PACKED">Packed</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">No orders found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => (
            <Card key={order._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer: {order.user.name} ({order.user.email})
                  </p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColors[order.orderStatus]}`}>
                  {order.orderStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold">₹{order.total}</p>
                  <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                </div>
                
                <Link href={`/admin/orders/${order._id}`}>
                  <Button className="gap-2">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
