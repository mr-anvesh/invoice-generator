# Invoice Generator API Documentation

## Overview

The Invoice Generator API provides a single endpoint to create professional invoices and return them as PDF documents. The API accepts invoice data in JSON format and generates a beautifully formatted PDF using server-side rendering.

## Base URL

```
http://localhost:3000/api/invoices
```

## Endpoints

### POST /create

Creates a new invoice and returns it as a PDF document.

#### Request

**Headers:**
- `Content-Type: application/json`

**Body:**
The request body should contain an `InvoiceData` object with the following structure:

```json
{
  "invoiceNumber": "INV-001",
  "date": "2025-06-06",
  "dueDate": "2025-07-06",
  "companyName": "Your Company Ltd",
  "companyLogo": "data:image/png;base64,iVBORw0KGgoAAAANS...", // Optional: base64 encoded image
  "companyDetails": "123 Business Street\nCity, State 12345\nPhone: (555) 123-4567",
  "fromName": "John Doe",
  "fromEmail": "john@company.com",
  "fromAddress": "123 Business Street\nCity, State 12345",
  "toName": "Jane Smith",
  "toEmail": "jane@client.com", 
  "toAddress": "456 Client Avenue\nClient City, State 67890",
  "items": [
    {
      "id": "item-1",
      "description": "Web Development Services",
      "quantity": 40,
      "price": 150.00,
      "currency": "USD",
      "exchangeRate": 1,
      "discountType": "percentage",
      "discountValue": 10
    },
    {
      "id": "item-2", 
      "description": "Hosting Services",
      "quantity": 12,
      "price": 25.00,
      "currency": "USD",
      "exchangeRate": 1,
      "discountType": "amount",
      "discountValue": 0
    }
  ],
  "notes": "Payment due within 30 days\nBank details: Account #123456789",
  "taxRate": 8.5,
  "currency": "USD",
  "footer": "Thank you for your business!",
  "discountType": "percentage",
  "discountValue": 5,
  "applyInvoiceDiscountToDiscountedItems": false
}
```

#### Response

**Success (200 OK):**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="invoice-{invoiceNumber}.pdf"`
- **Body:** Binary PDF data

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Invoice number is required"
}
```

**400 Bad Request:**
```json
{
  "error": "At least one item is required"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to generate PDF"
}
```

## Data Types

### InvoiceData

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `invoiceNumber` | string | Yes | Unique invoice identifier |
| `date` | string | Yes | Invoice date (YYYY-MM-DD format) |
| `dueDate` | string | Yes | Payment due date (YYYY-MM-DD format) |
| `companyName` | string | No | Your company name |
| `companyLogo` | string | No | Base64 encoded company logo image (data:image/[type];base64,[data]) |
| `companyDetails` | string | No | Company address, registration details, etc. |
| `fromName` | string | Yes | Sender name |
| `fromEmail` | string | Yes | Sender email address |
| `fromAddress` | string | Yes | Sender address |
| `toName` | string | Yes | Recipient name |
| `toEmail` | string | Yes | Recipient email address |
| `toAddress` | string | Yes | Recipient address |
| `items` | LineItem[] | Yes | Array of invoice line items |
| `notes` | string | No | Additional notes (payment terms, etc.) |
| `taxRate` | number | Yes | Tax rate as percentage (e.g., 8.5 for 8.5%) |
| `currency` | string | Yes | Invoice currency code (e.g., "USD", "EUR") |
| `footer` | string | No | Footer text for the invoice |
| `discountType` | "percentage" \| "amount" | Yes | Type of invoice-level discount |
| `discountValue` | number | Yes | Invoice discount value |
| `applyInvoiceDiscountToDiscountedItems` | boolean | Yes | Whether to apply invoice discount to already discounted items |

### LineItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique item identifier |
| `description` | string | Yes | Item description |
| `quantity` | number | Yes | Item quantity |
| `price` | number | Yes | Unit price |
| `currency` | string | Yes | Item currency code |
| `exchangeRate` | number | Yes | Exchange rate to invoice currency (1 if same currency) |
| `discountType` | "percentage" \| "amount" | Yes | Type of item discount |
| `discountValue` | number | Yes | Item discount value |

## Supported Currencies

The API supports the following currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)
- INR (Indian Rupee)
- BRL (Brazilian Real)
- LKR (Sri Lankan Rupee)

## Logo Requirements

Company logos must be provided as **Base64 encoded data URLs** in the following format:

```
data:image/[type];base64,[base64-encoded-data]
```

### Supported Image Formats
- PNG (`data:image/png;base64,...`)
- JPG/JPEG (`data:image/jpeg;base64,...`)
- GIF (`data:image/gif;base64,...`)
- WebP (`data:image/webp;base64,...`)
- SVG (`data:image/svg+xml;base64,...`)

### Example Base64 Logo
```json
{
  "companyLogo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
}
```

### Converting Images to Base64
You can convert images to Base64 using various methods:

**JavaScript (Browser):**
```javascript
// Using FileReader API
const fileInput = document.getElementById('logo-input');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = function(e) {
  const base64Logo = e.target.result; // This is your data URL
  // Use base64Logo in your invoice data
};

reader.readAsDataURL(file);
```

