import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (username === 'admin' && password === 'Danghungit@85') {
      onLogin();
    } else {
      setError('Sai tài khoản hoặc mật khẩu!');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Đăng nhập quản trị</h2>
        {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
        <input
          className="border rounded px-3 py-2 w-full mb-3"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 w-full mb-4"
          placeholder="Mật khẩu"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition" type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}
