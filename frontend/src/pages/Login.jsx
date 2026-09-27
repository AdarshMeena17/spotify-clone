import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Spinner } from '../components/common/Loader';

export default function Login() {
  const { login, getErrorMessage } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    setIsLoading(true);
    try {
      await login(form);
      notify('Welcome back.', 'success');
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Log in to Wavelength" subtitle="Pick up right where you left off.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={update('email')}
            className="input-field"
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1.5 text-xs text-signal-danger">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              className="input-field pr-11"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-signal-danger">{errors.password}</p>}
        </div>

        {submitError && (
          <p role="alert" className="rounded-md bg-signal-danger/10 px-3 py-2 text-sm text-signal-danger">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading && <Spinner className="h-4 w-4" />}
          Log in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-dim">
        New to Wavelength?{' '}
        <Link to="/register" className="font-medium text-moss hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
