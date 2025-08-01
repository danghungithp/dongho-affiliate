import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Seo from '../components/Seo';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await axios.get(`/products/${id}`, { baseURL: process.env.REACT_APP_API_URL });
        setProduct(res.data);
      } catch (e) {
        setProduct(null);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center text-gray-500">Đang tải...</div>;
  if (!product) return <div className="text-center text-red-500">Không tìm thấy sản phẩm</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-6">
      <Seo
        title={`${product.name} - Đồng hồ nam`}
        description={`Mua ${product.name} hãng ${product.brand} giá tốt, phong cách ${product.style}, đánh giá ${product.rating || 0} sao.`}
        image={product.imageUrl}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.imageUrl} alt={product.name} className="w-full md:w-64 h-64 object-contain rounded bg-gray-100" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-gray-500 mb-2">Hãng: {product.brand}</div>
          <div className="text-gray-500 mb-2">Phong cách: {product.style}</div>
          <div className="text-yellow-500 mb-2">Đánh giá: {'★'.repeat(Math.round(product.rating || 0))}</div>
          <div className="text-blue-600 font-bold text-xl mb-4">{product.price?.toLocaleString()}₫</div>
          <div className="flex gap-2 mb-4">
            {product.isHotDeal && <span className="bg-red-500 text-white px-2 rounded text-xs">Hot</span>}
            {product.isNew && <span className="bg-green-500 text-white px-2 rounded text-xs">Mới</span>}
            {product.isBestSeller && <span className="bg-yellow-400 text-white px-2 rounded text-xs">Bán chạy</span>}
          </div>
          <a href={product.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Xem sản phẩm trên Shopee</a>
        </div>
      </div>
    </div>
  );
}
