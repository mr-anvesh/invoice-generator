# Invoice Generator

A modern, feature-rich invoice generator built with Next.js, React, and TypeScript. Create, customize, and download professional invoices with ease. Features both a web interface and a REST API for programmatic invoice generation.

## Features

### Web Interface
- **Interactive Invoice Editor**: User-friendly form to input all invoice details
- **Real-time Preview**: See your invoice as you build it
- **Client-side PDF Export**: Download your invoice as a professional PDF document using jsPDF and html2canvas
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Support for system and user-selected themes

### API Features
- **REST API**: Generate PDFs programmatically via HTTP POST requests
- **Server-side PDF Generation**: High-quality PDFs using Puppeteer for consistent rendering
- **Base64 Logo Support**: Upload company logos as Base64 encoded images
- **Multi-format Export**: API returns PDF files with proper headers for download

### Invoice Features
- **Multi-currency Support**: Create invoices with different currencies and automatic exchange rate conversion
- **Advanced Discount System**: Apply discounts at both item and invoice levels with flexible rules
- **Tax Calculation**: Automatically calculate taxes based on configurable rates
- **Customizable Branding**: Add your company logo and business details
- **Professional Layout**: Clean, print-ready invoice design optimized for business use

## Technology Stack

- **Framework**: Next.js 15.x with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **PDF Generation**: 
  - Client-side: jsPDF and html2canvas
  - Server-side: Puppeteer for API endpoints
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Hooks (useState, useRef)
- **Unique IDs**: UUID for item identification
- **Themes**: next-themes for dark/light mode support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/invoice-generator.git
   cd invoice-generator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## Usage

### Web Interface

1. **Create an Invoice**: Fill in the form with your company details, client information, and line items
2. **Preview**: Switch to the preview tab to see how your invoice looks
3. **Download**: Click the "Download PDF" button to save your invoice as a PDF file

### API Demo

Visit the interactive API demo at [http://localhost:3000/api-demo](http://localhost:3000/api-demo) to:

- Test the API with sample invoice data
- Modify JSON payload in real-time
- Generate and download PDFs via the API
- View curl command examples
- Understand API request/response formats

### API Usage

The application provides a powerful REST API for programmatic invoice generation, plus an interactive demo page to test the API.

**API Demo Page:** Visit [http://localhost:3000/api-demo](http://localhost:3000/api-demo) for an interactive interface to test the API with sample data.

**Quick API Example:**

```bash
curl -X POST http://localhost:3000/api/invoices/create \
  -H "Content-Type: application/json" \
  -d '{"invoiceNumber": "INV-001", "date": "2025-06-06", ...}' \
  --output invoice.pdf
```

**API Features:**
- Server-side PDF generation using Puppeteer
- High-quality, consistent output across platforms
- Support for Base64 logo embedding
- Comprehensive validation and error handling
- Multi-currency and discount calculations

See the [API Documentation](./API_DOCUMENTATION.md) for complete usage instructions.

## Project Structure

```text
invoice-generator/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── invoices/create/  # PDF generation endpoint
│   ├── api-demo/          # Interactive API testing page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── invoice-form.tsx  # Invoice form component
│   ├── invoice-preview.tsx # Invoice preview
│   └── theme-provider.tsx # Theme management
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## Detailed Features

- **Company Branding**: Upload your logo and add company details
- **Client Information**: Add recipient details including name, email, and address
- **Line Items**: Add multiple items with descriptions, quantities, and prices
- **Multi-currency Support**: Set different currencies for individual line items with exchange rate conversion
- **Advanced Discounts**: Apply percentage or fixed amount discounts to individual items or the entire invoice
- **Tax Calculation**: Add tax rates that automatically calculate the final amount
- **Notes and Footer**: Add custom notes and footer text to your invoice
- **Professional Formatting**: Clean, business-ready invoice layout optimized for printing

## Development

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Environment Requirements

- Node.js 18+ (required for Next.js 15.x)
- Modern browser with ES2015+ support
- Sufficient system memory for Puppeteer PDF generation

### Key Dependencies

- **Next.js 15.x** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Puppeteer** - Headless Chrome for server-side PDF generation
- **jsPDF** - Client-side PDF generation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

[Anvesh Mishra](https://github.com/mr-anvesh)

---

Built with ❤️ using Next.js and React.