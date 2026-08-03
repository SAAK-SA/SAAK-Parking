import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/brand/Logo';
import LanguageToggle from '../components/common/LanguageToggle';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

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
      if (login(username.trim(), password)) {
        navigate('/admin', { replace: true });
      } else {
        setError(t('admin.login.err'));
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-mesh flex flex-col overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-brand-navy-light/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -end-24 w-[26rem] h-[26rem] rounded-full bg-brand-green/10 blur-3xl animate-blob" style={{ animationDelay: '5s' }} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4">
        <button onClick={() => navigate('/')} className="transition-transform hover:scale-[1.02] active:scale-95">
          <Logo tone="color" size={34} />
        </button>
        <LanguageToggle variant="dark" />
      </header>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-border rounded-3xl shadow-card p-8 animate-scale-in">
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy-light flex items-center justify-center mx-auto mb-4 shadow-glow-blue">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-brand-navy font-extrabold text-2xl mb-1">{t('admin.login.title')}</h1>
            <p className="text-text-secondary text-sm">{t('admin.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">{t('admin.login.username')}</label>
              <div className="relative">
                <User className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  dir="ltr"
                  autoComplete="username"
                  className="field ps-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">{t('admin.login.password')}</label>
              <div className="relative">
                <Lock className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  dir="ltr"
                  className="field ps-10 pe-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 end-4 -translate-y-1/2 text-text-muted hover:text-brand-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl p-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? t('admin.login.loading') : t('admin.login.submit')}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <button onClick={() => navigate('/')} className="text-text-muted hover:text-brand-navy text-xs transition-colors">
              {t('admin.login.back')}
            </button>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center pb-6">
        <p className="text-text-muted text-xs">{t('brand.rights', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}
