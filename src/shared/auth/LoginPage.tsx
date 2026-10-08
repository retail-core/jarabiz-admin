import { useState } from 'react';
import { api } from '@/shared/lib/api';
import { authStorage } from '@/shared/lib/auth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const { data } = await api.post('/auth/v1/login', Object.fromEntries(formData));
      
      // Save data from your backend response
      authStorage.setToken(data.access_token);
      authStorage.setUser(data.user);
      
      // Redirect to home
      window.location.href = '/';
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600">JARABIZ</h1>
          <p className="text-gray-500 mt-2">Welcome back, please login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input name="email" type="email" required placeholder="name@company.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input name="password" type="password" required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full h-11 bg-blue-600" disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}