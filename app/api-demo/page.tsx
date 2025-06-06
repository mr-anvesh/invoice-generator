"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import type { InvoiceData } from "@/types/invoice"

export default function ApiDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string>("")
  
  const sampleInvoiceData: InvoiceData = {
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    companyName: "Acme Corporation",
    companyLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    companyDetails: "123 Business Street\nNew York, NY 10001\nPhone: (555) 123-4567\nEmail: info@acme.com",
    fromName: "John Doe",
    fromEmail: "john@acme.com",
    fromAddress: "123 Business Street\nNew York, NY 10001",
    toName: "Jane Smith",
    toEmail: "jane@client.com",
    toAddress: "456 Client Avenue\nClient City, State 67890",
    items: [
      {
        id: "item-1",
        description: "Web Development Services",
        quantity: 40,
        price: 150.00,
        currency: "USD",
        exchangeRate: 1,
        discountType: "percentage",
        discountValue: 10
      },
      {
        id: "item-2",
        description: "Hosting Services (Monthly)",
        quantity: 12,
        price: 25.00,
        currency: "USD",
        exchangeRate: 1,
        discountType: "amount",
        discountValue: 0
      },
      {
        id: "item-3",
        description: "Design Consultation",
        quantity: 8,
        price: 200.00,
        currency: "EUR",
        exchangeRate: 1.1,
        discountType: "percentage",
        discountValue: 5
      }
    ],
    notes: "Payment due within 30 days\nBank Transfer Details:\nAccount: 123456789\nRouting: 987654321\n\nThank you for choosing our services!",
    taxRate: 8.5,
    currency: "USD",
    footer: "Thank you for your business! | www.acme.com | support@acme.com",
    discountType: "percentage",
    discountValue: 5,
    applyInvoiceDiscountToDiscountedItems: false
  }

  const [invoiceData, setInvoiceData] = useState<string>(
    JSON.stringify(sampleInvoiceData, null, 2)
  )

  const testApiEndpoint = async () => {
    setIsLoading(true)
    setResponse("")
    
    try {
      const parsedData = JSON.parse(invoiceData)
      
      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData)
      })

      if (response.ok) {
        // Create blob and download the PDF
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `invoice-${parsedData.invoiceNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setResponse(`✅ Success! PDF downloaded as invoice-${parsedData.invoiceNumber}.pdf`)
      } else {
        const errorData = await response.json()
        setResponse(`❌ Error: ${errorData.error}`)
      }
    } catch (error) {
      setResponse(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const generateCurlCommand = () => {
    try {
      const parsedData = JSON.parse(invoiceData)
      return `curl -X POST http://localhost:3000/api/invoices/create \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(parsedData, null, 0)}' \\
  --output invoice-${parsedData.invoiceNumber}.pdf`
    } catch {
      return "Invalid JSON data"
    }
  }

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
              className="text-sm hover:text-foreground transition-colors font-medium"
            >
              API Demo
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
      
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Invoice Generator API Demo</h1>
        <p className="text-muted-foreground">
          Test the <code>/api/invoices/create</code> endpoint that generates PDF invoices from JSON data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Data (JSON)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="invoice-data">Edit the invoice data below:</Label>
              <Textarea
                id="invoice-data"
                value={invoiceData}
                onChange={(e) => setInvoiceData(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Enter invoice data as JSON..."
              />
            </div>
            <Button 
              onClick={testApiEndpoint} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Generating PDF..." : "Generate PDF via API"}
            </Button>
            {response && (
              <div className={`p-3 rounded-md ${
                response.includes('✅') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {response}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Endpoint</h3>
              <code className="bg-muted p-2 rounded block">
                POST /api/invoices/create
              </code>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Response</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Content-Type: application/pdf</li>
                <li>Returns: Binary PDF data</li>
                <li>Filename: invoice-{"{invoiceNumber}"}.pdf</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">curl Command</h3>
              <div className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
                <pre>{generateCurlCommand()}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features Demonstrated</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Multi-currency support (USD, EUR)</li>
                <li>Item-level discounts (percentage & amount)</li>
                <li>Invoice-level discounts</li>
                <li>Tax calculations</li>
                <li>Professional PDF formatting</li>
                <li>Server-side rendering with Puppeteer</li>
                <li>Base64 logo validation and embedding</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Logo Requirements</h3>
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Company logos must be provided as Base64 encoded data URLs:
                </p>
                <code className="bg-muted p-2 rounded block text-xs">
                  data:image/[type];base64,[base64-data]
                </code>
                <p className="text-muted-foreground">
                  Supported formats: PNG, JPG, JPEG, GIF, WebP, SVG
                </p>
                <details className="cursor-pointer">
                  <summary className="text-blue-600 hover:text-blue-800">
                    Show example Base64 logo
                  </summary>
                  <code className="bg-muted p-2 rounded block text-xs mt-2 break-all">
                    data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==
                  </code>
                </details>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Full API documentation is available in the{" "}
                <code>API_DOCUMENTATION.md</code> file in the project root.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sample JavaScript Code</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`const invoiceData = {
  invoiceNumber: "INV-001",
  date: "2025-06-06",
  dueDate: "2025-07-06",
  // ... other fields
};

const response = await fetch('/api/invoices/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(invoiceData)
});

if (response.ok) {
  const blob = await response.blob();
  // Download or display the PDF
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'invoice.pdf';
  a.click();
} else {
  const error = await response.json();
  console.error('Error:', error);
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
    </main>
  )
}