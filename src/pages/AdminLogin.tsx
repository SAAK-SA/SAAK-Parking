import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParkingSquare, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const ok = login(username.trim(), password);
      if (ok) {
        navigate('/admin', { replace: true });
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-[#0d3570] to-[#071e3d] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center shadow-lg">
          <ParkingSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="text-white font-bold text-xl tracking-wide">SAAK</p>
          <p className="text-white/40 text-xs">نظام إدارة المواقف</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-green/20 border border-brand-green/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-brand-green" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-1">دخول المشرفين</h1>
          <p className="text-white/50 text-sm">مخصص لمشرفي النظام فقط</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-white/70 text-sm mb-2">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="admin"
                dir="ltr"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10
                           text-white placeholder:text-white/30
                           focus:outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/30
                           transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/70 text-sm mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                dir="ltr"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 pl-11
                           text-white placeholder:text-white/30
                           focus:outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/30
                           transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-400/30 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green/90 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {loading ? 'جاري التحقق…' : 'دخول'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            العودة إلى البوابة العامة
          </button>
        </div>
      </div>

      <p className="text-white/20 text-xs mt-8">© {new Date().getFullYear()} SAAK — جميع الحقوق محفوظة</p>
    </div>
  );
}
