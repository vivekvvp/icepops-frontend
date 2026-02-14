'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

function AddressesPage() {
  const { data: addressesData, isLoading } = useGetAllAddressesQuery(undefined);
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  });

  const addresses = addressesData?.data || [];

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (address: any) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAddress({ id: editingId, ...formData }).unwrap();
        toast.success('Address updated successfully');
      } else {
        await createAddress(formData).unwrap();
        toast.success('Address added successfully');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${editingId ? 'update' : 'add'} address`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await deleteAddress(id).unwrap();
      toast.success('Address deleted successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id).unwrap();
      toast.success('Default address updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to set default address');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>

        {/* Address Form */}
        {showForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="House number, street name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Apartment, suite, building (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit">{editingId ? 'Update' : 'Save'} Address</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Address List */}
        {addresses.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">No addresses saved</h2>
            <p className="text-gray-600 mb-6">Add your first address to proceed with orders</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address: any) => (
              <Card key={address._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{address.fullName}</h3>
                      {address.isDefault && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          <CheckCircle className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-gray-600 mb-1">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Phone:</span> {address.phone}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address._id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProtectedAddressesPage() {
  return (
    <UserProtectedRoute>
      <AddressesPage />
    </UserProtectedRoute>
  );
}
