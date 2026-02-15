'use client';

import { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetProfileQuery, useChangePasswordMutation } from '@/lib/services/api';
import { UserProtectedRoute } from '@/lib/ProtectedRoute';
import { toast } from 'sonner';

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
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <p className="text-red-600">Failed to load profile</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-semibold">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Change Password */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Security
                </h2>
                {!showPasswordForm && (
                  <Button onClick={() => setShowPasswordForm(true)}>
                    Change Password
                  </Button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-primary">{user.ordersCount || 0}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600">Addresses Saved</p>
                  <p className="text-3xl font-bold text-green-600">{user.addressesCount || 0}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-gray-600">Wishlist Items</p>
                  <p className="text-3xl font-bold text-purple-600">{user.wishlistCount || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Account Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.isEmailVerified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.isBlocked
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
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
