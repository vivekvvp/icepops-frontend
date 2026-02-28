'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { useCreateCouponMutation } from '@/lib/services/api';
import { toast } from 'sonner';

const card: React.CSSProperties = {
  backgroundColor: 'rgb(255, 255, 255)',
  border: '1px solid rgb(220, 223, 230)',
  borderRadius: '8px',
  overflow: 'hidden',
  
};

const sectionHeader = (title: string, subtitle?: string) => (
  <div
    className="px-5 py-4"
    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
  >
    <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>{title}</p>
    {subtitle && (
      <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>{subtitle}</p>
    )}
  </div>
);

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '6px',
  color: 'rgb(55, 65, 81)',
};

const hintStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgb(150, 158, 175)',
  marginTop: '4px',
};

export default function CreateCouponPage() {
  const router = useRouter();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

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
    isActive: 'true',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputStyle = (field?: string): React.CSSProperties => ({
    width: '100%',
    height: '38px',
    padding: '0 12px',
    fontSize: '13px',
    borderRadius: '6px',
    border: `1px solid ${field && errors[field] ? 'rgb(185, 28, 28)' : 'rgb(220, 223, 230)'}`,
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(15, 20, 35)',
    outline: 'none',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.code.trim()) e.code = 'Coupon code is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    if (!formData.value) e.value = 'Discount value is required';
    else if (isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0)
      e.value = 'Must be greater than 0';
    else if (formData.type === 'PERCENTAGE' && parseFloat(formData.value) > 100)
      e.value = 'Percentage cannot exceed 100%';
    if (!formData.startDate) e.startDate = 'Start date is required';
    if (!formData.expiryDate) e.expiryDate = 'Expiry date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload: any = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description.trim(),
        type: formData.type,
        value: parseFloat(formData.value),
        startDate: new Date(formData.startDate).toISOString(),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        isActive: formData.isActive === 'true',
      };
      if (formData.maxDiscount) payload.maxDiscount = parseFloat(formData.maxDiscount);
      if (formData.minCartValue) payload.minCartValue = parseFloat(formData.minCartValue);
      if (formData.usageLimit) payload.usageLimit = parseInt(formData.usageLimit);

      await createCoupon(payload).unwrap();
      toast.success('Coupon created successfully');
      router.push('/admin/coupons');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create coupon');
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 transition-colors"
            style={{
              borderRadius: '6px',
              border: '1px solid rgb(220, 223, 230)',
              backgroundColor: 'rgb(255, 255, 255)',
              color: 'rgb(100, 108, 125)',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(246, 247, 249)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
              Create Coupon
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
              Add a new discount coupon
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Information */}
            <div style={card}>
              {sectionHeader('Basic Information', 'Coupon code and description')}
              <div className="p-5 space-y-4">

                {/* Code */}
                <div>
                  <label style={labelStyle}>
                    Coupon Code <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                  </label>
                  <input
                    value={formData.code}
                    onChange={e => handleChange('code', e.target.value.toUpperCase())}
                    placeholder="e.g., SAVE20"
                    style={{ ...inputStyle('code'), fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                    onBlur={e => { if (!errors.code) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                  />
                  {errors.code
                    ? <p style={{ ...hintStyle, color: 'rgb(185, 28, 28)' }}>{errors.code}</p>
                    : <p style={hintStyle}>Code will be automatically converted to uppercase</p>
                  }
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>
                    Description <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder="Describe what this coupon offers"
                    rows={3}
                    style={{
                      ...inputStyle('description'),
                      height: 'auto',
                      padding: '10px 12px',
                      resize: 'vertical',
                      lineHeight: '1.5',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                    onBlur={e => { if (!errors.description) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                  />
                  {errors.description && (
                    <p style={{ ...hintStyle, color: 'rgb(185, 28, 28)' }}>{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Discount Configuration */}
            <div style={card}>
              {sectionHeader('Discount Configuration', 'Set the discount type and value')}
              <div className="p-5 space-y-4">

                {/* Type */}
                <div>
                  <label style={labelStyle}>
                    Discount Type <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => handleChange('type', e.target.value)}
                    style={inputStyle()}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                {/* Value */}
                <div>
                  <label style={labelStyle}>
                    Discount Value <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '13px', fontWeight: 700, color: 'rgb(185, 28, 28)',
                      }}
                    >
                      {formData.type === 'PERCENTAGE' ? '%' : '₹'}
                    </span>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={e => handleChange('value', e.target.value)}
                      placeholder={formData.type === 'PERCENTAGE' ? '10' : '100'}
                      min="0"
                      step={formData.type === 'PERCENTAGE' ? '0.01' : '1'}
                      style={{ ...inputStyle('value'), paddingLeft: '28px' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                      onBlur={e => { if (!errors.value) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                    />
                  </div>
                  {errors.value && (
                    <p style={{ ...hintStyle, color: 'rgb(185, 28, 28)' }}>{errors.value}</p>
                  )}
                </div>

                {/* Max Discount (only for PERCENTAGE) */}
                {formData.type === 'PERCENTAGE' && (
                  <div>
                    <label style={labelStyle}>Maximum Discount (₹)</label>
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                          fontSize: '13px', fontWeight: 700, color: 'rgb(150, 158, 175)',
                        }}
                      >
                        ₹
                      </span>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={e => handleChange('maxDiscount', e.target.value)}
                        placeholder="500"
                        min="0"
                        style={{ ...inputStyle(), paddingLeft: '28px' }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                      />
                    </div>
                    <p style={hintStyle}>Optional — cap the maximum discount amount</p>
                  </div>
                )}

                {/* Min Cart Value */}
                <div>
                  <label style={labelStyle}>Minimum Cart Value (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        fontSize: '13px', fontWeight: 700, color: 'rgb(150, 158, 175)',
                      }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      value={formData.minCartValue}
                      onChange={e => handleChange('minCartValue', e.target.value)}
                      placeholder="500"
                      min="0"
                      style={{ ...inputStyle(), paddingLeft: '28px' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                    />
                  </div>
                  <p style={hintStyle}>Optional — minimum cart value required to apply this coupon</p>
                </div>
              </div>
            </div>

            {/* Usage & Validity */}
            <div style={card}>
              {sectionHeader('Usage & Validity', 'Set date range and usage limits')}
              <div className="p-5 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label style={labelStyle}>
                      Start Date <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={e => handleChange('startDate', e.target.value)}
                      style={inputStyle('startDate')}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                      onBlur={e => { if (!errors.startDate) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                    />
                    {errors.startDate && (
                      <p style={{ ...hintStyle, color: 'rgb(185, 28, 28)' }}>{errors.startDate}</p>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label style={labelStyle}>
                      Expiry Date <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.expiryDate}
                      onChange={e => handleChange('expiryDate', e.target.value)}
                      style={inputStyle('expiryDate')}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                      onBlur={e => { if (!errors.expiryDate) e.currentTarget.style.borderColor = 'rgb(220, 223, 230)' }}
                    />
                    {errors.expiryDate && (
                      <p style={{ ...hintStyle, color: 'rgb(185, 28, 28)' }}>{errors.expiryDate}</p>
                    )}
                  </div>
                </div>

                {/* Usage Limit */}
                <div>
                  <label style={labelStyle}>Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={e => handleChange('usageLimit', e.target.value)}
                    placeholder="e.g., 100"
                    min="1"
                    style={inputStyle()}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                  />
                  <p style={hintStyle}>Optional — leave blank for unlimited uses</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar (1/3) ── */}
          <div className="space-y-6">

            {/* Status */}
            <div style={card}>
              {sectionHeader('Status')}
              <div className="p-5">
                <label style={labelStyle}>Coupon Status</label>
                <select
                  value={formData.isActive}
                  onChange={e => handleChange('isActive', e.target.value)}
                  style={inputStyle()}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <div className="mt-3">
                  <span
                    className="text-xs font-bold px-2.5 py-1"
                    style={
                      formData.isActive === 'true'
                        ? { borderRadius: '4px', backgroundColor: 'rgb(240, 253, 244)', color: 'rgb(21, 91, 48)', border: '1px solid rgb(187, 247, 208)' }
                        : { borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)', border: '1px solid rgb(254, 202, 202)' }
                    }
                  >
                    {formData.isActive === 'true' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.code && (
              <div
                style={{
                  ...card,
                  overflow: 'hidden',
                }}
              >
                {sectionHeader('Preview')}
                <div className="p-5 space-y-3">
                  <div
                    className="font-bold tracking-widest text-xl"
                    style={{ fontFamily: 'monospace', color: 'rgb(185, 28, 28)' }}
                  >
                    {formData.code}
                  </div>
                  {formData.description && (
                    <p style={{ fontSize: '13px', color: 'rgb(110, 118, 135)' }}>
                      {formData.description}
                    </p>
                  )}
                  {formData.value && (
                    <span
                      className="text-xs font-bold px-2.5 py-1 inline-flex"
                      style={{
                        borderRadius: '4px',
                        backgroundColor: 'rgb(240, 253, 244)',
                        color: 'rgb(21, 91, 48)',
                        border: '1px solid rgb(187, 247, 208)',
                      }}
                    >
                      {formData.type === 'PERCENTAGE'
                        ? `${formData.value}% OFF`
                        : `₹${formData.value} OFF`}
                    </span>
                  )}
                  {formData.minCartValue && (
                    <p style={{ fontSize: '12px', color: 'rgb(150, 158, 175)' }}>
                      Min cart: ₹{formData.minCartValue}
                    </p>
                  )}
                  {formData.expiryDate && (
                    <p style={{ fontSize: '12px', color: 'rgb(150, 158, 175)' }}>
                      Expires: {new Date(formData.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={card}>
              {sectionHeader('Actions')}
              <div className="p-5 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                  onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                >
                  <Tag className="w-4 h-4 stroke-[2.5]" />
                  {isLoading ? 'Creating...' : 'Create Coupon'}
                </button>

                <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                <Link href="/admin/coupons">
                  <button
                    type="button"
                    className="w-full text-sm font-semibold py-2.5 transition-colors"
                    style={{
                      borderRadius: '6px',
                      border: '1px solid rgb(220, 223, 230)',
                      backgroundColor: 'rgb(255, 255, 255)',
                      color: 'rgb(55, 65, 81)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(246, 247, 249)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
