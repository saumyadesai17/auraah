// filepath: tailwind.config.js
// @ts-check  // Optional: Enables some type checking in JS files if your editor supports it
/** @type {import('tailwindcss').Config} */

console.log("tailwind.config.js IS BEING LOADED AND PARSED!");

const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx,css}",
    ],
    theme: {
        extend: {
            colors: {
                'amethyst': '#9067c6',
                'tropical-indigo': '#8d86c9',
                'eggshell': '#f0ebd8',
                'ash-gray': '#aac0af',
                'raisin-black': '#1a1b25',
                'custom-purple': {
                    light: '#a37fd7',
                    DEFAULT: '#9067c6',
                    dark: '#7a56a8',
                },
                'custom-indigo': {
                    light: '#a099d3',
                    DEFAULT: '#8d86c9',
                    dark: '#756fb0',
                },
                'custom-bg': '#1a1b25',
                'custom-text': '#f0ebd8',
                'custom-text-secondary': '#aac0af',
                'custom-border': '#3c3e52',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'subtle-pulse': 'subtlePulse 2s infinite ease-in-out',
                'card-swipe-next': 'cardSwipeNext 0.4s ease-in-out forwards',
                'card-swipe-prev': 'cardSwipePrev 0.4s ease-in-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                subtlePulse: {
                    '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(144, 103, 198, 0.3)' },
                    '50%': { transform: 'scale(1.02)', boxShadow: '0 0 10px 5px rgba(144, 103, 198, 0.1)' },
                },
                cardSwipeNext: {
                    '0%': { transform: 'translateX(0) rotate(0)', opacity: '1' },
                    '100%': { transform: 'translateX(100%) rotate(10deg)', opacity: '0' },
                },
                cardSwipePrev: {
                    '0%': { transform: 'translateX(0) rotate(0)', opacity: '1' },
                    '100%': { transform: 'translateX(-100%) rotate(-10deg)', opacity: '0' },
                }
            },
            boxShadow: {
                'glow-purple': '0 0 15px 5px rgba(144, 103, 198, 0.4)',
                'glow-indigo': '0 0 15px 5px rgba(141, 134, 201, 0.4)',
            }
        },
    },
    plugins: [],
};

module.exports = config; // Use CommonJS export for .js config files