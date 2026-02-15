'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetCouponByIdQuery, useUpdateCouponMutation } from '@/lib/services/api';
import { toast } from 'sonner';

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;

  const { data: couponData, isLoading: loadingCoupon, error } = useGetCouponByIdQuery(couponId);
  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: '',
    maxDiscount: '',
    minCartValue: '',
    usageLimit: '',
    startDate: '',
    expiryDate: '',
    isActive: true,
  });

  useEffect(() => {
    if (couponData?.data) {
      const coupon = couponData.data;
      setFormData({
        code: coupon.code || '',
        description: coupon.description || '',
        type: coupon.type || 'PERCENTAGE',
        value: coupon.value?.toString() || '',
        maxDiscount: coupon.maxDiscount?.toString() || '',
        minCartValue: coupon.minCartValue?.toString() || '',
        usageLimit: coupon.usageLimit?.toString() || '',
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : '',
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 16) : '',
        isActive: coupon.isActive ?? true,
      });
    }
  }, [couponData]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load coupon');
      router.push('/admin/coupons');
    }
  }, [error, router]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.description || !formData.value || !formData.startDate || !formData.expiryDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const value = parseFloat(formData.value);
    if (isNaN(value) || value <= 0) {
      toast.error('Discount value must be greater than 0');
      return;
    }

    if (formData.type === 'PERCENTAGE' && value > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    try {
      const payload: any = {
        id: couponId,
        code: formData.code.toUpperCase().trim(),
        description: formData.description.trim(),
        type: formData.type,
        value,
        startDate: new Date(formData.startDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        isActive: formData.isActive,
      };

      if (formData.maxDiscount) {
        payload.maxDiscount = parseFloat(formData.maxDiscount);
      }

      if (formData.minCartValue) {
        payload.minCartValue = parseFloat(formData.minCartValue);
      }

      if (formData.usageLimit) {
        payload.usageLimit = parseInt(formData.usageLimit);
      }

      await updateCoupon(payload).unwrap();
      toast.success('Coupon updated successfully');
      router.push('/admin/coupons');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update coupon');
    }
  };

  if (loadingCoupon) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Coupon</h1>
          <p className="text-gray-600 mt-1">Update coupon details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">
                    Coupon Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                    placeholder="e.g., SAVE20"
                    className="mt-2 font-mono"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Code will be automatically converted to uppercase
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe what this coupon offers"
                    rows={3}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Discount Configuration */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Discount Configuration</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">
                    Discount Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange('type', value)}
                  >
                    <SelectTrigger id="type" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="value">
                    Discount Value <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    placeholder={formData.type === 'PERCENTAGE' ? '10' : '100'}
                    min="0"
                    step={formData.type === 'PERCENTAGE' ? '0.01' : '1'}
                    className="mt-2"
                    required
                  />
                </div>

                {formData.type === 'PERCENTAGE' && (
                  <div>
                    <Label htmlFor="maxDiscount">Maximum Discount (₹)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => handleChange('maxDiscount', e.target.value)}
                      placeholder="e.g., 500"
                      min="0"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Optional: Cap the maximum discount amount
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="minCartValue">Minimum Cart Value (₹)</Label>
                  <Input
                    id="minCartValue"
                    type="number"
                    value={formData.minCartValue}
                    onChange={(e) => handleChange('minCartValue', e.target.value)}
                    placeholder="e.g., 500"
                    min="0"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Minimum cart value required to use this coupon
                  </p>
                </div>
              </div>
            </Card>

            {/* Usage & Validity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Usage & Validity</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => handleChange('usageLimit', e.target.value)}
                    placeholder="e.g., 100"
                    min="1"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional: Total number of times this coupon can be used
                  </p>
                </div>

                <div>
                  <Label htmlFor="expiryDate">
                    Expiry Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expiryDate"
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <div>
                <Label htmlFor="isActive">Coupon Status</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => handleChange('isActive', value === 'true')}
                >
                  <SelectTrigger id="isActive" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Updating...' : 'Update Coupon'}
                </Button>
                <Link href="/admin/coupons">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Preview */}
            {formData.code && (
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <h3 className="font-semibold mb-3">Preview</h3>
                <div className="space-y-2 text-sm">
                  <div className="font-mono text-2xl font-bold text-primary">
                    {formData.code || 'CODE'}
                  </div>
                  <p className="text-gray-600">{formData.description || 'Description'}</p>
                  {formData.value && (
                    <p className="font-semibold">
                      {formData.type === 'PERCENTAGE'
                        ? `${formData.value}% OFF`
                        : `₹${formData.value} OFF`}
                    </p>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
