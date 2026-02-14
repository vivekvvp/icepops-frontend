'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetCategoryTreeQuery, useDeleteCategoryMutation, useCreateCategoryMutation } from '@/lib/services/api';
import { toast } from 'sonner';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const { data: categoriesData, isLoading, error } = useGetCategoryTreeQuery(undefined);
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const categories = categoriesData?.data || [];

  useEffect(() => {
    if (error) {
      toast.error('Failed to load categories');
    }
  }, [error]);

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteCategory(categoryId).unwrap();
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await createCategory({
        name: formData.name,
        description: formData.description,
        image: formData.image || undefined,
        isActive: true,
      }).unwrap();
      
      toast.success('Category created successfully');
      setShowModal(false);
      setFormData({ name: '', description: '', image: '' });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create category');
    }
  };

  const renderCategory = (category: Category, level = 0) => {
    return (
      <div key={category._id}>
        <Card className="p-4 mb-3" style={{ marginLeft: `${level * 20}px` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  /{category.slug}
                  {category.description && ` • ${category.description}`}
                </p>
              </div>
              {!category.isActive && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  Inactive
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(category._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
        
        {category.children && category.children.map(child => renderCategory(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-gray-600 mt-1">Manage product categories and subcategories</p>
        </div>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderTree className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">No categories yet</h2>
          <p className="text-gray-600 mb-6">Create your first category to organize products</p>
          <Button className="gap-2" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </Card>
      ) : (
        <div>
          {categories.map((category: any) => renderCategory(category))}
        </div>
      )}

      {/* Create Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Create Category</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Popsicles"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the category"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
