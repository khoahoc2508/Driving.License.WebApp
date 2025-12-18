'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image'; // <--- 1. THÊM DÒNG NÀY

import styles from './bio.module.css';

export default function BioPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    // Smooth Tilt Effect logic
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;

      const x = (window.innerWidth / 2 - e.pageX) / 25;
      const y = (window.innerHeight / 2 - e.pageY) / 25;

      card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    };

    // Spotlight logic
    const handleBtnMouseMove = (e: MouseEvent, btn: HTMLAnchorElement) => {
      if (window.matchMedia('(hover: hover)').matches) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Cập nhật biến CSS variable trực tiếp lên element
        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
      }
    };

    // Add listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add listeners to buttons using ref array
    const btns = document.querySelectorAll(`.${styles.glassBtn}`);

    btns.forEach((btn) => {
      // Cast to HTMLElement to add listener
      (btn as HTMLAnchorElement).addEventListener('mousemove', (e) => handleBtnMouseMove(e, btn as HTMLAnchorElement));
    });

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      btns.forEach((btn) => {
        // Clone lại node để remove listener đôi khi phức tạp,
        // nhưng React sẽ unmount component này nên về cơ bản là an toàn.
        // Để chặt chẽ:
        (btn as HTMLAnchorElement).removeEventListener('mousemove', (e) => handleBtnMouseMove(e, btn as HTMLAnchorElement));
      });
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Background Elements */}
      <div className={styles.ambientWrapper}>
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
        <div className={`${styles.blob} ${styles.blob3}`}></div>
      </div>

      {/* Main Card */}
      <div className={styles.container} ref={cardRef} id="glassCard">

        <div className={styles.avatarWrapper}>
          {/* <svg className={styles.avatar} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ background: '#f1f5f9' }}>
            <path d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0ZM50 25C60.3 25 68.8 33.3 68.8 43.8C68.8 54.2 60.3 62.5 50 62.5C39.7 62.5 31.2 54.2 31.2 43.8C31.2 33.3 39.7 25 50 25ZM50 91.2C38.3 91.2 28 85.8 21.2 77.5C21.4 67.9 40.4 62.5 50 62.5C59.6 62.5 78.6 67.9 78.8 77.5C72 85.8 61.7 91.2 50 91.2Z" fill="#94a3b8" />
          </svg> */}

          <Image
            src="/logo.jpeg"           // Đường dẫn file ảnh trong thư mục public
            alt="Avatar Bằng Lái Xanh"
            fill                        // Tự động phủ kín khung cha (avatarWrapper)
            className={styles.avatar}   // Giữ nguyên class style cũ để có bo tròn, viền...
            priority                    // Load ngay lập tức (vì ảnh nằm đầu trang)
            sizes="(max-width: 480px) 96px, 110px" // Giúp trình duyệt tải ảnh đúng kích thước
          />
          <div className={styles.statusDot}></div>
        </div>

        <h1 className={styles.title}>Bằng Lái Xanh</h1>
        <p className={styles.tagline}>Cấp đổi bằng & Tư vấn bằng lái xe</p>

        <p className={styles.sectionTitle}>Liên hệ nhanh</p>

        <div className={styles.linkGrid}>
          {/* Zalo */}
          <a href="https://zalo.me/0362225161" target="_blank" className={`${styles.glassBtn} ${styles.zalo}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10 c4.722,0,8.883-2.348,11.417-5.931V36H15z" /><path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19 c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742  c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083    C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z" /><path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75 S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z" /><path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z" /><path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75 S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5   c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z" /><path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5 c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z" /></svg>
            <span>Tư Vấn Bằng Lái Xe</span>
            <div className={styles.zaloBadge}>24/7</div>
          </a>

          {/* Hotline */}
          <a href="tel:0362225161" className={styles.glassBtn}>
            <svg style={{ color: '#ef4444' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.01 15.38C18.81 15.38 17.66 15.19 16.56 14.83C16.22 14.71 15.83 14.8 15.57 15.06L13.43 17.2C10.68 15.8 8.19 13.31 6.8 10.57L8.94 8.43C9.2 8.16 9.28 7.78 9.17 7.44C8.81 6.34 8.62 5.19 8.62 4C8.62 3.45 8.17 3 7.62 3H4.19C3.65 3 3 3.24 3 4.1C3 14.1 11.23 22 21 22C21.72 22 22 21.43 22 20.81V17.38C22 16.83 21.55 16.38 21 16.38H20.01V15.38Z" /></svg>
            <span>Hotline</span>
          </a>

          {/* TikTok */}
          <a href="https://www.tiktok.com/@banglaixanh" target="_blank" className={styles.glassBtn}>
            <svg style={{ color: '#000000' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
            <span>TikTok</span>
            <svg className={styles.iconArrow} viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" /></svg>
          </a>


          {/* Website - ĐÃ SỬA ICON CHUẨN */}
          <a href="https://banglaixanh.vn" target="_blank" rel="noopener noreferrer" className={styles.glassBtn}>
            <svg style={{ color: '#00bfa5' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span> Website</span>
            <svg className={styles.iconArrow} viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" /></svg>
          </a>


          {/* Facebook Fanpage */}
          <a href="https://www.facebook.com/share/1BsHBFWZRK/?mibextid=wwXIfr" target="_blank" className={styles.glassBtn}>
            <svg style={{ color: '#1877F2' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg>
            <span>Fanpage</span>
            <svg className={styles.iconArrow} viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" /></svg>
          </a>

          {/* Facebook Group - ĐÃ CẬP NHẬT ICON GROUP CHO KHÁC BIỆT */}
          <a href="https://www.facebook.com/groups/825155033605894" target="_blank" className={styles.glassBtn}>
            <svg style={{ color: '#1877F2' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span>[Nhóm] Hỏi Đáp Tình Huống Giao...</span>
            <svg className={styles.iconArrow} viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" /></svg>
          </a>
        </div>

        <footer className={styles.footer}>
          © Bằng Lái Xanh
        </footer>

      </div>
    </div>
  );
}
