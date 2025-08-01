
import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

export default function Import() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const basicAuth = 'Basic ' + btoa('admin:Danghungit@85');
      const res = await axios.post('/products/import', formData, {
        baseURL: process.env.REACT_APP_API || 'http://localhost:5000',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': basicAuth
        },
      });
      setResult(res.data);
      setToast({ message: `Đã nhập ${res.data.imported} sản phẩm, bỏ qua ${res.data.skipped} dòng`, type: 'success' });
    } catch (e) {
      setResult({ error: e.message });
      setToast({ message: 'Lỗi nhập file: ' + e.message, type: 'error' });
    }
    setUploading(false);
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Nhập sản phẩm từ Excel</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded" disabled={uploading}>{uploading ? 'Đang tải...' : 'Tải lên & Nhập'}</button>
      </form>
      {result && (
        <div className="mt-4 text-sm">
          {result.error ? (
            <div className="text-red-500">Lỗi: {result.error}</div>
          ) : (
            <div>
              <div className="text-green-600 font-semibold">Đã nhập: {result.imported} sản phẩm</div>
              <div className="text-yellow-600">Bỏ qua: {result.skipped} dòng</div>
              {result.errors && result.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Chi tiết lỗi ({result.errors.length})</summary>
                  <ul className="list-disc ml-6">
                    {result.errors.map((err, i) => <li key={i}>{err.error}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
      )}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
}
