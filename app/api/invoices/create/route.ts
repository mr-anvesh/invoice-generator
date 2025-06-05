import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { InvoiceData } from '@/types/invoice'
import { formatCurrency, formatDate } from '@/lib/utils'

// Helper function to validate Base64 image strings
function isValidBase64Image(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  
  // Check if it's a data URL with image mime type
  const dataUrlPattern = /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/i
  if (!dataUrlPattern.test(str)) return false
  
  // Extract the base64 part
  const base64Part = str.split(',')[1]
  if (!base64Part) return false
  
  // Check if it's valid base64
  try {
    // Base64 should only contain A-Z, a-z, 0-9, +, /, and = for padding
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Pattern.test(base64Part)) return false
    
    // Try to decode to verify it's valid base64
    atob(base64Part)
    return true
  } catch {
    return false
  }
}

// Calculation functions (copied from client-side logic)
function calculateItemDiscount(item: InvoiceData['items'][0]): number {
  const itemSubtotal = item.quantity * item.price
  if (item.discountValue <= 0) return 0

  if (item.discountType === "percentage") {
    return itemSubtotal * (item.discountValue / 100)
  } else {
    return Math.min(item.discountValue, itemSubtotal)
  }
}

function calculateItemTotal(item: InvoiceData['items'][0], invoiceCurrency: string): number {
  const itemSubtotal = item.quantity * item.price
  const itemDiscount = calculateItemDiscount(item)
  const itemNetTotal = itemSubtotal - itemDiscount

  return item.currency === invoiceCurrency ? itemNetTotal : itemNetTotal * item.exchangeRate
}

function calculateSubtotal(items: InvoiceData['items'], invoiceCurrency: string): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item, invoiceCurrency), 0)
}

function calculateTotalItemDiscounts(items: InvoiceData['items'], invoiceCurrency: string): number {
  return items.reduce((sum, item) => {
    const itemDiscount = calculateItemDiscount(item)
    return sum + (item.currency === invoiceCurrency ? itemDiscount : itemDiscount * item.exchangeRate)
  }, 0)
}

function calculateDiscount(invoiceData: InvoiceData): number {
  if (invoiceData.discountValue <= 0) return 0

  let discountableAmount = 0

  if (invoiceData.applyInvoiceDiscountToDiscountedItems) {
    discountableAmount = calculateSubtotal(invoiceData.items, invoiceData.currency)
  } else {
    discountableAmount = invoiceData.items.reduce((sum, item) => {
      if (item.discountValue > 0) return sum

      const itemTotal = item.quantity * item.price
      return sum + (item.currency === invoiceData.currency ? itemTotal : itemTotal * item.exchangeRate)
    }, 0)
  }

  if (invoiceData.discountType === "percentage") {
    return discountableAmount * (invoiceData.discountValue / 100)
  } else {
    return Math.min(invoiceData.discountValue, discountableAmount)
  }
}

function calculateTaxableAmount(invoiceData: InvoiceData): number {
  return calculateSubtotal(invoiceData.items, invoiceData.currency) - calculateDiscount(invoiceData)
}

function calculateTax(invoiceData: InvoiceData): number {
  return calculateTaxableAmount(invoiceData) * (invoiceData.taxRate / 100)
}

function calculateTotal(invoiceData: InvoiceData): number {
  return calculateTaxableAmount(invoiceData) + calculateTax(invoiceData)
}

