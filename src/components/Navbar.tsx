import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Video, LogOut, Upload, Search, Menu, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api_auth } from '../lib/api';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchNotifCount = async () => {
    try {
      const { data } = await api_auth.get('/api/v1/user/notification/count/');
      setNotifCount(data);
    } catch (error) {
      console.error('failed to get notification count', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifCount();
    } else {
      setNotifCount(0);
    }
  }, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gray-50 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-accent rounded-full lg:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <div style={{background:'black'}} className="bg-dark p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              VidStream
            </span>
          </Link>
        </div>

        {/* <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div> */}

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/upload"
                className="p-2 hover:bg-accent rounded-full transition-colors hidden sm:flex"
                title="Upload Video"
              >
                <Upload className="w-5 h-5" />
              </Link>
              <Link
                to="/notifications"
                className="p-2 hover:bg-accent rounded-full transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </Link>
              <div className="hidden lg:flex items-center gap-3 pl-2 border-l">
                <div className="text-right">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-gray-50 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* <div className="md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div> */}
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/upload"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Video</span>
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifCount}
                    </span>
                  )}
                </Link>
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 w-full text-left hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block p-3 text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block p-3 bg-primary text-white rounded-lg text-center hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
