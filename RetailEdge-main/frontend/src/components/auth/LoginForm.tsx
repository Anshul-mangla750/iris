import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { LoginCredentials } from '../../types/auth';
import SocialLoginButton from './SocialLoginButton';
import { LOGIN_PAGE_CONFIG } from '../../config/pageData';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
  onClearError,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onClearError) {
      onClearError();
    }
    setForgotPasswordNotice(false);

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        email: email.trim(),
        password,
        rememberMe,
      });
    } catch {
      // Backend error is handled and displayed through props.error
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordNotice(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 w-full">
      {/* Backend / Global Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-snug animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              className="text-red-400 hover:text-red-600 text-xs font-bold leading-none p-0.5"
              aria-label="Dismiss error"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Forgot Password Modal/Notice */}
      {forgotPasswordNotice && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-snug">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            Password reset is managed by your RetailEdge system administrator. Please reach out to your organization support lead.
          </div>
          <button
            type="button"
            onClick={() => setForgotPasswordNotice(false)}
            className="text-amber-500 hover:text-amber-700 text-xs font-bold p-0.5"
          >
            ×
          </button>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-[13px] font-semibold text-gray-800 mb-1.5"
        >
          {LOGIN_PAGE_CONFIG.card.emailLabel}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) {
                setValidationErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder={LOGIN_PAGE_CONFIG.card.emailPlaceholder}
            disabled={isLoading}
            className={`w-full pl-10 pr-3.5 py-2.5 bg-white border text-gray-900 text-sm rounded-xl focus:outline-none transition-all placeholder:text-gray-400 ${
              validationErrors.email
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
            } disabled:bg-gray-50 disabled:text-gray-400`}
            aria-invalid={!!validationErrors.email}
            aria-describedby={validationErrors.email ? 'email-error' : undefined}
          />
        </div>
        {validationErrors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-600 font-medium">
            {validationErrors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-[13px] font-semibold text-gray-800 mb-1.5"
        >
          {LOGIN_PAGE_CONFIG.card.passwordLabel}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            placeholder={LOGIN_PAGE_CONFIG.card.passwordPlaceholder}
            disabled={isLoading}
            className={`w-full pl-10 pr-10 py-2.5 bg-white border text-gray-900 text-sm rounded-xl focus:outline-none transition-all placeholder:text-gray-400 ${
              validationErrors.password
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
            } disabled:bg-gray-50 disabled:text-gray-400`}
            aria-invalid={!!validationErrors.password}
            aria-describedby={validationErrors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-600 font-medium">
            {validationErrors.password}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="sr-only peer"
          />
          <div className="w-4 h-4 rounded border border-gray-300 bg-white peer-checked:bg-[#1b5336] peer-checked:border-[#1b5336] flex items-center justify-center transition-colors">
            {rememberMe && (
              <svg
                className="w-2.5 h-2.5 text-white"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-[13px] text-gray-600 font-medium">
            {LOGIN_PAGE_CONFIG.card.rememberMeLabel}
          </span>
        </label>

        <a
          href="#forgot-password"
          onClick={handleForgotPassword}
          className="text-[13px] font-medium text-[#1b5336] hover:text-emerald-700 hover:underline transition-colors"
        >
          {LOGIN_PAGE_CONFIG.card.forgotPasswordLabel}
        </a>
      </div>

      {/* Primary Sign In Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#1b5336] hover:bg-[#16452d] active:bg-[#123924] text-white font-medium text-sm rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Signing in...</span>
            </span>
          ) : (
            <span>{LOGIN_PAGE_CONFIG.card.submitButtonText}</span>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="relative py-2 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative px-3 bg-white text-xs text-gray-500 font-normal">
          {LOGIN_PAGE_CONFIG.card.orContinueWith}
        </div>
      </div>

      {/* Social Login Buttons (Google & Microsoft) */}
      <div className="flex items-center gap-3">
        <SocialLoginButton provider="google" disabled={isLoading} />
        <SocialLoginButton provider="microsoft" disabled={isLoading} />
      </div>

      {/* Bottom Administrator Notice */}
      <div className="pt-2 text-center">
        <p className="text-xs text-gray-500 leading-normal">
          {LOGIN_PAGE_CONFIG.card.footerText}
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
