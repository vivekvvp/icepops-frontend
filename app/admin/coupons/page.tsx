'use client';

import { useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Power } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllCouponsQuery, useToggleCouponStatusMutation, useDeleteCouponMutation } from '@/lib/services/api';
import { toast } from 'sonner';

export default function AdminCouponsPage() {
  const { data: couponsData, isLoading, error } = useGetAllCouponsQuery({ page: 1, limit: 100 });
  const [toggleCouponStatus] = useToggleCouponStatusMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = couponsData?.data?.coupons || [];

  useEffect(() => {
    if (error) {
      toast.error('Failed to load coupons');
    }
  }, [error]);

  const handleToggleStatus = async (couponId: string) => {
    try {
      await toggleCouponStatus(couponId).unwrap();
      toast.success('Coupon status updated');
    } catch (error: any) {
      toast.error('Failed to update coupon status');
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await deleteCoupon(couponId).unwrap();
      toast.success('Coupon deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete coupon');
    }
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons & Discounts</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons and promotions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Coupon
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : coupons.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No coupons yet</h2>
          <p className="text-gray-600 mb-6">Create your first coupon to offer discounts</p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Coupon
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon: any) => {
            const expired = isExpired(coupon.expiryDate);
            const usagePercent = coupon.usageLimit 
              ? (coupon.usedCount / coupon.usageLimit) * 100 
              : 0;

            return (
              <Card key={coupon._id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold font-mono">{coupon.code}</h3>
                      {!coupon.isActive && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          Inactive
                        </span>
                      )}
                      {expired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-semibold">
                      {coupon.discountType === 'PERCENTAGE' 
                        ? `${coupon.discountValue}%` 
                        : `₹${coupon.discountValue}`}
                      {coupon.maxDiscount && ` (max ₹${coupon.maxDiscount})`}
                    </span>
                  </div>
                  
                  {coupon.minCartValue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Min. Cart Value:</span>
                      <span className="font-semibold">₹{coupon.minCartValue}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valid Until:</span>
                    <span className="font-semibold">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  {coupon.usageLimit && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-semibold">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(coupon._id)}
                    className="flex-1 gap-2"
                  >
                    <Power className="w-4 h-4" />
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(coupon._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
