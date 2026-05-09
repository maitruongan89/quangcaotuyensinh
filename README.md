# 🚗 Ứng dụng Tạo Poster Tuyển Sinh Lái Xe

Công cụ giúp giáo viên dạy lái xe tạo poster quảng cáo chuyên nghiệp bằng cách chèn Tên và Số điện thoại vào các mẫu có sẵn.

## 📁 Cấu trúc thư mục ảnh mẫu
Đặt các file ảnh poster mẫu (định dạng `.png` hoặc `.jpg`) vào thư mục:
`public/templates/`

Tên file mặc định yêu cầu:
- `mau-1.png`
- `mau-2.png`
- `mau-3.png`

*Lưu ý: Ảnh mẫu phải có kích thước chuẩn **1080x1350px**.*

## ⚙️ Hướng dẫn tùy chỉnh mẫu (Template)

Mở file `app/page.jsx`, tìm mảng `templates`. Mỗi đối tượng trong mảng có cấu trúc sau:

```javascript
{
  id: 'mau-1',
  name: 'Tên hiển thị của mẫu',
  image: '/templates/mau-1.png',
  
  // Thông tin khung tên giáo viên
  teacherBox: {
    left: 120,    // Khoảng cách từ lề trái (pixel)
    top: 1115,    // Khoảng cách từ lề trên (pixel)
    width: 290,   // Chiều rộng vùng chứa chữ
    height: 55,   // Chiều cao vùng chứa chữ
    fontSize: 32, // Cỡ chữ mặc định
    color: '#003B8F', // Màu chữ (Hex)
    fontWeight: 900,  // Độ đậm (400-900)
    align: 'left'     // Căn lề: left, center, right
  },

  // Thông tin khung số điện thoại
  phoneBox: {
    left: 205,
    top: 1245,
    width: 430,
    height: 75,
    fontSize: 58,
    color: '#FFD600',
    fontWeight: 900,
    align: 'left'
  }
}
```

## 🛠 Cách chạy ứng dụng

### 1. Cài đặt môi trường
Yêu cầu Node.js phiên bản 18 trở lên.

```bash
npm install
```

### 2. Chạy ở chế độ phát triển (Local)
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### 3. Build sản phẩm
```bash
npm run build
```

## 🚀 Deployment (Vercel)
1. Đưa code lên GitHub/GitLab.
2. Kết nối repo với Vercel.
3. Vercel sẽ tự động nhận diện project Next.js và deploy.

## 📋 Yêu cầu kỹ thuật
- **Kích thước poster**: 1080x1350px (Tỷ lệ 4:5).
- **Thư viện xuất ảnh**: `html-to-image`.
- **Styling**: Tailwind CSS.
- **Icons**: Lucide React.
