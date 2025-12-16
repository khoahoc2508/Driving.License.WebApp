import type { Metadata, Viewport } from 'next';

import BioClient from './BioClient';

// 1. CẤU HÌNH VIEWPORT
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

// 2. CẤU HÌNH OPEN GRAPH
export const metadata: Metadata = {
    title: 'Bằng Lái Xanh - Bio Link',
    description: 'Cấp đổi bằng & Tư vấn bằng lái xe - Hỗ trợ 24/7',
    metadataBase: new URL('https://banglaixanh.com'),

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
