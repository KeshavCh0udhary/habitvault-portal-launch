
import type { Config } from "tailwindcss";

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
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
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
					DEFAULT: 'hsl(var(--accent))',
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// HabitVault custom colors
				"habit-purple": {
					DEFAULT: "#6C5DD3",
					50: "#F1EFFC",
					100: "#E3DFF9",
					200: "#C7BFF3",
					300: "#AB9FED",
					400: "#8F7EE8",
					500: "#6C5DD3",
					600: "#4B3BC9",
					700: "#392D9A",
					800: "#271F6B",
					900: "#15113C"
				},
				"habit-teal": {
					DEFAULT: "#41D0C7",
					50: "#E9F9F8",
					100: "#D3F4F1",
					200: "#A7E9E4",
					300: "#7BDFD7",
					400: "#41D0C7",
					500: "#2DB8B0",
					600: "#259A93",
					700: "#1D7B76",
					800: "#145D59",
					900: "#0C3E3B"
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"slide-in-from-top": {
					"0%": { transform: "translateY(-100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				},
				"slide-out-to-top": {
					"0%": { transform: "translateY(0)", opacity: "1" },
					"100%": { transform: "translateY(-100%)", opacity: "0" }
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" }
				},
				"fade-out": {
					from: { opacity: "1" },
					to: { opacity: "0" }
				},
				"scale-in": {
					from: { transform: "scale(0.95)", opacity: "0" },
					to: { transform: "scale(1)", opacity: "1" }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"ping-slow": {
					"75%, 100%": {
						transform: "scale(1.5)",
						opacity: "0"
					}
				},
				"cursor-gradient": {
					"0%, 100%": { 
						opacity: "0.5",
						background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(108, 93, 211, 0.15), transparent 40%)"
					},
					"50%": { 
						opacity: "1",
						background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(108, 93, 211, 0.25), transparent 40%)"
					}
				},
				"blink": {
					"0%, 100%": { borderColor: "transparent" },
					"50%": { borderColor: "currentColor" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"slide-in-from-top": "slide-in-from-top 0.3s ease-out",
				"slide-out-to-top": "slide-out-to-top 0.3s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"scale-in": "scale-in 0.3s ease-out",
				"float": "float 6s ease-in-out infinite",
				"ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
				"cursor-gradient": "cursor-gradient 4s ease infinite",
				"blink": "blink 0.75s step-end infinite"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
