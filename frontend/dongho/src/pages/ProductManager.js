
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seo from '../components/Seo';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRows, setEditRows] = useState({}); // { [id]: { ...form } }
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', brand: '', price: '', imageUrl: '', rating: '', style: '', isHotDeal: false, isNew: false, isBestSeller: false });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await axios.get('/products', { baseURL: process.env.REACT_APP_API_URL });
    setProducts(res.data.products);
    setLoading(false);
  }

  function handleEditRow(id) {
    setEditRows(r => ({ ...r, [id]: products.find(p => p.id === id) }));
  }

  function handleCancelEdit(id) {
    setEditRows(r => {
      const copy = { ...r };
      delete copy[id];
      return copy;
    });
  }

  function handleEditChange(id, field, value) {
    setEditRows(r => ({ ...r, [id]: { ...r[id], [field]: value } }));
  }

  async function handleSaveEdit(id) {
    const form = editRows[id];
    await axios.put(`/products/${id}`, form, { baseURL: process.env.REACT_APP_API_URL, auth: { username: 'admin', password: 'Danghungit@85' } });
    handleCancelEdit(id);
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    await axios.delete(`/products/${id}`, { baseURL: process.env.REACT_APP_API_URL, auth: { username: 'admin', password: 'Danghungit@85' } });
    fetchProducts();
  }

  function handleAddChange(field, value) {
    setAddForm(f => ({ ...f, [field]: value }));
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    await axios.post('/products', addForm, { baseURL: process.env.REACT_APP_API_URL, auth: { username: 'admin', password: 'Danghungit@85' } });
    setAddForm({ name: '', brand: '', price: '', imageUrl: '', rating: '', style: '', isHotDeal: false, isNew: false, isBestSeller: false });
    setAdding(false);
    fetchProducts();
  }

  return (
    <div>
      <Seo
        title="Quản lý sản phẩm - Đồng hồ nam Affiliate"
        description="Trang quản lý sản phẩm đồng hồ nam, thêm, sửa, xóa sản phẩm cho admin."
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Quản lý sản phẩm</h1>
        <div className="mb-4 flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            onClick={() => setAdding(a => !a)}
          >{adding ? 'Đóng' : 'Thêm sản phẩm mới'}</button>
        </div>
        {adding && (
          <form onSubmit={handleAddProduct} className="grid grid-cols-9 gap-2 mb-6 bg-white p-4 rounded shadow items-center">
            <input className="border rounded px-2 py-1 col-span-2" placeholder="Tên sản phẩm" value={addForm.name} onChange={e => handleAddChange('name', e.target.value)} required />
            <input className="border rounded px-2 py-1" placeholder="Hãng" value={addForm.brand} onChange={e => handleAddChange('brand', e.target.value)} />
            <input className="border rounded px-2 py-1" placeholder="Giá" type="number" value={addForm.price} onChange={e => handleAddChange('price', e.target.value)} required />
            <input className="border rounded px-2 py-1" placeholder="Link ảnh" value={addForm.imageUrl} onChange={e => handleAddChange('imageUrl', e.target.value)} required />
            <input className="border rounded px-2 py-1" placeholder="Đánh giá" type="number" value={addForm.rating} onChange={e => handleAddChange('rating', e.target.value)} />
            <input className="border rounded px-2 py-1" placeholder="Phong cách" value={addForm.style} onChange={e => handleAddChange('style', e.target.value)} />
            <label className="flex items-center gap-1"><input type="checkbox" checked={addForm.isHotDeal} onChange={e => handleAddChange('isHotDeal', e.target.checked)} />Hot</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={addForm.isNew} onChange={e => handleAddChange('isNew', e.target.checked)} />Mới</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={addForm.isBestSeller} onChange={e => handleAddChange('isBestSeller', e.target.checked)} />Bán chạy</label>
            <button type="submit" className="col-span-9 bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition">Thêm mới</button>
          </form>
        )}
        {loading ? <div>Đang tải...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="p-2">Tên sản phẩm</th>
                  <th className="p-2">Hãng</th>
                  <th className="p-2">Giá</th>
                  <th className="p-2">Ảnh</th>
                  <th className="p-2">Đánh giá</th>
                  <th className="p-2">Phong cách</th>
                  <th className="p-2">Hot</th>
                  <th className="p-2">Mới</th>
                  <th className="p-2">Bán chạy</th>
                  <th className="p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const isEditing = !!editRows[p.id];
                  return (
                    <tr key={p.id} className={isEditing ? 'bg-yellow-50 border-t-2 border-yellow-300' : 'border-t'}>
                      {isEditing ? (
                        <>
                          <td className="p-2"><input className="border rounded px-2 py-1 w-full" value={editRows[p.id].name} onChange={e => handleEditChange(p.id, 'name', e.target.value)} /></td>
                          <td className="p-2"><input className="border rounded px-2 py-1 w-full" value={editRows[p.id].brand} onChange={e => handleEditChange(p.id, 'brand', e.target.value)} /></td>
                          <td className="p-2"><input className="border rounded px-2 py-1 w-full" type="number" value={editRows[p.id].price} onChange={e => handleEditChange(p.id, 'price', e.target.value)} /></td>
                          <td className="p-2"><input className="border rounded px-2 py-1 w-full" value={editRows[p.id].imageUrl} onChange={e => handleEditChange(p.id, 'imageUrl', e.target.value)} /></td>
                          <td className="p-2"><input className="border rounded px-2 py-1 w-full" type="number" value={editRows[p.id].rating} onChange={e => handleEditChange(p.id, 'rating', e.target.value)} /></td>
                          <td className="p-2"><input className="border rounded px-2 py-1 w-full" value={editRows[p.id].style} onChange={e => handleEditChange(p.id, 'style', e.target.value)} /></td>
                          <td className="p-2 text-center"><input type="checkbox" checked={editRows[p.id].isHotDeal} onChange={e => handleEditChange(p.id, 'isHotDeal', e.target.checked)} /></td>
                          <td className="p-2 text-center"><input type="checkbox" checked={editRows[p.id].isNew} onChange={e => handleEditChange(p.id, 'isNew', e.target.checked)} /></td>
                          <td className="p-2 text-center"><input type="checkbox" checked={editRows[p.id].isBestSeller} onChange={e => handleEditChange(p.id, 'isBestSeller', e.target.checked)} /></td>
                          <td className="p-2 flex gap-2 justify-center">
                            <button onClick={() => handleSaveEdit(p.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Lưu</button>
                            <button onClick={() => handleCancelEdit(p.id)} className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-400">Hủy</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2">{p.name}</td>
                          <td className="p-2">{p.brand}</td>
                          <td className="p-2">{p.price?.toLocaleString()}₫</td>
                          <td className="p-2"><img src={p.imageUrl} alt="" className="h-12 w-12 object-contain mx-auto" /></td>
                          <td className="p-2 text-center">{p.rating}</td>
                          <td className="p-2">{p.style}</td>
                          <td className="p-2 text-center">{p.isHotDeal && <span className="bg-red-500 text-white px-2 rounded text-xs">Hot</span>}</td>
                          <td className="p-2 text-center">{p.isNew && <span className="bg-green-500 text-white px-2 rounded text-xs">Mới</span>}</td>
                          <td className="p-2 text-center">{p.isBestSeller && <span className="bg-yellow-400 text-white px-2 rounded text-xs">Bán chạy</span>}</td>
                          <td className="p-2 flex gap-2 justify-center">
                            <button onClick={() => handleEditRow(p.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Sửa</button>
                            <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Xóa</button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
