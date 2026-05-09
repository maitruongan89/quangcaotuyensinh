import "./globals.css";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({ 
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata = {
  title: "TRƯỜNG TCN TH ASEAN - Tạo Poster Tuyển Sinh Lái Xe",
  description: "Công cụ tạo poster tuyển sinh chuyên nghiệp của Trường Trung cấp Nghề Tổng hợp ASEAN - nhanh chóng, đẹp, chuẩn 1080×1350px.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
