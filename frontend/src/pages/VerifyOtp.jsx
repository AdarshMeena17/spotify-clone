import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Spinner } from '../components/common/Loader';
import { verifyOtp } from '../services/api';

// Used only when the backend sends no message of its own.
const FALLBACK_BY_STATUS = {
  400: 'That code is invalid or has expired.',
  404: 'No account found for this email.',
};

export default function VerifyOtp() {
  const { getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Passed from Register via router state. If the page is opened directly,
  // the user can type the email instead.
  const emailFromRegister = location.state?.email || '';

  const [email, setEmail] = useState(emailFromRegister);
  const [otp, setOtp] = useState(''); // component state only, never persisted
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required.';
    if (!/^\d{6}$/.test(otp)) next.otp = 'Enter the 6-digit code.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || successMessage || !validate()) return;
    setSubmitError('');
    setIsLoading(true);
    try {
      const data = await verifyOtp({ email: email.trim(), otp });
      setSuccessMessage(data?.message || 'Email verified successfully');
      redirectTimer.current = setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          FALLBACK_BY_STATUS[err?.response?.status] ||
          getErrorMessage(err, 'Could not verify your email.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const locked = isLoading || !!successMessage;

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the 6-digit code we sent to your email address."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {emailFromRegister ? (
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Verifying</p>
            <p className="break-all text-sm text-ink-dim">{email}</p>
          </div>
        ) : (
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={locked}
            />
            {errors.email && <p className="mt-1.5 text-xs text-signal-danger">{errors.email}</p>}
          </div>
        )}

        <div>
          <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-ink">
            Verification code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="input-field text-center tracking-[0.5em]"
            placeholder="••••••"
            autoComplete="one-time-code"
            autoFocus
            disabled={locked}
          />
          {errors.otp && <p className="mt-1.5 text-xs text-signal-danger">{errors.otp}</p>}
        </div>

        {submitError && (
          <p role="alert" className="rounded-md bg-signal-danger/10 px-3 py-2 text-sm text-signal-danger">
            {submitError}
          </p>
        )}

        {successMessage && (
          <p role="status" className="rounded-md bg-moss/10 px-3 py-2 text-sm text-moss">
            {successMessage}. Redirecting to log in…
          </p>
        )}

        <button type="submit" disabled={locked} className="btn-primary w-full">
          {isLoading && <Spinner className="h-4 w-4" />}
          Verify OTP
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-dim">
        Wrong email?{' '}
        <Link to="/register" className="font-medium text-moss hover:underline">
          Register again
        </Link>
        {' · '}
        Already verified?{' '}
        <Link to="/login" className="font-medium text-moss hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