// Generate HTML template for the invoice
function generateInvoiceHTML(invoiceData: InvoiceData): string {
  const subtotal = calculateSubtotal(invoiceData.items, invoiceData.currency)
  const totalItemDiscounts = calculateTotalItemDiscounts(invoiceData.items, invoiceData.currency)
  const discount = calculateDiscount(invoiceData)
  const tax = calculateTax(invoiceData)
  const total = calculateTotal(invoiceData)

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoiceData.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #000;
          background: #fff;
        }
        
        .invoice {
          max-width: 210mm;
          margin: 0 auto;
          padding: 32px;
          min-height: 297mm;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 48px;
        }
        
        .logo-section {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        
        .logo {
          width: 64px;
          height: 64px;
          object-fit: contain;
        }
        
        .company-details {
          text-align: right;
        }
        
        .company-name {
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .company-info {
          font-size: 14px;
          color: #666;
          white-space: pre-line;
        }
        
        .separator {
          width: 100%;
          height: 1px;
          background: #e5e5e5;
          margin: 24px 0;
        }
        
        .invoice-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .invoice-number {
          color: #666;
        }
        
        .dates {
          text-align: right;
        }
        
        .dates p {
          margin-bottom: 4px;
        }
        
        .parties {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }
        
        .party h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .party-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .party-info {
          color: #666;
          white-space: pre-line;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        
        .items-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e5e5e5;
        }
        
        .items-table th:last-child,
        .items-table td:last-child {
          text-align: right;
        }
        
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .currency-info {
          font-size: 12px;
          color: #666;
          display: block;
        }
        
        .discount-info {
          font-weight: 600;
          color: #000;
        }
        
        .totals {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 32px;
        }
        
        .totals-table {
          width: 300px;
        }
        
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        
        .totals-row.border-top {
          border-top: 1px solid #e5e5e5;
          margin-top: 8px;
          padding-top: 16px;
        }
        
        .totals-row.total {
          font-weight: bold;
          font-size: 18px;
        }
        
        .discount-text {
          font-weight: 600;
          color: #000;
        }
        
        .notes {
          margin-bottom: 32px;
        }
        
        .notes h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .notes-content {
          color: #666;
          white-space: pre-line;
        }
        
        .footer {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-top: 64px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
        }
        
        @media print {
          .invoice {
            padding: 0;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="logo-section">
            ${invoiceData.companyLogo ? `<img src="${invoiceData.companyLogo}" alt="Company Logo" class="logo" />` : ''}
          </div>
          <div class="company-details">
            ${invoiceData.companyName ? `<div class="company-name">${invoiceData.companyName}</div>` : ''}
            ${invoiceData.companyDetails ? `<div class="company-info">${invoiceData.companyDetails}</div>` : ''}
          </div>
        </div>
        
        <div class="separator"></div>
        
        <div class="invoice-info">
          <div>
            <h1 class="invoice-title">INVOICE</h1>
            <p class="invoice-number">#${invoiceData.invoiceNumber}</p>
          </div>
          <div class="dates">
            <p>Date: ${formatDate(invoiceData.date)}</p>
            <p>Due Date: ${formatDate(invoiceData.dueDate)}</p>
          </div>
        </div>
        
        <div class="parties">
          <div class="party">
            <h3>From:</h3>
            <div class="party-name">${invoiceData.fromName}</div>
            <div class="party-info">${invoiceData.fromEmail}</div>
            <div class="party-info">${invoiceData.fromAddress}</div>
          </div>
          <div class="party">
            <h3>To:</h3>
            <div class="party-name">${invoiceData.toName}</div>
            <div class="party-info">${invoiceData.toEmail}</div>
            <div class="party-info">${invoiceData.toAddress}</div>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              ${invoiceData.items.some(item => item.currency !== invoiceData.currency) ? '<th>Currency</th>' : ''}
              <th>Discount</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">${formatCurrency(item.price, item.currency)}</td>
                ${invoiceData.items.some(i => i.currency !== invoiceData.currency) ? `
                  <td style="text-align: right;">
                    ${item.currency}
                    ${item.currency !== invoiceData.currency ? `<span class="currency-info">Rate: ${item.exchangeRate}</span>` : ''}
                  </td>
                ` : ''}
                <td style="text-align: right;">
                  ${item.discountValue > 0 ? `
                    <span class="discount-info">
                      ${item.discountType === "percentage" 
                        ? `${item.discountValue}%` 
                        : formatCurrency(item.discountValue, item.currency)}
                    </span>
                  ` : '-'}
                </td>
                <td style="text-align: right;">
                  ${item.currency !== invoiceData.currency ? `
                    <span class="currency-info">
                      ${formatCurrency(item.quantity * item.price - calculateItemDiscount(item), item.currency)}
                    </span><br>
                  ` : ''}
                  ${formatCurrency(calculateItemTotal(item, invoiceData.currency), invoiceData.currency)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="totals-table">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(subtotal, invoiceData.currency)}</span>
            </div>
            
            ${totalItemDiscounts > 0 ? `
              <div class="totals-row">
                <span class="discount-text">Item Discounts:</span>
                <span>-${formatCurrency(totalItemDiscounts, invoiceData.currency)}</span>
              </div>
            ` : ''}
            
            ${invoiceData.discountValue > 0 ? `
              <div class="totals-row">
                <span class="discount-text">
                  Invoice Discount ${invoiceData.discountType === "percentage" ? `(${invoiceData.discountValue}%)` : ''}:
                  ${!invoiceData.applyInvoiceDiscountToDiscountedItems ? 
                    '<br><span style="font-size: 12px; color: #666;">(Applied only to non-discounted items)</span>' : ''}
                </span>
                <span>-${formatCurrency(discount, invoiceData.currency)}</span>
              </div>
            ` : ''}
            
            <div class="totals-row">
              <span>Tax (${invoiceData.taxRate}%):</span>
              <span>${formatCurrency(tax, invoiceData.currency)}</span>
            </div>
            
            <div class="totals-row border-top total">
              <span>Total:</span>
              <span>${formatCurrency(total, invoiceData.currency)}</span>
            </div>
          </div>
        </div>
        
        ${invoiceData.notes ? `
          <div class="notes">
            <h3>Notes:</h3>
            <div class="notes-content">${invoiceData.notes}</div>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>${invoiceData.footer}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const invoiceData: InvoiceData = await request.json()
    
    // Validate required fields
    if (!invoiceData.invoiceNumber) {
      return NextResponse.json({ error: 'Invoice number is required' }, { status: 400 })
    }
    
    if (!invoiceData.items || invoiceData.items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }

    // Validate company logo if provided - must be Base64 image
    if (invoiceData.companyLogo && !isValidBase64Image(invoiceData.companyLogo)) {
      return NextResponse.json({ 
        error: 'Company logo must be a valid Base64 encoded image (data:image/[type];base64,[data])' 
      }, { status: 400 })
    }

    // Generate HTML
    const html = generateInvoiceHTML(invoiceData)
    
    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    })
    
    await browser.close()
    
    // Return PDF as response
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`
      }
    })
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' }, 
      { status: 500 }
    )
  }
}
