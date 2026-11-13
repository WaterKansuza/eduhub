/* EduHub Tailwind theme configuration. */

window.tailwind = window.tailwind || {};
window.tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Be Vietnam Pro', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                        display: ['Space Grotesk', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            500: '#8B7CFF',
                            600: '#8B7CFF',
                            700: '#7563f7',
                        },
                        cosmic: {
                            deep: '#0F1014',
                            bg: '#17181C',
                            surface: '#232429',
                            raised: '#2E3037',
                            primary: '#8B7CFF',
                            secondary: '#5CE1E6',
                            star: '#FFD479',
                            success: '#4ADE9A',
                            warning: '#FFC857',
                            error: '#FF6B81',
                            text: '#E6E7EB',
                            muted: '#8D909C',
                        }
                    }
                }
            }
        }
