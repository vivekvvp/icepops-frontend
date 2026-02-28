'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Package, Edit } from 'lucide-react';
import { useGetLowStockProductsQuery } from '@/lib/services/api';
import { toast } from 'sonner';

export default function AdminInventoryPage() {
  const [threshold, setThreshold] = useState(10);

  const { data: productsData, isLoading, error } = useGetLowStockProductsQuery(threshold);

  const products = productsData?.data || [];

  useEffect(() => {
    if (error) toast.error('Failed to load inventory');
  }, [error]);

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
            Inventory Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
            Monitor and manage product stock levels
          </p>
        </div>
        <Link href="/admin/products">
          <button
            className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-md transition-colors"
            style={{ backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
          >
            <Package className="w-4 h-4 stroke-[2.5]" />
            View All Products
          </button>
        </Link>
      </div>

      {/* ── Threshold Filter ── */}
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-md"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          border: '1px solid rgb(220, 223, 230)',
        }}
      >
        <p className="text-sm font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>
          Show products with stock below:
        </p>
        <input
          type="number"
          value={threshold}
          onChange={e => setThreshold(parseInt(e.target.value) || 10)}
          min="1"
          style={{
            width: '72px',
            height: '34px',
            padding: '0 10px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '6px',
            border: '1px solid rgb(220, 223, 230)',
            backgroundColor: 'rgb(255, 255, 255)',
            color: 'rgb(15, 20, 35)',
            outline: 'none',
            textAlign: 'center',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
        />
        <p className="text-sm" style={{ color: 'rgb(110, 118, 135)' }}>units</p>
      </div>

      {/* ── Low Stock Alert Banner ── */}
      {!isLoading && products.length > 0 && (
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-md"
          style={{
            backgroundColor: 'rgb(254, 242, 242)',
            border: '1px solid rgb(254, 202, 202)',
          }}
        >
          <div
            className="flex items-center justify-center w-9 h-9 shrink-0"
            style={{
              borderRadius: '6px',
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(254, 202, 202)',
            }}
          >
            <AlertTriangle className="w-4 h-4 stroke-[2.5]" style={{ color: 'rgb(185, 28, 28)' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'rgb(153, 27, 27)' }}>
              {products.length} Product{products.length !== 1 ? 's' : ''} Need Restocking
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgb(185, 28, 28)' }}>
              These products have stock below {threshold} units
            </p>
          </div>
        </div>
      )}

      {/* ── States ── */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 rounded-md"
          style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(220, 223, 230)' }}
        >
          <p className="text-sm" style={{ color: 'rgb(156, 163, 175)' }}>Loading inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-md"
          style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(220, 223, 230)' }}
        >
          <div
            className="flex items-center justify-center w-14 h-14 mb-4"
            style={{
              borderRadius: '8px',
              backgroundColor: 'rgb(240, 253, 244)',
              border: '1px solid rgb(187, 247, 208)',
            }}
          >
            <Package className="w-6 h-6" style={{ color: 'rgb(21, 91, 48)' }} />
          </div>
          <p className="text-base font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
            All products are well stocked
          </p>
          <p className="text-sm mt-1" style={{ color: 'rgb(150, 158, 175)' }}>
            No products below {threshold} units in stock
          </p>
        </div>
      ) : (

        /* ── Table ── */
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
                  {['#', 'Product', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}
                      style={{ color: 'rgb(100, 108, 125)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product: any, index: number) => (
                  <tr
                    key={product._id}
                    style={{
                      borderBottom:
                        index < products.length - 1
                          ? '1px solid rgb(240, 242, 245)'
                          : 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(252, 252, 253)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* # */}
                    <td className="px-5 py-4 text-xs font-bold" style={{ color: 'rgb(185, 28, 28)' }}>
                      {index + 1}
                    </td>

                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover shrink-0"
                            style={{
                              borderRadius: '4px',
                              border: '1px solid rgb(220, 223, 230)',
                            }}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 shrink-0 flex items-center justify-center"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: 'rgb(243, 244, 246)',
                              border: '1px solid rgb(220, 223, 230)',
                            }}
                          >
                            <Package className="w-4 h-4" style={{ color: 'rgb(209, 213, 219)' }} />
                          </div>
                        )}
                        <p
                          className="font-semibold"
                          style={{
                            color: 'rgb(15, 20, 35)',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.name}
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>
                      ₹{product.price}
                    </td>

                    {/* Stock count */}
                    <td className="px-5 py-4">
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: product.stock === 0
                            ? 'rgb(185, 28, 28)'
                            : product.stock <= 5
                            ? 'rgb(154, 52, 18)'
                            : 'rgb(161, 72, 10)',
                        }}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={
                          product.stock === 0
                            ? {
                                borderRadius: '4px',
                                backgroundColor: 'rgb(254, 242, 242)',
                                color: 'rgb(185, 28, 28)',
                                border: '1px solid rgb(254, 202, 202)',
                              }
                            : product.stock <= 5
                            ? {
                                borderRadius: '4px',
                                backgroundColor: 'rgb(255, 247, 237)',
                                color: 'rgb(154, 52, 18)',
                                border: '1px solid rgb(254, 215, 170)',
                              }
                            : {
                                borderRadius: '4px',
                                backgroundColor: 'rgb(255, 251, 235)',
                                color: 'rgb(161, 72, 10)',
                                border: '1px solid rgb(253, 230, 138)',
                              }
                        }
                      >
                        {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/products/${product._id}`}>
                        <button
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 transition-colors ml-auto"
                          style={{
                            borderRadius: '4px',
                            border: '1px solid rgb(219, 234, 254)',
                            backgroundColor: 'rgb(239, 246, 255)',
                            color: 'rgb(29, 78, 216)',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(219, 234, 254)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(239, 246, 255)')}
                        >
                          <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
                          Update Stock
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
