import { Link } from 'react-router-dom';
import { useAuth } from '../App.jsx';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome, {user?.name || 'User'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{user?.role || 'BUYER'}</span>
            <button onClick={logout} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Logout</button>
            <Link to="/" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">Home</Link>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Total listings', '24'],
            ['Favorites', '14'],
            ['Messages', '8'],
            ['Verification', user?.verification_level || 'Basic Seller'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
            <div className="mt-5 space-y-3">
              <button className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-left font-medium text-white">Create listing</button>
              <button className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left font-medium text-slate-700">Manage favorites</button>
              <button className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left font-medium text-slate-700">View messages</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-bold text-slate-900">Account summary</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Email:</span> {user?.email || 'Not available'}</p>
              <p><span className="font-semibold text-slate-900">Role:</span> {user?.role || 'BUYER'}</p>
              <p><span className="font-semibold text-slate-900">Status:</span> Active</p>
              <p><span className="font-semibold text-slate-900">Verification:</span> {user?.verification_level || 'Basic Seller'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
