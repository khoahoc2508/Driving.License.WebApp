// FILE: app/bio/page.tsx
import { Metadata, Viewport } from 'next';
import BioClient from './BioClient'; // Import component ở trên

// --- QUAN TRỌNG: ĐOẠN NÀY THAY THẾ CHO THẺ <meta name="viewport" ... /> CŨ CỦA BẠN ---
// Nó giúp giao diện KHÔNG bị thu nhỏ, KHÔNG bị padding thừa.
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Tương đương user-scalable=no
};

// --- CẤU HÌNH OPEN GRAPH ---
export const metadata: Metadata = {
    title: 'Bằng Lái Xanh - Bio Link',
    description: 'Cấp đổi bằng & Tư vấn bằng lái xe - Hỗ trợ 24/7',
    metadataBase: new URL('https://banglaixanh.com'), // Thay domain thật của bạn

    openGraph: {
        title: 'Bằng Lái Xanh - Bio Link',
        description: 'Dịch vụ cấp đổi và tư vấn bằng lái xe uy tín, nhanh chóng.',
        url: 'https://banglaixanh.com',
        siteName: 'Bằng Lái Xanh',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: '/logo.jpeg',
                width: 800,
                height: 800,
                alt: 'Avatar Bằng Lái Xanh',
            },
        ],
    },
};

export default function Page() {
    return <BioClient />;
}
