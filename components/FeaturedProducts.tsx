'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetProductsQuery } from '@/lib/services/api';

export default function FeaturedProducts() {
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 8, isPublished: true });
  
  const products = data?.data?.products || [];

  if (isLoading) {
    return (
      <section className="px-4 md:px-10 py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">Loading delicious ice pops...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-10 py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg">
            Discover our most popular ice pops
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.slice(0, 8).map((product: any) => {
            if (!product || !product._id) return null;
            
            return (
              <Card key={product._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <Link href={`/products/${product._id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.images?.[0] || product.productImage || '/placeholder.png'}
                      alt={product.name || 'Product'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {product.comparePrice && product.comparePrice > product.price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name || 'Product'}
                    </h3>
                  </Link>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    {product.averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{product.price || 0}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{product.comparePrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link href={`/products/${product._id}`}>
                    <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <ShoppingCart className="w-4 h-4" />
                      View Product
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
