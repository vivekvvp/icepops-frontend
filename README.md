# Skippi Ice Pops - Product Launch Page

A modern, responsive product launch page for Skippi's new Cream Rolls, built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- ✨ Modern and responsive design
- 🎨 Beautiful UI with Tailwind CSS
- 🧩 Reusable components with shadcn/ui
- 🌗 Dark mode support
- ⚡ Built with Next.js 14 App Router
- 📱 Mobile-first approach
- 🎯 TypeScript for type safety

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Fonts:** Plus Jakarta Sans (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd icepops-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
icepops-frontend/
├── app/
│   ├── globals.css      # Global styles and Tailwind directives
│   ├── layout.tsx       # Root layout with font configuration
│   └── page.tsx         # Home page
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section with product launch
│   ├── Features.tsx     # Product features section
│   ├── Flavors.tsx      # Flavor selector section
│   └── Footer.tsx       # Footer component
├── lib/
│   └── utils.ts         # Utility functions
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies

```

## Components

### Header
- Navigation menu
- Search functionality
- Shopping cart button
- User profile

### Hero
- Large product showcase
- Call-to-action buttons
- Customer testimonials
- Animated badges

### Features
- Three feature cards with icons
- Hover animations
- Responsive grid layout

### Flavors
- Product flavor showcase
- Grid layout with product cards
- Add to cart functionality
- "See All" link

### Footer
- Brand logo
- Quick links
- Social media icons

## Customization

### Colors

The color scheme is defined in `tailwind.config.ts`. Main colors include:
- Primary: `#ea2a33` (Red)
- Background Light: `#f8f6f6`
- Background Dark: `#211111`
- Cream Soft: `#FFFBF2`
- Chocolate Rich: `#3D2B1F`

### Fonts

The project uses Plus Jakarta Sans from Google Fonts, configured in `app/layout.tsx`.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

To start the production server:

```bash
npm run start
# or
yarn start
# or
pnpm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

## License

MIT License - feel free to use this project for your own purposes.
