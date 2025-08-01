import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Seo from '../components/Seo';

export default function ProductManager() {
  function handleCancel() {
    setEditing(null);
    setForm({ name: '', brand: '', price: '', imageUrl: '', rating: '', style: '', isHotDeal: false, isNew: false, isBestSeller: false });
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    await axios.delete(`/products/${id}`, { baseURL: process.env.REACT_APP_API_URL, auth: { username: 'admin', password: 'Danghungit@85' } });
    fetchProducts();
  }

  async function handleSave(e) {
    e.preventDefault();
    if (editing) {
      await axios.put(`/products/${editing}`, form, { baseURL: process.env.REACT_APP_API_URL, auth: { username: 'admin', password: 'Danghungit@85' } });
    } else {
      await axios.post('/products', form, { baseURL: process.env.REACT_APP_API_URL, auth: { username: 'admin', password: 'Danghungit@85' } });
    }
    handleCancel();
    fetchProducts();
  }
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', price: '', imageUrl: '', rating: '', style: '', isHotDeal: false, isNew: false, isBestSeller: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await axios.get('/products', { baseURL: process.env.REACT_APP_API_URL });
    setProducts(res.data.products);
    setLoading(false);
  }

  function handleEdit(product) {
    setEditing(product.id);
    setForm({ ...product });
return (
  <div>
    <Seo
      title="Quản lý sản phẩm - Đồng hồ nam Affiliate"
      description="Trang quản lý sản phẩm đồng hồ nam, thêm, sửa, xóa sản phẩm cho admin."
      url={typeof window !== 'undefined' ? window.location.href : ''}
    />
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
      <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
        <input className="border rounded px-3 py-2" placeholder="Tên sản phẩm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border rounded px-3 py-2" placeholder="Hãng" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
        <input className="border rounded px-3 py-2" placeholder="Giá" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
        <input className="border rounded px-3 py-2" placeholder="Link ảnh" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} required />
        <input className="border rounded px-3 py-2" placeholder="Đánh giá" type="number" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
        <input className="border rounded px-3 py-2" placeholder="Phong cách" value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isHotDeal} onChange={e => setForm(f => ({ ...f, isHotDeal: e.target.checked }))} />Hot Deal</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))} />Mới về</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isBestSeller} onChange={e => setForm(f => ({ ...f, isBestSeller: e.target.checked }))} />Bán chạy</label>
        <div className="col-span-2 flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editing ? 'Lưu' : 'Thêm mới'}</button>
          {editing && <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">Hủy</button>}
        </div>
      </form>
      {loading ? <div>Đang tải...</div> : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tên sản phẩm</th>
              <th className="p-2">Hãng</th>
              <th className="p-2">Giá</th>
              <th className="p-2">Ảnh</th>
              <th className="p-2">Đánh giá</th>
              <th className="p-2">Phong cách</th>
              <th className="p-2">Tag</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.brand}</td>
                <td className="p-2">{p.price?.toLocaleString()}₫</td>
                <td className="p-2"><img src={p.imageUrl} alt="" className="h-12 w-12 object-contain" /></td>
                <td className="p-2">{p.rating}</td>
                <td className="p-2">{p.style}</td>
                <td className="p-2">
                  {p.isHotDeal && <span className="bg-red-500 text-white px-2 rounded text-xs mr-1">Hot</span>}
                  {p.isNew && <span className="bg-green-500 text-white px-2 rounded text-xs mr-1">Mới</span>}
                  {p.isBestSeller && <span className="bg-yellow-400 text-white px-2 rounded text-xs">Bán chạy</span>}
                </td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Sửa</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)};
}
