'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Tag, Power, AlertTriangle } from 'lucide-react';
import { useGetAllCouponsQuery, useToggleCouponStatusMutation, useDeleteCouponMutation } from '@/lib/services/api';
import { formatShortDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminCouponsPage() {
  const { data: couponsData, isLoading, error } = useGetAllCouponsQuery({ page: 1, limit: 100 });
  const [toggleCouponStatus] = useToggleCouponStatusMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    couponId: string
    couponCode: string
  }>({ open: false, couponId: '', couponCode: '' })

  const coupons = couponsData?.data || [];

  useEffect(() => {
    if (error) toast.error('Failed to load coupons');
  }, [error]);

  const openConfirm = (id: string, code: string) =>
    setConfirmDialog({ open: true, couponId: id, couponCode: code })

  const closeConfirm = () =>
    setConfirmDialog({ open: false, couponId: '', couponCode: '' })

  const handleToggleStatus = async (couponId: string) => {
    try {
      await toggleCouponStatus(couponId).unwrap();
      toast.success('Coupon status updated');
    } catch {
      toast.error('Failed to update coupon status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCoupon(confirmDialog.couponId).unwrap();
      toast.success('Coupon deleted successfully');
      closeConfirm();
    } catch {
      toast.error('Failed to delete coupon');
      closeConfirm();
    }
  };

  const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>

      {/* ── Confirm Delete Dialog ── */}
      {confirmDialog.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
          onClick={closeConfirm}
        >
          <div
            className="w-full max-w-sm mx-4"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              borderRadius: '8px',
              border: '1px solid rgb(220, 223, 230)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-start gap-3 p-5"
              style={{ borderBottom: '1px solid rgb(240, 242, 245)' }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 shrink-0"
                style={{
                  borderRadius: '6px',
                  backgroundColor: 'rgb(254, 242, 242)',
                  border: '1px solid rgb(254, 202, 202)',
                }}
              >
                <AlertTriangle className="w-4 h-4" style={{ color: 'rgb(185, 28, 28)', strokeWidth: 2.5 }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                  Delete Coupon
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-sm" style={{ color: 'rgb(55, 65, 81)' }}>
                Are you sure you want to delete coupon{' '}
                <span className="font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                  "{confirmDialog.couponCode}"
                </span>
                ? This will permanently remove the coupon.
              </p>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-end gap-2 px-5 py-4"
              style={{
                borderTop: '1px solid rgb(240, 242, 245)',
                backgroundColor: 'rgb(248, 249, 251)',
                borderRadius: '0 0 8px 8px',
              }}
            >
              <button
                onClick={closeConfirm}
                disabled={isDeleting}
                className="text-xs font-semibold px-4 py-2 transition-colors disabled:opacity-50"
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
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-bold px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => { if (!isDeleting) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
              >
                {isDeleting ? 'Deleting...' : 'Delete Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
            Coupons
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
            Manage discount coupons and promotions
          </p>
        </div>
        <Link href="/admin/coupons/create">
          <button
            className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-md transition-all"
            style={{ backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Create Coupon
          </button>
        </Link>
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-md overflow-hidden"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          border: '1px solid rgb(220, 223, 230)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgb(220, 223, 230)',
                  backgroundColor: 'rgb(248, 249, 251)',
                }}
              >
                {['#', 'Code', 'Discount', 'Min. Cart', 'Usage', 'Expiry', 'Status', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider ${i === 7 ? 'text-right' : 'text-left'}`}
                    style={{ color: 'rgb(100, 108, 125)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm" style={{ color: 'rgb(156, 163, 175)' }}>
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Tag className="w-8 h-8" style={{ color: 'rgb(209, 213, 219)' }} />
                      <p className="text-sm font-medium" style={{ color: 'rgb(156, 163, 175)' }}>
                        No coupons yet
                      </p>
                      <Link href="/admin/coupons/create">
                        <button
                          className="text-xs font-bold mt-1"
                          style={{ color: 'rgb(185, 28, 28)' }}
                        >
                          + Create your first coupon
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon: any, index: number) => {
                  const expired = isExpired(coupon.expiryDate);
                  const usagePercent = coupon.usageLimit
                    ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)
                    : 0;

                  return (
                    <tr
                      key={coupon._id}
                      style={{
                        borderBottom: index < coupons.length - 1 ? '1px solid rgb(240, 242, 245)' : 'none',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(252, 252, 253)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-xs font-bold" style={{ color: 'rgb(185, 28, 28)' }}>
                        {index + 1}
                      </td>

                      {/* Code + Description */}
                      <td className="px-5 py-4">
                        <p
                          className="font-bold tracking-widest text-sm"
                          style={{ color: 'rgb(15, 20, 35)', fontFamily: 'monospace' }}
                        >
                          {coupon.code}
                        </p>
                        {coupon.description && (
                          <p className="text-xs mt-0.5 max-w-[160px] truncate" style={{ color: 'rgb(150, 158, 175)' }}>
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-bold px-2.5 py-1 inline-flex"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(240, 253, 244)',
                            color: 'rgb(21, 91, 48)',
                            border: '1px solid rgb(187, 247, 208)',
                          }}
                        >
                          {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `₹${coupon.value}`}
                        </span>
                        {coupon.maxDiscount && (
                          <p className="text-xs mt-1" style={{ color: 'rgb(150, 158, 175)' }}>
                            max ₹{coupon.maxDiscount}
                          </p>
                        )}
                      </td>

                      {/* Min Cart */}
                      <td className="px-5 py-4 text-sm font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>
                        {coupon.minCartValue ? `₹${coupon.minCartValue}` : '—'}
                      </td>

                      {/* Usage */}
                      <td className="px-5 py-4">
                        {coupon.usageLimit ? (
                          <div style={{ minWidth: '100px' }}>
                            <div className="flex justify-between text-xs mb-1">
                              <span style={{ color: 'rgb(110, 118, 135)' }}>Used</span>
                              <span className="font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                                {coupon.usedCount}/{coupon.usageLimit}
                              </span>
                            </div>
                            <div
                              className="w-full h-1.5 rounded-full overflow-hidden"
                              style={{ backgroundColor: 'rgb(229, 231, 235)' }}
                            >
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${usagePercent}%`,
                                  backgroundColor: usagePercent >= 90
                                    ? 'rgb(185, 28, 28)'
                                    : usagePercent >= 60
                                    ? 'rgb(161, 72, 10)'
                                    : 'rgb(21, 91, 48)',
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: 'rgb(150, 158, 175)' }}>Unlimited</span>
                        )}
                      </td>

                      {/* Expiry */}
                      <td className="px-5 py-4">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: expired ? 'rgb(185, 28, 28)' : 'rgb(55, 65, 81)' }}
                        >
                          {formatShortDate(coupon.expiryDate)}
                        </p>
                        {expired && (
                          <p className="text-xs mt-0.5" style={{ color: 'rgb(185, 28, 28)' }}>
                            Expired
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-bold px-2.5 py-1"
                          style={
                            !coupon.isActive || expired
                              ? { borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)', border: '1px solid rgb(254, 202, 202)' }
                              : { borderRadius: '4px', backgroundColor: 'rgb(240, 253, 244)', color: 'rgb(21, 91, 48)', border: '1px solid rgb(187, 247, 208)' }
                          }
                        >
                          {!coupon.isActive ? 'Inactive' : expired ? 'Expired' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">

                          {/* Toggle */}
                          <button
                            onClick={() => handleToggleStatus(coupon._id)}
                            className="p-1.5 transition-colors"
                            style={{ borderRadius: '4px', color: 'rgb(100, 108, 125)' }}
                            title={coupon.isActive ? 'Deactivate' : 'Activate'}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = coupon.isActive ? 'rgb(161, 72, 10)' : 'rgb(21, 91, 48)'
                              e.currentTarget.style.backgroundColor = coupon.isActive ? 'rgb(255, 251, 235)' : 'rgb(240, 253, 244)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = 'rgb(100, 108, 125)'
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Power className="w-4 h-4 stroke-[2.5]" />
                          </button>

                          {/* Edit */}
                          <Link href={`/admin/coupons/${coupon._id}`}>
                            <button
                              className="p-1.5 transition-colors"
                              style={{ borderRadius: '4px', color: 'rgb(100, 108, 125)' }}
                              title="Edit"
                              onMouseEnter={e => {
                                e.currentTarget.style.color = 'rgb(29, 78, 216)'
                                e.currentTarget.style.backgroundColor = 'rgb(239, 246, 255)'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = 'rgb(100, 108, 125)'
                                e.currentTarget.style.backgroundColor = 'transparent'
                              }}
                            >
                              <Edit className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => openConfirm(coupon._id, coupon.code)}
                            disabled={isDeleting}
                            className="p-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ borderRadius: '4px', color: 'rgb(150, 158, 175)' }}
                            title="Delete"
                            onMouseEnter={e => {
                              e.currentTarget.style.color = 'rgb(185, 28, 28)'
                              e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = 'rgb(150, 158, 175)'
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <Trash2 className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
