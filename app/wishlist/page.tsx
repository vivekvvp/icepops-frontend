'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useAddToCartMutation } from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

function WishlistPage() {
  const router = useRouter();
  const { data: wishlistData, isLoading } = useGetWishlistQuery(undefined);
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const items = wishlistData?.data?.products || [];

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove item');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success('Added to cart');
      router.push('/cart');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite products here</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({items.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product: any) => {
          // Safety check for missing product data
          if (!product || !product._id) {
            return null;
          }
          
          return (
            <Card key={product._id} className="overflow-hidden group">
              <div className="relative aspect-square">
                <Link href={`/products/${product._id}`}>
                  <Image
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
                
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-semibold hover:text-primary mb-2 line-clamp-2">
                    {product.name || 'Product'}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold">₹{product.price || 0}</span>
                  {product.comparePrice && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.comparePrice}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {product.averageRating && (
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  {(product.stock || 0) > 0 ? (
                    <Button
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  ) : (
                    <Button disabled className="flex-1" size="sm">
                      Out of Stock
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function ProtectedWishlistPage() {
  return (
    <UserProtectedRoute>
      <WishlistPage />
    </UserProtectedRoute>
  );
}
