'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User, Mail, Phone, Calendar, Shield,
  Key, ChevronRight, X, Package, MapPin, Heart,
} from 'lucide-react';
import { useGetProfileQuery, useChangePasswordMutation } from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

function ProfilePage() {
  const { data: profileData, isLoading } = useGetProfileQuery(undefined);
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const user = profileData?.data;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
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
              Loading your profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Error ── */
  if (!user) {
    return (
      <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div
            className="flex flex-col items-center text-center p-10"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px solid rgb(220, 223, 230)',
              borderRadius: '6px',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center mb-4"
              style={{ borderRadius: '8px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
            >
              <User className="w-7 h-7" style={{ color: 'rgb(185, 28, 28)' }} />
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: 'rgb(15, 20, 35)' }}>Failed to load profile</h2>
            <p className="text-sm" style={{ color: 'rgb(110, 118, 135)' }}>Please try refreshing the page</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const infoRows = [
    { icon: User,     label: 'Full Name',    value: user.name },
    { icon: Mail,     label: 'Email',        value: user.email },
    ...(user.phone ? [{ icon: Phone, label: 'Phone', value: user.phone }] : []),
    { icon: Shield,   label: 'Account Type', value: user.role },
    {
      icon: Calendar,
      label: 'Member Since',
      value: new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
    },
  ];

  const quickStats = [
    { label: 'Total Orders',    value: user.ordersCount    || 0, icon: Package, href: '/orders' },
    { label: 'Saved Addresses', value: user.addressesCount || 0, icon: MapPin,  href: '/addresses' },
    { label: 'Wishlist Items',  value: user.wishlistCount  || 0, icon: Heart,   href: '/wishlist' },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>
      <Header />

      <main className="flex-1">
        <section className="px-4 md:px-6 py-8">
          <div className="max-w-5xl mx-auto space-y-6">

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
              <span className="font-semibold" style={{ color: 'rgb(55, 65, 81)' }}>My Profile</span>
            </div>

            {/* ── Page Title ── */}
            <div
              className="flex items-center pb-5"
              style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
            >
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
                  My Profile
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
                  Manage your personal information and security
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Left Col ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Avatar + Name Banner */}
                <div
                  className="flex items-center gap-4 px-5 py-5"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    className="flex items-center justify-center w-16 h-16 text-2xl font-extrabold shrink-0"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: 'rgb(254, 242, 242)',
                      color: 'rgb(185, 28, 28)',
                      border: '1.5px solid rgb(254, 202, 202)',
                    }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-lg font-extrabold" style={{ color: 'rgb(15, 20, 35)' }}>
                      {user.name}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(110, 118, 135)' }}>
                      {user.email}
                    </p>
                    <span
                      className="inline-block mt-1.5 text-xs font-bold px-2.5 py-0.5"
                      style={{
                        borderRadius: '4px',
                        backgroundColor: 'rgb(185, 28, 28)',
                        color: 'rgb(255, 255, 255)',
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Personal Information */}
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="flex items-center gap-2.5 px-5 py-4"
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7"
                      style={{ borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                    >
                      <User className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Personal Information</h2>
                      <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Your account details</p>
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y" style={{ borderColor: 'rgb(240, 242, 245)' }}>
                    {infoRows.map((row, i) => (
                      <div key={i} className="flex items-center gap-4 px-5 py-4">
                        <div
                          className="flex items-center justify-center w-8 h-8 shrink-0"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(248, 249, 251)',
                            border: '1px solid rgb(220, 223, 230)',
                          }}
                        >
                          <row.icon className="w-4 h-4" style={{ color: 'rgb(150, 158, 175)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgb(150, 158, 175)' }}>
                            {row.label}
                          </p>
                          <p className="text-sm font-semibold truncate" style={{ color: 'rgb(15, 20, 35)' }}>
                            {row.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security / Change Password */}
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  {/* Card Header */}
                  <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex items-center justify-center w-7 h-7"
                        style={{ borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', border: '1px solid rgb(254, 202, 202)' }}
                      >
                        <Key className="w-3.5 h-3.5" style={{ color: 'rgb(185, 28, 28)' }} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Security</h2>
                        <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Manage your password</p>
                      </div>
                    </div>
                    {!showPasswordForm && (
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 transition-colors"
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
                        <Key className="w-3.5 h-3.5" />
                        Change Password
                      </button>
                    )}
                  </div>

                  {/* Password Form */}
                  {showPasswordForm ? (
                    <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
                      {[
                        { id: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
                        { id: 'newPassword',     label: 'New Password',     placeholder: '••••••••', hint: 'Must be at least 6 characters' },
                        { id: 'confirmPassword', label: 'Confirm New Password', placeholder: '••••••••' },
                      ].map(field => (
                        <div key={field.id}>
                          <label
                            className="block text-xs font-bold mb-1.5 uppercase tracking-wider"
                            style={{ color: 'rgb(75, 85, 99)' }}
                          >
                            {field.label} <span style={{ color: 'rgb(185, 28, 28)' }}>*</span>
                          </label>
                          <input
                            type="password"
                            placeholder={field.placeholder}
                            value={(passwordData as any)[field.id]}
                            onChange={e => setPasswordData({ ...passwordData, [field.id]: e.target.value })}
                            required
                            minLength={field.id !== 'currentPassword' ? 6 : undefined}
                            style={inputStyle}
                            onFocus={e => (e.currentTarget.style.borderColor = 'rgb(100, 108, 125)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'rgb(220, 223, 230)')}
                          />
                          {field.hint && (
                            <p className="text-xs mt-1" style={{ color: 'rgb(150, 158, 175)' }}>{field.hint}</p>
                          )}
                        </div>
                      ))}

                      <div style={{ height: '1px', backgroundColor: 'rgb(240, 242, 245)' }} />

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            borderRadius: '4px',
                            backgroundColor: 'rgb(185, 28, 28)',
                            color: 'rgb(255, 255, 255)',
                          }}
                          onMouseEnter={e => { if (!isChangingPassword) e.currentTarget.style.backgroundColor = 'rgb(153, 27, 27)' }}
                          onMouseLeave={e => { if (!isChangingPassword) e.currentTarget.style.backgroundColor = 'rgb(185, 28, 28)' }}
                        >
                          {isChangingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordForm(false);
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
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
                  ) : (
                    <div className="px-5 py-4">
                      <p className="text-sm" style={{ color: 'rgb(110, 118, 135)' }}>
                        Keep your account secure by using a strong, unique password.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right Col ── */}
              <div className="space-y-6">

                {/* Quick Stats */}
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    className="px-5 py-4"
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Quick Stats</h2>
                    <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Your account overview</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {quickStats.map((stat, i) => (
                      <Link key={i} href={stat.href}>
                        <div
                          className="flex items-center gap-3 p-3 transition-colors cursor-pointer"
                          style={{
                            borderRadius: '4px',
                            border: '1px solid rgb(240, 242, 245)',
                            backgroundColor: 'rgb(248, 249, 251)',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgb(254, 202, 202)'
                            e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgb(240, 242, 245)'
                            e.currentTarget.style.backgroundColor = 'rgb(248, 249, 251)'
                          }}
                        >
                          <div
                            className="flex items-center justify-center w-8 h-8 shrink-0"
                            style={{
                              borderRadius: '4px',
                              backgroundColor: 'rgb(254, 242, 242)',
                              border: '1px solid rgb(254, 202, 202)',
                            }}
                          >
                            <stat.icon className="w-4 h-4" style={{ color: 'rgb(185, 28, 28)' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>{stat.label}</p>
                            <p className="text-xl font-extrabold" style={{ color: 'rgb(185, 28, 28)' }}>
                              {stat.value}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'rgb(200, 205, 215)' }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Account Status */}
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(220, 223, 230)',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    className="px-5 py-4"
                    style={{ borderBottom: '1px solid rgb(240, 242, 245)', backgroundColor: 'rgb(248, 249, 251)' }}
                  >
                    <h2 className="text-sm font-bold" style={{ color: 'rgb(15, 20, 35)' }}>Account Status</h2>
                    <p className="text-xs" style={{ color: 'rgb(110, 118, 135)' }}>Verification &amp; standing</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {/* Email Verified */}
                    <div
                      className="flex items-center justify-between p-3"
                      style={{
                        borderRadius: '4px',
                        border: '1px solid rgb(240, 242, 245)',
                        backgroundColor: 'rgb(248, 249, 251)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" style={{ color: 'rgb(150, 158, 175)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'rgb(75, 85, 99)' }}>
                          Email Verified
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: user.isEmailVerified ? 'rgb(240, 253, 244)' : 'rgb(254, 252, 232)',
                          color: user.isEmailVerified ? 'rgb(21, 91, 48)' : 'rgb(133, 77, 14)',
                          border: user.isEmailVerified
                            ? '1px solid rgb(187, 247, 208)'
                            : '1px solid rgb(253, 230, 138)',
                        }}
                      >
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>

                    {/* Account Status */}
                    <div
                      className="flex items-center justify-between p-3"
                      style={{
                        borderRadius: '4px',
                        border: '1px solid rgb(240, 242, 245)',
                        backgroundColor: 'rgb(248, 249, 251)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" style={{ color: 'rgb(150, 158, 175)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'rgb(75, 85, 99)' }}>
                          Account
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={{
                          borderRadius: '4px',
                          backgroundColor: user.isBlocked ? 'rgb(254, 242, 242)' : 'rgb(240, 253, 244)',
                          color: user.isBlocked ? 'rgb(185, 28, 28)' : 'rgb(21, 91, 48)',
                          border: user.isBlocked
                            ? '1px solid rgb(254, 202, 202)'
                            : '1px solid rgb(187, 247, 208)',
                        }}
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ProtectedProfilePage() {
  return (
    <UserProtectedRoute>
      <ProfilePage />
    </UserProtectedRoute>
  );
}
