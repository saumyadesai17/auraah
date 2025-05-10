// src/fonts/satoshi.ts
import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [
    {
      path: './Satoshi/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Satoshi/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});