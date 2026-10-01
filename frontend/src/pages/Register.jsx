import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Spinner } from '../components/common/Loader';

export default function Register() {
  const { register, getErrorMessage } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = 'Choose a username.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Use at least 6 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    setIsLoading(true);
      try {
      const email = form.email.trim();
      const data = await register({
        username: form.username.trim(),
        email,
        password: form.password,
        role: form.role,
      });
      notify(data?.message || 'Account created. Check your email for the verification code.', 'success');
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Could not create your account.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose whether you want to listen or upload music as an artist."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={form.username}
            onChange={update('username')}
            className="input-field"
            placeholder="yourname"
            autoComplete="username"
          />
          {errors.username && <p className="mt-1.5 text-xs text-signal-danger">{errors.username}</p>}
        </div>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
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

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            className="input-field"
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-signal-danger">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-ink">
            Account type
          </label>
          <select
            id="role"
            value={form.role}
            onChange={update('role')}
            className="input-field"
          >
            <option value="user">Listener</option>
            <option value="artist">Artist</option>
          </select>
        </div>

        {submitError && (
          <p role="alert" className="rounded-md bg-signal-danger/10 px-3 py-2 text-sm text-signal-danger">
            {submitError}
          </p>
        )}

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading && <Spinner className="h-4 w-4" />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-dim">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-moss hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
