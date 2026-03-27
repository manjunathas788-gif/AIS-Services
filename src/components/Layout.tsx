import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfile } from '../types';
import { Logo } from './Logo';
import { LogOut, Menu, X, Shield, User, LayoutDashboard, Phone, Info, Home as HomeIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
}

export function Layout({ children, user }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  if (user) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <Logo className="h-10" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-orange-600",
                    location.pathname === link.path ? "text-orange-600" : "text-stone-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-stone-600">
                    <User className="h-4 w-4" />
                    <span>{user.displayName.split(' ')[0]}</span>
                    <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] uppercase font-bold tracking-wider text-stone-500">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-stone-600 hover:text-orange-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 animate-in slide-in-from-top duration-200">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium",
                    location.pathname === link.path ? "bg-orange-50 text-orange-600" : "text-stone-600 hover:bg-stone-50"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full mt-4 bg-orange-600 text-white px-5 py-3 rounded-lg text-base font-medium hover:bg-orange-700 transition-colors"
                >
                  Get Started
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <Logo className="h-12" light />
              </div>
              <p className="max-w-sm text-sm leading-relaxed">
                Empowering Indian entrepreneurs and individuals with seamless digital financial and registration services. Trusted by thousands nationwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/service/gst-reg" className="hover:text-orange-500 transition-colors">GST Registration</Link></li>
                <li><Link to="/service/udyam" className="hover:text-orange-500 transition-colors">UDYAM Registration</Link></li>
                <li><Link to="/service/pan-card" className="hover:text-orange-500 transition-colors">PAN Card</Link></li>
                <li><Link to="/service/bank-report" className="hover:text-orange-500 transition-colors">Bank Reports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs">
            <p>&copy; {new Date().getFullYear()} AIS Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
