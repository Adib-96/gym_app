"use client";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log('📤 Attempting login:', { email });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // CRITICAL: Send/receive cookies
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok && data.success) {
        // Save user info to localStorage (but NOT token - token is in HTTP-only cookie)
        localStorage.setItem("user", JSON.stringify(data.user));
        
        console.log('✅ Login successful, cookies set, redirecting...');
        console.log('User role:', data.user.role);
        
        // Check if cookies were set
        console.log('Document cookies:', document.cookie);
        
        // Redirect based on role
        if (data.user.role === 'coach') {
          router.push("/dashboard/coach");
        } else {
          router.push("/dashboard/client");
        }
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Test function to check cookies
  const testCookies = () => {
    console.log('🍪 Current cookies:', document.cookie);
    const cookies = document.cookie.split(';');
    console.log('Parsed cookies:', cookies);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 bg-gray-900 min-h-screen">
      <div className="mx-auto">
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-white justify-center"
        >
          <Image
            width={100}
            height={100}
            className="w-8 h-8 mr-2"
            src="/images/dumbbell-svgrepo-com.svg"
            alt="logo"
          />
          GymTracker
        </Link>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Debug button - remove in production */}
        <button 
          onClick={testCookies}
          className="mb-4 text-xs text-gray-400 hover:text-gray-300"
        >
          🍪 Test Cookies
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                Password
              </label>
              <div className="text-sm">
                <Link 
                  href="/forgot-password" 
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link 
              href="/register" 
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}