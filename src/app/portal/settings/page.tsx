import { PageHeader } from "@/components/shared/PageHeader";

export default function PortalSettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account" />

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Company Name</label>
              <input type="text" defaultValue="Daily Trends Media" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Contact Email</label>
              <input type="email" defaultValue="chris@sovidigital.com" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
          <div className="space-y-3">
            {[
              { name: "Chris", email: "chris@sovidigital.com", role: "Owner" },
              { name: "Justin", email: "justin@sovidigital.com", role: "Admin" },
            ].map((member) => (
              <div key={member.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">{member.role}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            + Invite Member
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Integration</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm font-medium text-gray-900">Sailthru</p>
              <p className="text-xs text-gray-500">Connected since Aug 2025</p>
            </div>
            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded font-medium">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
