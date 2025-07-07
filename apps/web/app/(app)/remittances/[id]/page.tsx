"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FileText, Save, Check, RotateCcw, AlertTriangle, Clock, User, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InvoiceMapping {
  id: string
  extractedInvoiceNumber: string
  extractedAmount: number
  extractedReference: string
  matchedInvoiceNumber: string
  totalInvoiceValue: number
  amountOutstanding: number
  manualOverride?: {
    invoiceNumber: string
    amount: number
  }
}

const mockInvoiceMappings: InvoiceMapping[] = [
  {
    id: "1",
    extractedInvoiceNumber: "INV-2024-001",
    extractedAmount: 5250.0,
    extractedReference: "Payment for services",
    matchedInvoiceNumber: "INV-2024-001",
    totalInvoiceValue: 5250.0,
    amountOutstanding: 5250.0,
  },
  {
    id: "2",
    extractedInvoiceNumber: "INV-2024-002",
    extractedAmount: 7500.0,
    extractedReference: "Monthly retainer",
    matchedInvoiceNumber: "INV-2024-002",
    totalInvoiceValue: 7500.0,
    amountOutstanding: 7500.0,
  },
  {
    id: "3",
    extractedInvoiceNumber: "INV-2024-003",
    extractedAmount: 3000.0,
    extractedReference: "Additional work",
    matchedInvoiceNumber: "INV-2024-003",
    totalInvoiceValue: 3000.0,
    amountOutstanding: 3000.0,
  },
]

const availableInvoices = [
  { number: "INV-2024-001", amount: 5250.0 },
  { number: "INV-2024-002", amount: 7500.0 },
  { number: "INV-2024-003", amount: 3000.0 },
  { number: "INV-2024-004", amount: 2100.0 },
  { number: "INV-2024-005", amount: 4800.0 },
]

export default function RemittanceDetailPage({ params }: { params: { id: string } }) {
  const [mappings, setMappings] = useState(mockInvoiceMappings)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  const remittanceData = {
    id: params.id,
    status: "All payments matched - Awaiting Approval",
    paymentDate: "2024-01-14",
    totalAmount: 15750.0,
    reference: "PAY-ABC-001",
    customerName: "ABC Manufacturing Ltd",
    dateAdded: "2024-01-15",
    processingTime: "2.3s",
    pdfUrl: "/placeholder.svg?height=800&width=600",
  }

  const handleManualOverride = (mappingId: string, field: "invoice" | "amount", value: string | number) => {
    setMappings((prev) =>
      prev.map((mapping) => {
        if (mapping.id === mappingId) {
          const override = mapping.manualOverride || {
            invoiceNumber: mapping.matchedInvoiceNumber,
            amount: mapping.extractedAmount,
          }
          return {
            ...mapping,
            manualOverride: {
              ...override,
              [field === "invoice" ? "invoiceNumber" : "amount"]: value,
            },
          }
        }
        return mapping
      }),
    )
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Manual overrides have been applied successfully.",
    })
    setHasChanges(false)
  }

  const handleSaveAndApprove = () => {
    toast({
      title: "Remittance approved",
      description: "The remittance has been approved and will be exported to Xero.",
    })
    setHasChanges(false)
  }

  const totalMappedAmount = mappings.reduce((sum, mapping) => {
    return sum + (mapping.manualOverride?.amount || mapping.extractedAmount)
  }, 0)

  const hasAmountMismatch = Math.abs(totalMappedAmount - remittanceData.totalAmount) > 0.01

  return (
    <div className="p-6 max-w-full">
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/remittances">Remittances</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{remittanceData.reference}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header with Status and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">{remittanceData.reference}</h1>
            <p className="text-muted-foreground">
              {remittanceData.customerName} • {remittanceData.id}
            </p>
          </div>
          <Badge variant="default" className="text-sm px-3 py-1">
            {remittanceData.status}
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleSaveChanges} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button onClick={handleSaveAndApprove} disabled={hasAmountMismatch}>
            <Check className="w-4 h-4 mr-2" />
            Save + Approve
          </Button>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry AI
          </Button>
        </div>
      </div>

      {/* Payment Summary Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Payment Date</p>
                <p className="font-medium">{new Date(remittanceData.paymentDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-muted-foreground">Total Amount</p>
                <p className="font-bold text-lg">
                  ${remittanceData.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-muted-foreground">Mapped Amount</p>
                <p className={`font-medium ${hasAmountMismatch ? "text-orange-600" : "text-green-600"}`}>
                  ${totalMappedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-muted-foreground">Invoices</p>
                <p className="font-medium">{mappings.length} invoices</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Processing Time</p>
                <p className="font-medium text-green-600">{remittanceData.processingTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Date Added</p>
                <p className="font-medium">{new Date(remittanceData.dateAdded).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {hasAmountMismatch && (
            <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mt-4">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">Amount Mismatch Detected</p>
                <p className="text-orange-700">
                  The mapped total (${totalMappedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}) does not
                  match the remittance total ($
                  {remittanceData.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content - PDF and Invoice Mapping Side by Side */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* PDF Viewer - Takes up 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Remittance Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <img
                  src={remittanceData.pdfUrl || "/placeholder.svg"}
                  alt="Remittance PDF"
                  className="w-full h-[700px] object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Mapping - Takes up 3 columns on xl screens */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Mapping & Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr className="text-left text-sm">
                      <th className="p-3 font-medium">Extracted Invoice</th>
                      <th className="p-3 font-medium">Extracted Amount</th>
                      <th className="p-3 font-medium">Match to Invoice</th>
                      <th className="p-3 font-medium">Payment Amount</th>
                      <th className="p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappings.map((mapping) => (
                      <tr key={mapping.id} className="border-b">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-sm">{mapping.extractedInvoiceNumber}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-32">
                              {mapping.extractedReference}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-sm">
                            ${mapping.extractedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                        </td>
                        <td className="p-3">
                          <Select
                            value={mapping.manualOverride?.invoiceNumber || mapping.matchedInvoiceNumber}
                            onValueChange={(value) => handleManualOverride(mapping.id, "invoice", value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableInvoices.map((invoice) => (
                                <SelectItem key={invoice.number} value={invoice.number}>
                                  {invoice.number} ($
                                  {invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={mapping.manualOverride?.amount || mapping.extractedAmount}
                            onChange={(e) =>
                              handleManualOverride(mapping.id, "amount", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="p-3">
                          {mapping.manualOverride ? (
                            <Badge variant="outline" className="text-xs">
                              Manual Override
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Auto Matched
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Row */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Mapped Amount:</span>
                  <span className={`font-bold text-lg ${hasAmountMismatch ? "text-orange-600" : "text-green-600"}`}>
                    ${totalMappedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
