import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import DashboardPage from './pages/Dashboard.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = React.createContext(null);

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('egede_token') || '');
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('egede_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('egede_token');
      localStorage.removeItem('egede_user');
      return;
    }

    localStorage.setItem('egede_token', token);

    if (!user) {
      fetchUser(token);
    }
  }, [token]);

  const fetchUser = async (jwt) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('egede_user', JSON.stringify(data.user));
    } catch (error) {
      setToken('');
      setUser(null);
      localStorage.removeItem('egede_token');
      localStorage.removeItem('egede_user');
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      setToken,
      setUser,
      logout: () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('egede_token');
        localStorage.removeItem('egede_user');
      },
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </AuthContext.Provider>
  );
}

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">E</div>
            <div>
              <p className="text-lg font-bold tracking-tight">Egede Market</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#discover" className="hover:text-primary-700">Discover</a>
            <a href="#features" className="hover:text-primary-700">Features</a>
            <a href="#pricing" className="hover:text-primary-700">Verification</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Dashboard</Link>
                <button onClick={() => navigate('/dashboard')} className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">Welcome</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Login</Link>
                <Link to="/register" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-br from-emerald-50 via-white to-slate-50">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                Buy. Sell. Connect.
              </div>
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Modern marketplace for products, services, and verified sellers.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-slate-600">
                Discover products faster, manage listings securely, and grow with dashboards, messaging, and trusted seller verification.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-3 text-base font-semibold text-white shadow-soft hover:bg-primary-700">Create account</Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-base font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50">Login</Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Marketplace</p>
                    <p className="text-xl font-bold text-slate-900">Search what you need</p>
                  </div>
                  <div className="rounded-full bg-primary-100 p-2 text-primary-700">★</div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-500">Search products, services, and deals</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-3 border border-slate-200"><p className="text-xs text-slate-500">Category</p><p className="mt-1 font-semibold">Electronics</p></div>
                    <div className="rounded-2xl bg-white p-3 border border-slate-200"><p className="text-xs text-slate-500">Location</p><p className="mt-1 font-semibold">Lagos, NG</p></div>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-gradient-to-r from-primary-600 to-emerald-500 p-4 text-white">
                  <p className="text-sm text-emerald-100">Featured</p>
                  <p className="text-xl font-bold">Premium Seller</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="discover" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['Smartphones', 'From ₦60,000', 'Hot deals'],
              ['Home Appliances', 'From ₦30,000', 'New arrivals'],
              ['Fashion', 'From ₦8,500', 'Best sellers'],
            ].map(([name, price, tag]) => (
              <div key={name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-1 hover:shadow-soft transition">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">↗</div>
                <p className="text-sm font-medium text-primary-700">{tag}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{name}</h3>
                <p className="mt-2 text-slate-600">{price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Egede Market</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-primary-700">Home</Link>
            <Link to="/login" className="hover:text-primary-700">Login</Link>
            <Link to="/register" className="hover:text-primary-700">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading...</div>;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthContext.Provider');
  }
  return ctx;
}

export default App;
