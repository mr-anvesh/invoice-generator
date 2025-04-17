export interface LineItem {
  id: string
  description: string
  quantity: number
  price: number
  currency: string
  exchangeRate: number
  discountType: "percentage" | "amount"
  discountValue: number
}

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  companyName: string
  companyLogo: string
  companyDetails: string
  fromName: string
  fromEmail: string
  fromAddress: string
  toName: string
  toEmail: string
  toAddress: string
  items: LineItem[]
  notes: string
  taxRate: number
  currency: string
  footer: string
  discountType: "percentage" | "amount"
  discountValue: number
  applyInvoiceDiscountToDiscountedItems: boolean
}
