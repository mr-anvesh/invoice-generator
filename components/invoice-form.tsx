"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus } from "lucide-react"
import type { InvoiceData } from "@/types/invoice"
import { formatCurrency, currencies } from "@/lib/utils"

interface InvoiceFormProps {
  invoiceData: InvoiceData
  handleInvoiceChange: (field: string, value: string | number | boolean) => void
  handleItemChange: (id: string, field: string, value: string | number) => void
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  addItem: () => void
  removeItem: (id: string) => void
  calculateItemDiscount: (item: (typeof invoiceData.items)[0]) => number
  calculateItemTotal: (item: (typeof invoiceData.items)[0]) => number
  calculateTotalItemDiscounts: () => number
  calculateSubtotal: () => number
  calculateDiscount: () => number
  calculateTaxableAmount: () => number
  calculateTax: () => number
  calculateTotal: () => number
}

export default function InvoiceForm({
  invoiceData,
  handleInvoiceChange,
  handleItemChange,
  handleLogoUpload,
  addItem,
  removeItem,
  calculateItemDiscount,
  calculateItemTotal,
  calculateTotalItemDiscounts,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTaxableAmount,
  calculateTotal,
}: InvoiceFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => handleInvoiceChange("invoiceNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => handleInvoiceChange("date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => handleInvoiceChange("dueDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currency">Invoice Currency</Label>
                <Select value={invoiceData.currency} onValueChange={(value) => handleInvoiceChange("currency", value)}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  value={invoiceData.taxRate}
                  onChange={(e) => handleInvoiceChange("taxRate", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Invoice Discount</Label>
                <div className="space-y-4 mt-2">
                  <RadioGroup
                    value={invoiceData.discountType}
                    onValueChange={(value) => handleInvoiceChange("discountType", value as "percentage" | "amount")}
                    className="flex items-center gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage" className="cursor-pointer">
                        Percentage (%)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="amount" id="amount" />
                      <Label htmlFor="amount" className="cursor-pointer">
                        Amount
                      </Label>
                    </div>
                  </RadioGroup>
                  <Input
                    type="number"
                    min="0"
                    step={invoiceData.discountType === "percentage" ? "0.01" : "0.01"}
                    value={invoiceData.discountValue}
                    onChange={(e) => handleInvoiceChange("discountValue", Number.parseFloat(e.target.value) || 0)}
                    placeholder={invoiceData.discountType === "percentage" ? "%" : invoiceData.currency}
                    className="w-full"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="applyInvoiceDiscountToDiscountedItems"
                      checked={invoiceData.applyInvoiceDiscountToDiscountedItems}
                      onCheckedChange={(checked) =>
                        handleInvoiceChange("applyInvoiceDiscountToDiscountedItems", checked === true)
                      }
                    />
                    <Label htmlFor="applyInvoiceDiscountToDiscountedItems" className="text-sm cursor-pointer">
                      Apply invoice discount to already discounted items
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={invoiceData.companyName}
                    onChange={(e) => handleInvoiceChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyLogo">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-1"
                    />
                    {invoiceData.companyLogo && (
                      <div className="h-12 w-12 relative">
                        <img
                          src={invoiceData.companyLogo || "/placeholder.svg"}
                          alt="Company Logo"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="companyDetails">Company Details</Label>
                  <Textarea
                    id="companyDetails"
                    value={invoiceData.companyDetails}
                    onChange={(e) => handleInvoiceChange("companyDetails", e.target.value)}
                    placeholder="Registration number, VAT ID, etc."
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">From</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fromName">Name</Label>
                  <Input
                    id="fromName"
                    value={invoiceData.fromName}
                    onChange={(e) => handleInvoiceChange("fromName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={invoiceData.fromEmail}
                    onChange={(e) => handleInvoiceChange("fromEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromAddress">Address</Label>
                  <Textarea
                    id="fromAddress"
                    value={invoiceData.fromAddress}
                    onChange={(e) => handleInvoiceChange("fromAddress", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">To</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="toName">Name</Label>
              <Input
                id="toName"
                value={invoiceData.toName}
                onChange={(e) => handleInvoiceChange("toName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="toEmail">Email</Label>
              <Input
                id="toEmail"
                type="email"
                value={invoiceData.toEmail}
                onChange={(e) => handleInvoiceChange("toEmail", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="toAddress">Address</Label>
              <Textarea
                id="toAddress"
                value={invoiceData.toAddress}
                onChange={(e) => handleInvoiceChange("toAddress", e.target.value)}
              />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <div className="space-y-6">
          {invoiceData.items.map((item) => (
            <div key={item.id} className="border rounded-md p-4">
              <div className="mb-4">
                <Label htmlFor={`description-${item.id}`}>Description</Label>
                <Input
                  id={`description-${item.id}`}
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-2">
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Label htmlFor={`price-${item.id}`}>Price</Label>
                  <Input
                    id={`price-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Label htmlFor={`currency-${item.id}`}>Currency</Label>
                  <Select value={item.currency} onValueChange={(value) => handleItemChange(item.id, "currency", value)}>
                    <SelectTrigger id={`currency-${item.id}`}>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {item.currency !== invoiceData.currency && (
                  <div className="sm:col-span-3">
                    <Label htmlFor={`exchangeRate-${item.id}`} className="flex items-center gap-1">
                      Exchange Rate
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        (1 {item.currency} = ? {invoiceData.currency})
                      </span>
                    </Label>
                    <Input
                      id={`exchangeRate-${item.id}`}
                      type="number"
                      min="0.000001"
                      step="0.000001"
                      value={item.exchangeRate}
                      onChange={(e) =>
                        handleItemChange(item.id, "exchangeRate", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                )}
                <div className="sm:col-span-1 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={invoiceData.items.length <= 1}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <Label>Item Discount</Label>
                <div className="mt-2">
                  <RadioGroup
                    value={item.discountType}
                    onValueChange={(value) =>
                      handleItemChange(item.id, "discountType", value as "percentage" | "amount")
                    }
                    className="flex items-center gap-4 mb-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id={`percentage-${item.id}`} />
                      <Label htmlFor={`percentage-${item.id}`} className="cursor-pointer">
                        Percentage (%)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="amount" id={`amount-${item.id}`} />
                      <Label htmlFor={`amount-${item.id}`} className="cursor-pointer">
                        Amount
                      </Label>
                    </div>
                  </RadioGroup>
                  <Input
                    type="number"
                    min="0"
                    step={item.discountType === "percentage" ? "0.01" : "0.01"}
                    value={item.discountValue}
                    onChange={(e) => handleItemChange(item.id, "discountValue", Number.parseFloat(e.target.value) || 0)}
                    placeholder={item.discountType === "percentage" ? "%" : item.currency}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-right text-sm text-muted-foreground self-end">
                  {item.currency !== invoiceData.currency ? (
                    <>
                      {item.quantity} × {formatCurrency(item.price, item.currency)} ={" "}
                      {formatCurrency(item.quantity * item.price, item.currency)}
                      {item.discountValue > 0 && (
                        <>
                          <br />
                          <span className="text-black font-medium">
                            Discount: -{formatCurrency(calculateItemDiscount(item), item.currency)}
                          </span>
                        </>
                      )}
                      <br />
                      <span className="font-medium text-foreground">
                        {formatCurrency(calculateItemTotal(item), invoiceData.currency)}
                      </span>
                    </>
                  ) : (
                    <>
                      {item.quantity} × {formatCurrency(item.price, item.currency)} ={" "}
                      {formatCurrency(item.quantity * item.price, item.currency)}
                      {item.discountValue > 0 && (
                        <>
                          <br />
                          <span className="text-black font-medium">
                            Discount: -{formatCurrency(calculateItemDiscount(item), item.currency)}
                          </span>
                        </>
                      )}
                      <br />
                      <span className="font-medium text-foreground">
                        {formatCurrency(calculateItemTotal(item), invoiceData.currency)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addItem} className="flex items-center mt-4">
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>

          <div className="mt-6 border-t pt-4">
            <div className="flex flex-col gap-2 sm:w-72 ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="min-w-[100px] text-right">
                  {formatCurrency(calculateSubtotal(), invoiceData.currency)}
                </span>
              </div>

              {calculateTotalItemDiscounts() > 0 && (
                <div className="flex justify-between text-black font-medium">
                  <span>Item Discounts:</span>
                  <span className="min-w-[100px] text-right">
                    -{formatCurrency(calculateTotalItemDiscounts(), invoiceData.currency)}
                  </span>
                </div>
              )}

              {invoiceData.discountValue > 0 && (
                <div className="flex justify-between text-black font-medium">
                  <span>
                    Invoice Discount{" "}
                    {invoiceData.discountType === "percentage" ? `(${invoiceData.discountValue}%)` : ""}:
                    {!invoiceData.applyInvoiceDiscountToDiscountedItems && (
                      <span className="text-xs block text-muted-foreground">
                        (Applied only to non-discounted items)
                      </span>
                    )}
                  </span>
                  <span className="min-w-[100px] text-right">
                    -{formatCurrency(calculateDiscount(), invoiceData.currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax ({invoiceData.taxRate}%):</span>
                <span className="min-w-[100px] text-right">{formatCurrency(calculateTax(), invoiceData.currency)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span className="min-w-[100px] text-right">
                  {formatCurrency(calculateTotal(), invoiceData.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={invoiceData.notes}
            onChange={(e) => handleInvoiceChange("notes", e.target.value)}
            placeholder="Payment terms, bank details, etc."
          />
        </div>

        <div className="mt-6">
          <Label htmlFor="footer">Invoice Footer</Label>
          <Textarea
            id="footer"
            value={invoiceData.footer}
            onChange={(e) => handleInvoiceChange("footer", e.target.value)}
            placeholder="Company information, website, thank you message, etc."
          />
        </div>
      </CardContent>
    </Card>
  )
}
