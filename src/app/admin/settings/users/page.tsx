"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { adminUsers } from "@/lib/mock-data";

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader
        title="Admin Users"
        subtitle="Manage team access and roles"
        actions={
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            + Add User
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Add Admin</h3>
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="Enter email address..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Admin</option>
            <option>Account Manager</option>
            <option>Viewer</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Login</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {adminUsers.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={user.role === "Admin" ? "active" : user.role === "Account Manager" ? "info" : "trial"}
                    label={user.role}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
                <td className="px-4 py-3 text-right">
                  <button className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
