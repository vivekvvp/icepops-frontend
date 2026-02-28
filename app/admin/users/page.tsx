'use client';

import { useEffect, useState } from 'react';
import { Search, UserCheck, UserX, Users } from 'lucide-react';
import { useGetAllUsersQuery, useToggleBlockUserMutation } from '@/lib/services/api';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading, error } = useGetAllUsersQuery({
    page,
    limit: 20,
    search: search || undefined,
  });
  const [toggleBlockUser] = useToggleBlockUserMutation();

  const users = usersData?.data?.users || [];
  const totalPages = usersData?.data?.pagination?.totalPages || 1;

  useEffect(() => {
    if (error) toast.error('Failed to load users');
  }, [error]);

  const handleToggleBlock = async (userId: string) => {
    try {
      await toggleBlockUser(userId).unwrap();
      toast.success('User status updated');
    } catch {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="min-h-screen p-8 space-y-6" style={{ backgroundColor: 'rgb(246, 247, 249)' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid rgb(220, 223, 230)' }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'rgb(15, 20, 35)' }}>
            Users
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgb(110, 118, 135)' }}>
            Manage customer accounts
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-md"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          border: '1px solid rgb(220, 223, 230)',
        }}
      >
        <Search
          className="w-4 h-4 shrink-0 stroke-[2.5]"
          style={{ color: 'rgb(185, 28, 28)' }}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'rgb(30, 35, 50)' }}
        />
        {search && (
          <button
            onClick={() => { setSearch(''); setPage(1) }}
            className="text-xs font-semibold transition-colors"
            style={{ color: 'rgb(156, 163, 175)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgb(75, 85, 99)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgb(156, 163, 175)')}
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
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
                {['#', 'User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider ${i === 6 ? 'text-right' : 'text-left'}`}
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
                  <td colSpan={7} className="px-5 py-12 text-center text-sm" style={{ color: 'rgb(156, 163, 175)' }}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center" style={{ color: 'rgb(156, 163, 175)' }}>
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8" style={{ color: 'rgb(209, 213, 219)' }} />
                      <p className="text-sm font-medium">
                        {search ? `No users found for "${search}"` : 'No users yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user: any, index: number) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: index < users.length - 1 ? '1px solid rgb(240, 242, 245)' : 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(252, 252, 253)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* # */}
                    <td className="px-5 py-4 text-xs font-bold" style={{ color: 'rgb(185, 28, 28)' }}>
                      {(page - 1) * 20 + index + 1}
                    </td>

                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-9 h-9 object-cover shrink-0"
                            style={{
                              borderRadius: '6px',
                              border: '1px solid rgb(220, 223, 230)',
                            }}
                          />
                        ) : (
                          <div
                            className="w-9 h-9 shrink-0 flex items-center justify-center text-sm font-bold"
                            style={{
                              borderRadius: '6px',
                              backgroundColor: 'rgb(254, 242, 242)',
                              border: '1px solid rgb(254, 202, 202)',
                              color: 'rgb(185, 28, 28)',
                            }}
                          >
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'rgb(15, 20, 35)' }}>
                            {user.name}
                          </p>
                          {user.phone && (
                            <p className="text-xs mt-0.5" style={{ color: 'rgb(150, 158, 175)' }}>
                              {user.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-sm" style={{ color: 'rgb(110, 118, 135)' }}>
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={
                          user.role === 'ADMIN'
                            ? { borderRadius: '4px', backgroundColor: 'rgb(245, 243, 255)', color: 'rgb(109, 40, 217)', border: '1px solid rgb(221, 214, 254)' }
                            : { borderRadius: '4px', backgroundColor: 'rgb(239, 246, 255)', color: 'rgb(29, 78, 216)', border: '1px solid rgb(219, 234, 254)' }
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1"
                        style={
                          user.isBlocked
                            ? { borderRadius: '4px', backgroundColor: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)', border: '1px solid rgb(254, 202, 202)' }
                            : { borderRadius: '4px', backgroundColor: 'rgb(240, 253, 244)', color: 'rgb(21, 91, 48)', border: '1px solid rgb(187, 247, 208)' }
                        }
                      >
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-sm" style={{ color: 'rgb(110, 118, 135)' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleBlock(user.id)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 transition-colors ml-auto"
                          style={
                            user.isBlocked
                              ? { borderRadius: '4px', border: '1px solid rgb(187, 247, 208)', backgroundColor: 'rgb(240, 253, 244)', color: 'rgb(21, 91, 48)' }
                              : { borderRadius: '4px', border: '1px solid rgb(254, 202, 202)', backgroundColor: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)' }
                          }
                          onMouseEnter={e => {
                            if (user.isBlocked) {
                              e.currentTarget.style.backgroundColor = 'rgb(220, 252, 231)'
                            } else {
                              e.currentTarget.style.backgroundColor = 'rgb(254, 226, 226)'
                            }
                          }}
                          onMouseLeave={e => {
                            if (user.isBlocked) {
                              e.currentTarget.style.backgroundColor = 'rgb(240, 253, 244)'
                            } else {
                              e.currentTarget.style.backgroundColor = 'rgb(254, 242, 242)'
                            }
                          }}
                        >
                          {user.isBlocked ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5 stroke-[2.5]" />
                              Block
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderTop: '1px solid rgb(240, 242, 245)',
              backgroundColor: 'rgb(248, 249, 251)',
            }}
          >
            <p className="text-xs" style={{ color: 'rgb(150, 158, 175)' }}>
              Page{' '}
              <span className="font-bold" style={{ color: 'rgb(30, 35, 50)' }}>{page}</span>
              {' '}of{' '}
              <span className="font-bold" style={{ color: 'rgb(30, 35, 50)' }}>{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderRadius: '4px', border: '1px solid rgb(220, 223, 230)', color: 'rgb(30, 35, 50)', backgroundColor: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="text-xs font-bold px-3 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ borderRadius: '4px', border: '1px solid rgb(220, 223, 230)', color: 'rgb(30, 35, 50)', backgroundColor: 'rgb(255, 255, 255)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgb(255, 255, 255)')}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
