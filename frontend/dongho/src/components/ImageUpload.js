import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/upload-image', formData, {
        baseURL: process.env.REACT_APP_API_URL,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch (e) {
      setError('Lỗi upload ảnh: ' + e.message);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" ref={inputRef} onChange={handleFile} className="hidden" />
      <button type="button" onClick={() => inputRef.current.click()} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
        {uploading ? 'Đang tải ảnh...' : 'Chọn ảnh'}
      </button>
      {value && <img src={value} alt="Ảnh sản phẩm" className="h-24 object-contain rounded border" />}
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
