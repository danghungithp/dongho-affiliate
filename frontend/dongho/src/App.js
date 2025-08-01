

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Import from './pages/Import';
import Login from './pages/Login';
import AddProduct from './pages/AddProduct';
import ProductManager from './pages/ProductManager';
import ProductDetail from './pages/ProductDetail';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">Đồng Hồ Nam</Link>
          <div className="space-x-4">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Trang chủ</NavLink>
            <NavLink to="/import" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Nhập Excel</NavLink>
            <NavLink to="/add-product" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Thêm sản phẩm</NavLink>
            <NavLink to="/product-manager" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Quản lý sản phẩm</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Giới thiệu</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}>Liên hệ</NavLink>
          </div>
        </div>
      </nav>
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-white border-t py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Đồng Hồ Affiliate. All rights reserved.
      </footer>
    </div>
  );
}

function About() {
  return <div className="max-w-2xl mx-auto text-gray-700"><h1 className="text-2xl font-bold mb-2">Giới thiệu</h1><p>Website tiếp thị liên kết đồng hồ nam, hiện đại, dễ dùng, nhập sản phẩm từ Excel, lọc và xem sản phẩm, lấy link Shopee.</p></div>;
}
function Contact() {
  return <div className="max-w-2xl mx-auto text-gray-700"><h1 className="text-2xl font-bold mb-2">Liên hệ</h1><p>Liên hệ admin qua email: <a href="mailto:admin@dongho.com" className="text-blue-600 underline">admin@dongho.com</a></p></div>;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('admin'));
  function handleLogin() {
    localStorage.setItem('admin', '1');
    setLoggedIn(true);
  }
  function handleLogout() {
    localStorage.removeItem('admin');
    setLoggedIn(false);
  }
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/import" element={loggedIn ? <Import /> : <Navigate to="/login" />} />
          <Route path="/login" element={loggedIn ? <Navigate to="/import" /> : <Login onLogin={handleLogin} />} />
          <Route path="/add-product" element={loggedIn ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="/product-manager" element={loggedIn ? <ProductManager /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {loggedIn && (
          <button onClick={handleLogout} className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900">Đăng xuất</button>
        )}
      </Layout>
    </Router>
  );
}

export default App;
