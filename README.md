# Đồng Hồ Affiliate Marketing Web App

## Tính năng
- Trang chủ: Xem, lọc sản phẩm đồng hồ nam, lấy link Shopee
- Trang nhập Excel: Đăng nhập admin, upload file Excel để nhập sản phẩm
- Trang giới thiệu, liên hệ
- UI đẹp, hiện đại, responsive (TailwindCSS, Framer Motion)
- Backend Node.js + Express + SQLite, REST API, import Excel

## Hướng dẫn sử dụng

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
- API chạy ở http://localhost:5000
- DB SQLite tự tạo, có thể reset bằng cách xóa file DB

### 2. Frontend
```bash
cd frontend/dongho
npm install
npm start
```
- App chạy ở http://localhost:3000
- Đã cấu hình proxy và .env để gọi API backend

### 3. Đăng nhập admin
- Truy cập /import, đăng nhập user: `admin`, password: `Danghungit@85`

### 4. Import Excel
- File Excel cần các cột: name, brand, price, imageUrl, rating, style, isHotDeal, isNew, isBestSeller
- Các dòng thiếu name, price, imageUrl sẽ bị bỏ qua

## Công nghệ
- React, TailwindCSS, Framer Motion, Axios, React Router
- Node.js, Express, SQLite3, Multer, XLSX

## Reset database
- Xóa file DB (backend/data/database.sqlite), khởi động lại backend

## License
MIT