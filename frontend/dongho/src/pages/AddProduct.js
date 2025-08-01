import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import Toast from '../components/Toast';
import Seo from '../components/Seo';

export default function AddProduct() {
  const [form, setForm] = useState({
    name: '', brand: '', price: '', imageUrl: '', rating: '', style: '', isHotDeal: false, isNew: false, isBestSeller: false
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/products/import', [{ ...form }], {
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:Danghungit@85')
        },
      });
      setToast({ message: 'Đã thêm sản phẩm thành công!', type: 'success' });
      setForm({ name: '', brand: '', price: '', imageUrl: '', rating: '', style: '', isHotDeal: false, isNew: false, isBestSeller: false });
    } catch (e) {
      setToast({ message: 'Lỗi: ' + e.message, type: 'error' });
    }
    setLoading(false);
  }

  return (
    <div>
      <Seo
        title="Thêm sản phẩm mới - Đồng hồ nam Affiliate"
        description="Trang thêm sản phẩm mới cho website đồng hồ nam, nhập thông tin sản phẩm, upload ảnh, đánh dấu hot deal, mới về, bán chạy."
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-8 mt-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Thêm sản phẩm mới</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ...existing code... */}
        </form>
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    </div>
  );
        <input className="border rounded px-3 py-2" placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border rounded px-3 py-2" placeholder="Hãng" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
        <input className="border rounded px-3 py-2" placeholder="Giá" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
        <ImageUpload value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
        <input className="border rounded px-3 py-2" placeholder="Đánh giá (1-5)" type="number" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
        <input className="border rounded px-3 py-2" placeholder="Kiểu" value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} />
        <div className="flex gap-4">
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.isHotDeal} onChange={e => setForm(f => ({ ...f, isHotDeal: e.target.checked }))} />Hot deal</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))} />New</label>
          <label className="flex items-center gap-1"><input type="checkbox" checked={form.isBestSeller} onChange={e => setForm(f => ({ ...f, isBestSeller: e.target.checked }))} />Bestseller</label>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded" disabled={loading}>{loading ? 'Đang thêm...' : 'Thêm sản phẩm'}</button>
      </form>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
