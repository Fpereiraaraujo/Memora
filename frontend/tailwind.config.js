export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: {
                    950: '#2F1E16',
                    900: '#4A2F22',
                    800: '#7C5A45',
                },
                sand: {
                    50: '#FFF9F5',
                    100: '#FBF1E8',
                    200: '#F3E0D0',
                    300: '#E7CDB8',
                    400: '#C89C73',
                },
                rose: {
                    100: '#FBE4EA',
                    200: '#F5CDD7',
                    300: '#E8A7B2',
                    500: '#D98D9E',
                },
                sage: {
                    100: '#E3EEE5',
                    200: '#CFE0D2',
                    300: '#A9C0AD',
                    500: '#6D9276',
                },
            },
            boxShadow: {
                soft: '0 22px 50px rgba(96, 60, 36, 0.12)',
                pearl: '0 18px 42px rgba(82, 111, 90, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.62)',
            },
            backgroundImage: {
                'hero-radial': 'radial-gradient(circle at 18% 12%, rgba(232, 167, 178, 0.28), transparent 28%), radial-gradient(circle at 82% 10%, rgba(168, 115, 63, 0.18), transparent 26%), radial-gradient(circle at 74% 82%, rgba(232, 167, 178, 0.16), transparent 30%), linear-gradient(180deg, #fffaf6 0%, #f8eee6 48%, #f2e4d9 100%)',
            },
            fontFamily: {
                display: ['"Cormorant Garamond"', 'serif'],
                body: ['"Manrope"', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
