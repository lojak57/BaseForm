import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				threadGold: "#C3884F",
				threadPurple: "#4F4F80",
				threadGray: "#575353",
				threadBlue: "#0E406B",
				threadDarkBlue: "#172A48",
				darkText: "#575353",
				ivory: '#FFFFF4',
				lightGray: '#94A3B8',
				minimalist: {
					primary: '#27272A',
					secondary: '#71717A',
					accent: '#3B82F6',
					background: '#FAFAFA',
					text: '#18181B',
				},
				elegant: {
					primary: '#7E22CE',
					secondary: '#E879F9',
					accent: '#F59E0B',
					background: '#FAF5FF',
					text: '#581C87',
				},
				bold: {
					primary: '#DC2626',
					secondary: '#FBBF24',
					accent: '#2563EB',
					background: '#FEFEFE',
					text: '#111827',
				},
				playful: {
					primary: '#06B6D4',
					secondary: '#F97316',
					accent: '#8B5CF6',
					background: '#ECFEFF',
					text: '#0E7490',
				},
				modern: {
					primary: '#10B981',
					secondary: '#6366F1',
					accent: '#F43F5E',
					background: '#F0FDF4',
					text: '#064E3B',
				},
			},
			fontFamily: {
				'sans': ['var(--font-sans)', ...fontFamily.sans],
				'playfair': ["Playfair Display", "serif"],
				'poppins': ['Poppins', 'sans-serif'],
				'montserrat': ['Montserrat', 'sans-serif'],
				'raleway': ['Raleway', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			boxShadow: {
				'soft': '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
				'product': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
				'card': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)',
				'hover': '0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)',
				'inner-glow': 'inset 0 0 15px rgba(255, 255, 255, 0.5)',
				'glow': '0 0 20px rgba(59, 130, 246, 0.25)',
				'custom': '0 0 10px rgba(0, 0, 0, 0.05)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'stitch': {
					'0%, 100%': { opacity: '0.8' },
					'50%': { opacity: '0.4' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-8px) rotate(5deg)' },
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '0.6' },
					'50%': { opacity: '0.3' },
				},
				'bounce-soft': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-15px)' },
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'gradient-rotate': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '200% 200%' }
				},
				'gradient-primary-secondary': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '100% 100%' }
				},
				'gradient-secondary-accent': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '100% 100%' }
				},
				'gradient-accent-primary': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '100% 100%' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in': 'slide-in 0.5s ease-out',
				'stitch': 'stitch 2s ease-in-out infinite',
				'float': 'float 4s ease-in-out infinite',
				'float-slow': 'float-slow 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'bounce-soft': 'bounce-soft 3s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'shimmer': 'shimmer 2s infinite',
				'gradient-rotate': 'gradient-rotate 3s linear infinite',
				'gradient-primary-secondary': 'gradient-primary-secondary 2s linear infinite',
				'gradient-secondary-accent': 'gradient-secondary-accent 2s linear infinite',
				'gradient-accent-primary': 'gradient-accent-primary 2s linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-diagonal': 'linear-gradient(45deg, var(--tw-gradient-stops))',
				'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
				'gradient-primary-secondary': 'linear-gradient(to right, var(--primary), var(--secondary))',
				'gradient-secondary-accent': 'linear-gradient(to right, var(--secondary), var(--accent))',
				'gradient-accent-primary': 'linear-gradient(to right, var(--accent), var(--primary))',
			},
			backdropBlur: {
				xs: '2px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
