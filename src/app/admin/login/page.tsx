'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, AlertCircle, Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError('Invalid admin credentials. Please try again.');
        toast.error('Authentication failed.');
      } else {
        toast.success('Logged in successfully!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-charcoal border border-brand-steel py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-status-error/15 border border-status-error/40 flex items-center gap-3 text-status-error text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Input
            label="Admin Email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@laptopcollection.pk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          />
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-brand-navy border-brand-steel text-white"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          <Lock className="w-4 h-4 mr-2" />
          Sign In to Admin
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-brand-steel text-center text-xs text-accent-silver">
        <p>Default credentials (initial setup):</p>
        <p className="font-mono text-gray-300 mt-1 select-all">admin@laptopcollection.pk</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo variant="light" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs font-semibold mb-2">
          <Shield className="w-3.5 h-3.5" />
          <span>Restricted Admin Portal</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Sign In to Admin Dashboard
        </h2>
        <p className="mt-1 text-xs text-accent-silver">
          Authorized personnel only. All access attempts are logged.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="text-center text-white text-sm py-12">Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
