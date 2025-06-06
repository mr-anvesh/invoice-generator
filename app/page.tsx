import Link from "next/link"
import InvoiceGenerator from "@/components/invoice-generator"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="container mx-auto py-6 sm:py-10 px-4">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Invoice Generator</h1>
          <nav className="flex gap-4">
            <Link 
              href="/" 
              className="text-sm hover:text-foreground transition-colors text-muted-foreground"
            >
              Canvas Demo
            </Link>
            <Link 
              href="/api-demo" 
              className="text-sm hover:text-foreground transition-colors text-muted-foreground"
            >
              API Demo
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
      <InvoiceGenerator />
      <footer className="mt-8 sm:mt-10 text-center text-muted-foreground text-sm pb-4">
        <p>
          © {new Date().getFullYear()}{" "}
          <Link
            href="https://github.com/mr-anvesh"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-foreground transition-colors"
          >
            ANVESH MISHRA
          </Link>
          . All rights reserved.
        </p>
      </footer>
    </main>
  )
}