**Command Line:**
```bash
# macOS/Linux
base64 -i your-logo.png | pbcopy  # Copies to clipboard
echo "data:image/png;base64,$(base64 -i your-logo.png)" > logo.txt

# Note: You need to prepend "data:image/[type];base64," to the output
```

### Validation
The API validates that:
1. The logo string starts with `data:image/`
2. Contains a valid MIME type
3. Has `;base64,` separator
4. Contains valid Base64 encoded data

Invalid logo formats will result in a `400 Bad Request` error.

## Features

### Multi-Currency Support
Items can have different currencies from the invoice currency. The API automatically converts amounts using the provided exchange rates.

### Discount System
- **Item-level discounts:** Each item can have its own discount (percentage or fixed amount)
- **Invoice-level discounts:** Apply discounts to the entire invoice
- **Flexible discount application:** Choose whether invoice discounts apply to already discounted items

### Tax Calculation
Taxes are calculated on the taxable amount (subtotal minus discounts).

### Professional Layout
The generated PDF includes:
- Company branding with logo support
- Clearly formatted line items
- Detailed calculations breakdown
- Professional styling optimized for printing

## Example Usage

### curl

```bash
curl -X POST http://localhost:3000/api/invoices/create \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-001",
    "date": "2025-06-06",
    "dueDate": "2025-07-06",
    "companyName": "Acme Corp",
    "companyDetails": "123 Business St\nNew York, NY 10001",
    "fromName": "John Doe",
    "fromEmail": "john@acme.com",
    "fromAddress": "123 Business St\nNew York, NY 10001",
    "toName": "Jane Smith", 
    "toEmail": "jane@client.com",
    "toAddress": "456 Client Ave\nBoston, MA 02101",
    "items": [
      {
        "id": "1",
        "description": "Consulting Services",
        "quantity": 10,
        "price": 100,
        "currency": "USD",
        "exchangeRate": 1,
        "discountType": "percentage",
        "discountValue": 0
      }
    ],
    "notes": "Payment due within 30 days",
    "taxRate": 8.5,
    "currency": "USD",
    "footer": "Thank you for your business!",
    "discountType": "percentage", 
    "discountValue": 0,
    "applyInvoiceDiscountToDiscountedItems": true
  }' \
  --output invoice.pdf
```

### JavaScript/Node.js

```javascript
const invoiceData = {
  invoiceNumber: "INV-001",
  date: "2025-06-06",
  dueDate: "2025-07-06",
  companyName: "Acme Corp",
  companyDetails: "123 Business St\nNew York, NY 10001",
  fromName: "John Doe",
  fromEmail: "john@acme.com", 
  fromAddress: "123 Business St\nNew York, NY 10001",
  toName: "Jane Smith",
  toEmail: "jane@client.com",
  toAddress: "456 Client Ave\nBoston, MA 02101",
  items: [
    {
      id: "1",
      description: "Consulting Services",
      quantity: 10,
      price: 100,
      currency: "USD",
      exchangeRate: 1,
      discountType: "percentage",
      discountValue: 0
    }
  ],
  notes: "Payment due within 30 days",
  taxRate: 8.5,
  currency: "USD", 
  footer: "Thank you for your business!",
  discountType: "percentage",
  discountValue: 0,
  applyInvoiceDiscountToDiscountedItems: true
};

const response = await fetch('http://localhost:3000/api/invoices/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(invoiceData)
});

if (response.ok) {
  const pdfBlob = await response.blob();
  // Handle the PDF blob (save to file, display, etc.)
} else {
  const error = await response.json();
  console.error('Error:', error);
}
```

### Python

```python
import requests
import json

invoice_data = {
    "invoiceNumber": "INV-001",
    "date": "2025-06-06", 
    "dueDate": "2025-07-06",
    "companyName": "Acme Corp",
    "companyDetails": "123 Business St\nNew York, NY 10001",
    "fromName": "John Doe",
    "fromEmail": "john@acme.com",
    "fromAddress": "123 Business St\nNew York, NY 10001", 
    "toName": "Jane Smith",
    "toEmail": "jane@client.com",
    "toAddress": "456 Client Ave\nBoston, MA 02101",
    "items": [
        {
            "id": "1",
            "description": "Consulting Services",
            "quantity": 10,
            "price": 100,
            "currency": "USD",
            "exchangeRate": 1,
            "discountType": "percentage",
            "discountValue": 0
        }
    ],
    "notes": "Payment due within 30 days",
    "taxRate": 8.5,
    "currency": "USD",
    "footer": "Thank you for your business!",
    "discountType": "percentage",
    "discountValue": 0,
    "applyInvoiceDiscountToDiscountedItems": True
}

response = requests.post(
    'http://localhost:3000/api/invoices/create',
    json=invoice_data,
    headers={'Content-Type': 'application/json'}
)

if response.status_code == 200:
    with open('invoice.pdf', 'wb') as f:
        f.write(response.content)
    print("Invoice PDF saved successfully!")
else:
    print(f"Error: {response.json()}")
```

## Notes

- The API uses Puppeteer for server-side PDF generation, ensuring consistent rendering across different environments
- Base64 encoded images are supported for company logos
- The PDF is optimized for printing with proper margins and formatting
- All calculations (discounts, taxes, totals) are performed server-side for accuracy
- The generated PDF maintains the same professional styling as the web interface