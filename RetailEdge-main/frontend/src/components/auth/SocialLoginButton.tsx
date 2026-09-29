import React from 'react';

export type SocialProvider = 'google' | 'microsoft';

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onClick?: () => void;
  disabled?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  disabled = false,
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      // Social OAuth contract placeholder
      console.info(
        `[SocialAuth] OAuth provider initiated for: ${provider}. Waiting for backend OAuth route contract.`
      );
      alert(
        `${provider.toUpperCase()} Single Sign-On integration will be enabled once backend OAuth is configured.`
      );
    }
  };

  const isGoogle = provider === 'google';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 active:bg-gray-100 rounded-xl text-gray-700 text-sm font-medium transition-all duration-150 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      aria-label={`Sign in with ${isGoogle ? 'Google' : 'Microsoft'}`}
    >
      {isGoogle ? (
        // Official Google "G" 4-color SVG
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      ) : (
        // Official Microsoft 4-square SVG
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21" aria-hidden="true">
          <rect x="1" y="1" width="9" height="9" fill="#F25022" />
          <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
          <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
          <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
        </svg>
      )}
      <span>{isGoogle ? 'Google' : 'Microsoft'}</span>
    </button>
  );
};

export default SocialLoginButton;
