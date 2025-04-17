import type { InvoiceData } from "@/types/invoice"
import { formatCurrency, formatDate } from "@/lib/utils"

interface InvoicePreviewProps {
  invoiceData: InvoiceData
  calculateItemDiscount: (item: (typeof invoiceData.items)[0]) => number
  calculateItemTotal: (item: (typeof invoiceData.items)[0]) => number
  calculateTotalItemDiscounts: () => number
  calculateSubtotal: () => number
  calculateDiscount: () => number
  calculateTaxableAmount: () => number
  calculateTax: () => number
  calculateTotal: () => number
}

export default function InvoicePreview({
  invoiceData,
  calculateItemDiscount,
  calculateItemTotal,
  calculateTotalItemDiscounts,
  calculateSubtotal,
  calculateDiscount,
  calculateTaxableAmount,
  calculateTax,
  calculateTotal,
}: InvoicePreviewProps) {
  return (
    <div className="bg-white text-black p-8 min-h-[29.7cm] w-full">
      <div className="mb-8">
        {/* First row: Logo and Company Details */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            {invoiceData.companyLogo && (
              <div className="h-16 w-16 relative">
                <img
                  src={invoiceData.companyLogo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>
          <div className="text-right">
            {invoiceData.companyName && <p className="font-bold">{invoiceData.companyName}</p>}
            {invoiceData.companyDetails && (
              <p className="text-sm text-black/70 whitespace-pre-line">{invoiceData.companyDetails}</p>
            )}
          </div>
        </div>

        {/* Separator line */}
        <div className="w-full h-px bg-gray-200 my-6"></div>

        {/* Second row: Invoice and Dates */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">INVOICE</h1>
            <p className="text-black/70">#{invoiceData.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p>Date: {formatDate(invoiceData.date)}</p>
            <p>Due Date: {formatDate(invoiceData.dueDate)}</p>
          </div>
        </div>

        {/* Separator line */}
        {/* <div className="w-full h-px bg-gray-200 my-6"></div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">From:</h2>
          <div className="text-black/70">
            <p className="font-semibold">{invoiceData.fromName}</p>
            <p>{invoiceData.fromEmail}</p>
            <p className="whitespace-pre-line">{invoiceData.fromAddress}</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <h2 className="text-lg font-semibold mb-2">To:</h2>
          <div className="text-black/70">
            <p className="font-semibold">{invoiceData.toName}</p>
            <p>{invoiceData.toEmail}</p>
            <p className="whitespace-pre-line">{invoiceData.toAddress}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-right">Quantity</th>
              <th className="py-2 text-right">Price</th>
              {invoiceData.items.some((item) => item.currency !== invoiceData.currency) && (
                <th className="py-2 text-right">Currency</th>
              )}
              <th className="py-2 text-right">Discount</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(item.price, item.currency)}</td>
                {invoiceData.items.some((item) => item.currency !== invoiceData.currency) && (
                  <td className="py-3 text-right">
                    {item.currency}
                    {item.currency !== invoiceData.currency && (
                      <span className="text-xs text-black/50 block">Rate: {item.exchangeRate}</span>
                    )}
                  </td>
                )}
                <td className="py-3 text-right">
                  {item.discountValue > 0 ? (
                    <span className="text-black font-medium">
                      {item.discountType === "percentage"
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue, item.currency)}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 text-right">
                  {item.currency !== invoiceData.currency ? (
                    <>
                      <span className="text-xs text-black/50 block">
                        {formatCurrency(item.quantity * item.price - calculateItemDiscount(item), item.currency)}
                      </span>
                      {formatCurrency(calculateItemTotal(item), invoiceData.currency)}
                    </>
                  ) : (
                    formatCurrency(calculateItemTotal(item), invoiceData.currency)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-full sm:w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(calculateSubtotal(), invoiceData.currency)}</span>
          </div>

          {calculateTotalItemDiscounts() > 0 && (
            <div className="flex justify-between py-2 text-black font-medium">
              <span>Item Discounts:</span>
              <span>-{formatCurrency(calculateTotalItemDiscounts(), invoiceData.currency)}</span>
            </div>
          )}

          {invoiceData.discountValue > 0 && (
            <div className="flex justify-between py-2 text-black font-medium">
              <span>
                Invoice Discount {invoiceData.discountType === "percentage" ? `(${invoiceData.discountValue}%)` : ""}:
                {!invoiceData.applyInvoiceDiscountToDiscountedItems && (
                  <span className="text-xs block text-black/50">(Applied only to non-discounted items)</span>
                )}
              </span>
              <span>-{formatCurrency(calculateDiscount(), invoiceData.currency)}</span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Tax ({invoiceData.taxRate}%):</span>
            <span>{formatCurrency(calculateTax(), invoiceData.currency)}</span>
          </div>

          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal(), invoiceData.currency)}</span>
          </div>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Notes:</h2>
          <p className="text-black/70 whitespace-pre-line">{invoiceData.notes}</p>
        </div>
      )}

      <div className="text-center text-black/50 text-sm mt-16 border-t border-gray-200 pt-4">
        <p className="whitespace-pre-line">{invoiceData.footer}</p>
      </div>
    </div>
  )
}
