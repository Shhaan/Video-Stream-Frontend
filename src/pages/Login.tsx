import { useState } from 'react';
import { data, Link, useNavigate } from 'react-router-dom';
import { api_auth, mockApi } from '../lib/api';
import { useAuth } from '../components/AuthProvider';
import { Video, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      const response = await api_auth.post(
        "/api/v1/auth/login/",
        formData
      );
      login(response.data?.data);
      toast.success('Welcome back, ' + response.data?.data?.name + '!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary p-3 rounded-2xl mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold">Welcome Back</h1>
            <p className="text-muted-foreground text-center mt-2">
              Sign in to your account to continue streaming.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary border-solid-2-black text-black font-semibold rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>


          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Demo Credentials: <span className="font-mono">user@example.com / password</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
