import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import RetailEdgeLogo from '../common/RetailEdgeLogo';
import { LANDING_DATA } from '../../data/landingData';

export const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    setActiveSection(label);
    setMobileMenuOpen(false);

    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-200 ${
        isScrolled
          ? 'shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-slate-100 py-3'
          : 'border-b border-slate-100/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo with Tagline */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home', 'Home')}
          className="flex items-center focus:outline-none"
        >
          <RetailEdgeLogo size="md" showTagline={true} />
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
          {LANDING_DATA.navLinks.map((link) => {
            const isActive = activeSection === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className={`relative py-1 text-[13.5px] font-medium transition-colors select-none ${
                  isActive
                    ? 'text-[#0fa968] font-semibold'
                    : 'text-slate-700 hover:text-[#0fa968]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0fa968] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Search Icon, Login Button, Get Started Button */}
        <div className="hidden sm:flex items-center space-x-4">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Search site"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Login CTA */}
          <button
            type="button"
            onClick={handleLoginClick}
            className="px-4 py-2 text-sm font-semibold text-slate-800 hover:text-[#0fa968] hover:bg-slate-50 rounded-lg transition-colors border border-slate-200/80 shadow-2xs"
          >
            Login
          </button>

          {/* Primary Get Started CTA */}
          <button
            type="button"
            onClick={handleGetStartedClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0fa968] hover:bg-[#0d945b] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            type="button"
            onClick={handleLoginClick}
            className="px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200 rounded-md"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search Input Bar (Dropdown) */}
      {searchOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-3 animate-fadeIn">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search features, solutions, documentation..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0fa968]/20 focus:border-[#0fa968]"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="space-y-1">
            {LANDING_DATA.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  activeSection === link.label
                    ? 'bg-emerald-50 text-[#0fa968] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={handleLoginClick}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
            >
              Sign In to Account
            </button>
            <button
              onClick={handleGetStartedClick}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#0fa968] hover:bg-[#0d945b] rounded-lg shadow-sm"
            >
              Get Started →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
