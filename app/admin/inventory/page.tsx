'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Package, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetLowStockProductsQuery } from '@/lib/services/api';
import { toast } from 'sonner';

export default function AdminInventoryPage() {
  const [threshold, setThreshold] = useState(10);
  
  const { data: productsData, isLoading, error } = useGetLowStockProductsQuery(threshold);

  const products = productsData?.data || [];

  useEffect(() => {
    if (error) {
      toast.error('Failed to load inventory');
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage product stock levels</p>
        </div>
        <Link href="/admin/products">
          <Button>View All Products</Button>
        </Link>
      </div>

      {/* Threshold Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">
            Show products with stock below:
          </label>
          <Input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 10)}
            className="w-24"
            min="1"
          />
          <span className="text-sm text-gray-600">units</span>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {!isLoading && products.length > 0 && (
        <Card className="p-6 bg-red-50 dark:bg-red-900/10 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900 dark:text-red-200">
              {products.length} Product{products.length !== 1 ? 's' : ''} Need Restocking
            </h2>
          </div>
        </Card>
      )}

      {/* Products List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-2">All products are well stocked</h2>
          <p className="text-gray-600">No products below {threshold} units in stock</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product._id} className="p-6">
              <div className="flex gap-4">
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">₹{product.price}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock === 0
                        ? 'bg-red-100 text-red-800'
                        : product.stock <= 5
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Edit className="w-4 h-4" />
                        Update Stock
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
