// components/login-form.tsx
'use client';
import { useState } from 'react';
import { supabase } from '@supabase/supabase-js';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Login successful!');
      window.location.reload(); // Refresh the page to update user state
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Log In
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
