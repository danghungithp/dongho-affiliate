import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import { Link } from 'react-router-dom';

const TAGS = [
  { key: 'isHotDeal', label: 'Hot deal', color: 'bg-red-500' },
  { key: 'isNew', label: 'New', color: 'bg-green-500' },
  { key: 'isBestSeller', label: 'Bestseller', color: 'bg-yellow-400' },
];

function TagBadges({ product }) {
  return (
    <div className="flex gap-1 mb-2">
      {TAGS.map(tag =>
        product[tag.key] ? (
          <span key={tag.key} className={`text-xs px-2 py-0.5 rounded-full text-white ${tag.color}`}>{tag.label}</span>
        ) : null
      )}
    </div>
  );
}

function ProductCard({ product, onGetLink }) {
  return (
    <motion.div className="bg-white rounded-xl shadow hover:shadow-lg p-4 flex flex-col" whileHover={{ scale: 1.03 }}>
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="h-40 w-full object-contain mb-2 rounded" />
      </Link>
      <TagBadges product={product} />
      <Link to={`/product/${product.id}`} className="font-semibold text-lg mb-1 hover:underline block">{product.name}</Link>
      <div className="text-gray-500 text-sm mb-1">{product.brand} • {product.style}</div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600 font-bold text-xl">{product.price?.toLocaleString()}₫</span>
        <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating || 0))}</span>
      </div>
      <button onClick={() => onGetLink(product.id)} className="mt-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition">Get Shopee Link</button>
    </motion.div>
  );
}


export default function Home() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brand: '', style: '', minPrice: '', maxPrice: '' });
  const [brands, setBrands] = useState([]);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    setPage(1); // Reset to first page on filter change
  }, [filters]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [filters, page]);

  async function fetchProducts() {
    setLoading(true);
    const params = { ...filters, page, pageSize };
    const res = await axios.get('/products', { baseURL: process.env.REACT_APP_API_URL, params });
    setProducts(res.data.products);
    setTotal(res.data.total);
    setLoading(false);
    // Extract unique brands/styles for filters (from all products, not just current page)
    if (page === 1) {
      // Fetch all for filter options
      const allRes = await axios.get('/products', { baseURL: process.env.REACT_APP_API_URL });
      setBrands([...new Set(allRes.data.products.map(p => p.brand).filter(Boolean))]);
      setStyles([...new Set(allRes.data.products.map(p => p.style).filter(Boolean))]);
    }
  }

  async function handleGetLink(id) {
    const res = await axios.get(`/affiliate/${id}`, { baseURL: process.env.REACT_APP_API_URL });
    window.open(res.data.link, '_blank');
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Seo
        title="Đồng hồ nam - Sản phẩm, giá tốt, nhiều hãng nổi tiếng"
        description="Website tiếp thị liên kết đồng hồ nam, nhập sản phẩm từ Excel, lọc và xem sản phẩm, lấy link Shopee, giá tốt, nhiều hãng nổi tiếng."
        image={products[0]?.imageUrl}
        url={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center">Sản phẩm đồng hồ nam</h1>
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <select className="border rounded px-3 py-2" value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))}>
            <option value="">Tất cả hãng</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="border rounded px-3 py-2" value={filters.style} onChange={e => setFilters(f => ({ ...f, style: e.target.value }))}>
            <option value="">Tất cả kiểu</option>
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="number" className="border rounded px-3 py-2 w-32" placeholder="Giá từ" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
          <input type="number" className="border rounded px-3 py-2 w-32" placeholder="Đến" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
        </div>
        {loading ? <div className="text-center text-gray-500">Đang tải...</div> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onGetLink={handleGetLink} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50">Trước</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded border ${p === page ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50">Sau</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
