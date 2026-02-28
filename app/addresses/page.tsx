'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Plus, Edit, Trash2, CheckCircle, ChevronRight, X,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

const inputStyle: React.CSSProperties = {
  borderRadius: '4px',
  border: '1px solid rgb(220, 223, 230)',
  backgroundColor: 'rgb(255, 255, 255)',
  color: 'rgb(15, 20, 35)',
  padding: '8px 12px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
};

const emptyForm = {
  fullName: '', phone: '', addressLine1: '',
  addressLine2: '', city: '', state: '', postalCode: '', country: 'India',
};

function AddressesPage() {
  const { data: addressesData, isLoading } = useGetAllAddressesQuery(undefined);
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const addresses = addressesData?.data || [];

  const resetForm = () => {
    setFormData(emptyForm);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgb(185, 28, 28)', borderTopColor: 'transparent' }}
            />
            <p className="text-sm font-medium" style={{ color: 'rgb(110, 118, 135)' }}>
              Loading addresses...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
      <Header />

      <main className="flex-1">
        <section className="px-4 md:px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* ── Breadcrumb ── */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
              <Link href="/">
                <span
                  className="transition-colors cursor-pointer"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(185, 28, 28)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgb(150, 158, 175)')}
                >
                  Home
                </span>
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>My Addresses</span>
            </div>

            {/* ── Page Title ── */}
            <div
              className="flex items-center justify-between pb-5"
              style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
            >
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
                  My Addresses
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                  {addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}
                </p>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 transition-colors"
                  style={{
                    borderRadius: '6px',
                    backgroundColor: 'rgb(185, 28, 28)',
                    color: 'rgb(255, 255, 255)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Add New Address
                </button>
              )}
            </div>

            {/* ── Add / Edit Form ── */}
            {showForm && (
              <div
                className="overflow-hidden"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(220, 223, 230)',
                  borderRadius: '6px',
                }}
              >
                {/* Form Header */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center w-7 h-7"
                      style={{ borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                    >
                      <MapPin className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                        {editingId ? 'Edit Address' : 'Add New Address'}
                      </h2>
                      <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>
                        {editingId ? 'Update your saved address' : 'Fill in the details below'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="flex items-center justify-center w-7 h-7 transition-colors"
                    style={{
                      borderRadius: '4px',
                      border: '1px solid rgb(220, 223, 230)',
                      backgroundColor: 'rgb(255, 255, 255)',
                      color: 'rgb(110, 118, 135)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                      e.currentTarget.style.borderColor = 'rgb(185, 28, 28)'
                      e.currentTarget.style.color = 'rgb(185, 28, 28)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)'
                      e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                      e.currentTarget.style.color = 'rgb(110, 118, 135)'
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'fullName', label: 'Full Name', placeholder: 'John Doe', type: 'text', required: true },
                      { id: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', type: 'tel', required: true },
                    ].map(field => (
                      <div key={field.id}>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(75, 85, 99)' }}>
                          {field.label} <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                        </label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={(formData as any)[field.id]}
                          onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                          required={field.required}
                          style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                        />
                      </div>
                    ))}
                  </div>

                  {[
                    { id: 'addressLine1', label: 'Address Line 1', placeholder: 'House no., Building, Street', required: true },
                    { id: 'addressLine2', label: 'Address Line 2', placeholder: 'Apartment, landmark (optional)', required: false },
                  ].map(field => (
                    <div key={field.id}>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(75, 85, 99)' }}>
                        {field.label} {field.required && <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={(formData as any)[field.id]}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                        required={field.required}
                        style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'city', label: 'City', placeholder: 'Mumbai' },
                      { id: 'state', label: 'State', placeholder: 'Maharashtra' },
                      { id: 'postalCode', label: 'Postal Code', placeholder: '400001' },
                    ].map(field => (
                      <div key={field.id}>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(75, 85, 99)' }}>
                          {field.label} <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={(formData as any)[field.id]}
                          onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                          required
                          style={inputStyle}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors"
                      style={{ borderRadius: '4px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                    >
                      {editingId ? 'Update Address' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors"
                      style={{
                        borderRadius: '4px',
                        border: '1px solid rgb(220, 223, 230)',
                        backgroundColor: 'rgb(255, 255, 255)',
                        color: 'rgb(75, 85, 99)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgb(185, 28, 28)'
                        e.currentTarget.style.color = 'rgb(185, 28, 28)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                        e.currentTarget.style.color = 'rgb(75, 85, 99)'
                      }}
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Empty State ── */}
            {addresses.length === 0 && !showForm ? (
              <div
                className="flex flex-col items-center text-center p-12"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(220, 223, 230)',
                  borderRadius: '6px',
                }}
              >
                <div
                  className="w-16 h-16 flex items-center justify-center mb-4"
                  style={{ borderRadius: '8px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                >
                  <MapPin className="w-7 h-7" style={{ color: 'rgb(185, 28, 28)' }} />
                </div>
                <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>No addresses saved</h2>
                <p className="text-sm mb-6" style={{ color: 'rgb(110, 118, 135)' }}>
                  Add your first address to make checkout faster
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 transition-colors"
                  style={{ borderRadius: '6px', backgroundColor: 'rgb(185, 28, 28)', color: 'rgb(255, 255, 255)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)')}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Add Address
                </button>
              </div>
            ) : (
              /* ── Address Cards ── */
              <div className="space-y-4">
                {addresses.map((address: any) => (
                  <div
                    key={address._id}
                    className="overflow-hidden transition-shadow"
                    style={{
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: address.isDefault
                        ? '1.5px solid rgb(185, 28, 28)'
                        : '1px solid rgb(220, 223, 230)',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
                  >
                    {/* Card Header */}
                    <div
                      className="flex items-center justify-between px-5 py-3 flex-wrap gap-2"
                      style={{
                        borderBottom: '1px solid rgb(240, 242, 245)',
                        backgroundColor: address.isDefault ? 'rgb(254, 242, 242)' : 'rgb(248, 249, 251)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                        <span className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>
                          {address.fullName}
                        </span>
                        {address.isDefault && (
                          <span
                            className="flex items-center gap-1 text-xs font-bold px-2 py-0.5"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: 'rgb(185, 28, 28)',
                              color: 'rgb(255, 255, 255)',
                              border: '1px solid rgb(153, 27, 27)',
                            }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address._id)}
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 transition-colors"
                            style={{
                              borderRadius: '4px',
                              border: '1px solid rgb(220, 223, 230)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(75, 85, 99)',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = 'rgb(185, 28, 28)'
                              e.currentTarget.style.color = 'rgb(185, 28, 28)'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                              e.currentTarget.style.color = 'rgb(75, 85, 99)'
                            }}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 transition-colors"
                          style={{
                            borderRadius: '4px',
                            border: '1px solid rgb(220, 223, 230)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            color: 'rgb(75, 85, 99)',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgb(185, 28, 28)'
                            e.currentTarget.style.color = 'rgb(185, 28, 28)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgb(220, 223, 230)'
                            e.currentTarget.style.color = 'rgb(75, 85, 99)'
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 transition-colors"
                          style={{
                            borderRadius: '4px',
                            border: '1px solid rgb(254, 202, 202)',
                            backgroundColor: 'rgb(254, 242, 242)',
                            color: 'rgb(185, 28, 28)',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)'
                            e.currentTarget.style.color = 'rgb(255, 255, 255)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                            e.currentTarget.style.color = 'rgb(185, 28, 28)'
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(150, 158, 175)' }}>
                            Address
                          </p>
                          <p className="text-sm" style={{ color: 'rgb(55, 65, 81)' }}>
                            {address.addressLine1}
                            {address.addressLine2 && (
                              <span>, {address.addressLine2}</span>
                            )}
                          </p>
                          <p className="text-sm" style={{ color: 'rgb(55, 65, 81)' }}>
                            {address.city}, {address.state} — {address.postalCode}
                          </p>
                          <p className="text-sm" style={{ color: 'rgb(110, 118, 135)' }}>
                            {address.country}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(150, 158, 175)' }}>
                            Contact
                          </p>
                          <p className="text-sm" style={{ color: 'rgb(55, 65, 81)' }}>
                            📞 {address.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add another address button */}
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 transition-colors"
                    style={{
                      borderRadius: '6px',
                      border: '1.5px dashed rgb(185, 28, 28)',
                      backgroundColor: 'rgb(255, 255, 255)',
                      color: 'rgb(185, 28, 28)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    Add Another Address
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
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
