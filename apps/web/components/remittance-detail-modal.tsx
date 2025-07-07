"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Save, Check, RotateCcw, Calendar, User, Plus, Minus, Edit2, RefreshCw, X, Undo2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InvoiceMapping {
  id: string
  extractedInvoiceNumber: string
  paymentAmount: number
  matchedInvoiceNumber: string
  invoiceTotal: number
  isEditing?: boolean
}

interface RemittanceDetailModalProps {
  remittanceId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockInvoiceMappings: InvoiceMapping[] = [
  {
    id: "1",
    extractedInvoiceNumber: "INV-2024-001",
    paymentAmount: 5250.0,
    matchedInvoiceNumber: "INV-2024-001",
    invoiceTotal: 5250.0,
  },
  {
    id: "2",
    extractedInvoiceNumber: "INV-2024-002",
    paymentAmount: 7500.0,
    matchedInvoiceNumber: "INV-2024-002",
    invoiceTotal: 7500.0,
  },
  {
    id: "3",
    extractedInvoiceNumber: "INV-2024-003",
    paymentAmount: 3000.0,
    matchedInvoiceNumber: "INV-2024-003",
    invoiceTotal: 3000.0,
  },
]

const availableInvoices = [
  { number: "INV-2024-001", total: 5250.0, outstanding: 5250.0 },
  { number: "INV-2024-002", total: 7500.0, outstanding: 7500.0 },
  { number: "INV-2024-003", total: 3000.0, outstanding: 3000.0 },
  { number: "INV-2024-004", total: 2100.0, outstanding: 2100.0 },
  { number: "INV-2024-005", total: 4800.0, outstanding: 4800.0 },
]

export function RemittanceDetailModal({ remittanceId, open, onOpenChange }: RemittanceDetailModalProps) {
  const [mappings, setMappings] = useState<InvoiceMapping[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showDeleteRemittanceDialog, setShowDeleteRemittanceDialog] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isEditingReference, setIsEditingReference] = useState(false)
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [paymentReference, setPaymentReference] = useState("PAY-ABC-001")
  const [paymentDate, setPaymentDate] = useState("2024-01-14")
  const [remittanceStatus, setRemittanceStatus] = useState("All payments matched - Awaiting Approval")
  const { toast } = useToast()

  // Load data when modal opens
  useEffect(() => {
    if (open && remittanceId) {
      setMappings(mockInvoiceMappings)
      setHasChanges(false)
      setPaymentReference("PAY-ABC-001")
      setPaymentDate("2024-01-14")
      // Simulate different statuses based on ID for demo
      if (remittanceId === "REM-2024-002") {
        setRemittanceStatus("Exported to Xero - Reconciled")
      } else {
        setRemittanceStatus("All payments matched - Awaiting Approval")
      }
    }
  }, [open, remittanceId])

  if (!remittanceId) return null

  const remittanceData = {
    id: remittanceId,
    status: remittanceStatus,
    paymentDate: paymentDate,
    reference: paymentReference,
    customerName: "ABC Manufacturing Ltd",
    dateAdded: "2024-01-15",
    pdfUrl: "/placeholder.svg?height=800&width=600",
  }

  const totalAmount = mappings.reduce((sum, mapping) => sum + mapping.paymentAmount, 0)
  const isApproved = remittanceStatus.includes("Exported to Xero")
  const canDelete = !isApproved
  const canUnapprove = isApproved

  const handleAddRow = () => {
    const newMapping: InvoiceMapping = {
      id: Date.now().toString(),
      extractedInvoiceNumber: "",
      paymentAmount: 0,
      matchedInvoiceNumber: "",
      invoiceTotal: 0,
    }
    setMappings([...mappings, newMapping])
    setHasChanges(true)
  }

  const handleDeleteRow = (id: string) => {
    const mapping = mappings.find((m) => m.id === id)
    const isEmpty = !mapping?.extractedInvoiceNumber && !mapping?.matchedInvoiceNumber && mapping?.paymentAmount === 0

    if (isEmpty) {
      // Delete immediately if row is empty
      setMappings(mappings.filter((m) => m.id !== id))
      setHasChanges(true)
    } else {
      // Show confirmation for non-empty rows
      setDeleteConfirmId(id)
    }
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setMappings(mappings.filter((m) => m.id !== deleteConfirmId))
      setHasChanges(true)
      setDeleteConfirmId(null)
    }
  }

  const handleFieldChange = (id: string, field: keyof InvoiceMapping, value: string | number) => {
    setMappings((prev) =>
      prev.map((mapping) => {
        if (mapping.id === id) {
          const updated = { ...mapping, [field]: value }

          // Auto-populate invoice total when invoice is selected
          if (field === "matchedInvoiceNumber") {
            const selectedInvoice = availableInvoices.find((inv) => inv.number === value)
            if (selectedInvoice) {
              updated.invoiceTotal = selectedInvoice.total
            }
          }

          return updated
        }
        return mapping
      }),
    )
    setHasChanges(true)
  }

  const toggleEdit = (id: string) => {
    setMappings((prev) =>
      prev.map((mapping) => (mapping.id === id ? { ...mapping, isEditing: !mapping.isEditing } : mapping)),
    )
  }

  const handleReferenceEdit = () => {
    setIsEditingReference(true)
  }

  const handleDateEdit = () => {
    setIsEditingDate(true)
  }

  const handleReferenceChange = (value: string) => {
    setPaymentReference(value)
    setHasChanges(true)
  }

  const handleDateChange = (value: string) => {
    setPaymentDate(value)
    setHasChanges(true)
  }

  const calculateOutstanding = (invoiceTotal: number, paymentAmount: number) => {
    return invoiceTotal - paymentAmount
  }

  const getOutstandingBadgeColor = (outstanding: number) => {
    if (outstanding === 0) return "bg-green-100 text-green-800 border-green-200"
    if (outstanding > 0) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-orange-100 text-orange-800 border-orange-200"
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Data refreshed",
        description: "Remittance data has been updated with the latest information.",
      })
    }, 1000)
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
    setRemittanceStatus("Exported to Xero - Unreconciled")
    setHasChanges(false)
  }

  const handleUnapprove = () => {
    toast({
      title: "Remittance unapproved",
      description: "The remittance has been unapproved and can now be edited.",
    })
    setRemittanceStatus("All payments matched - Awaiting Approval")
    setHasChanges(true)
  }

  const handleDeleteRemittance = () => {
    toast({
      title: "Remittance deleted",
      description: "The remittance has been deleted successfully.",
    })
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-xl font-bold">{remittanceData.reference}</h2>
                </div>
                <Badge variant="default" className="px-3 py-1">
                  {remittanceData.status}
                </Badge>
              </div>

              <div className="flex items-center space-x-3 mr-8">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry AI
                </Button>
                {!isApproved && (
                  <Button variant="outline" onClick={handleSaveChanges} disabled={!hasChanges}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
                {canUnapprove && (
                  <Button variant="outline" onClick={handleUnapprove}>
                    <Undo2 className="w-4 h-4 mr-2" />
                    Unapprove
                  </Button>
                )}
                {!isApproved && (
                  <Button onClick={handleSaveAndApprove}>
                    <Check className="w-4 h-4 mr-2" />
                    {hasChanges ? "Save + Approve" : "Approve"}
                  </Button>
                )}
                {canDelete && (
                  <Button variant="destructive" onClick={() => setShowDeleteRemittanceDialog(true)}>
                    <X className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            </div>

            {/* Summary Bar */}
            <div className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Payment Date</p>
                    <div className="flex items-center space-x-2">
                      {isEditingDate && !isApproved ? (
                        <Input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          onBlur={() => setIsEditingDate(false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setIsEditingDate(false)
                            }
                          }}
                          className="font-medium h-8"
                          autoFocus
                        />
                      ) : (
                        <>
                          <p
                            className={`font-medium ${!isApproved ? "cursor-pointer" : ""}`}
                            onClick={!isApproved ? handleDateEdit : undefined}
                          >
                            {new Date(paymentDate).toLocaleDateString()}
                          </p>
                          {!isApproved && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDateEdit}>
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Reference</p>
                  <div className="flex items-center space-x-2">
                    {isEditingReference && !isApproved ? (
                      <Input
                        value={paymentReference}
                        onChange={(e) => handleReferenceChange(e.target.value)}
                        onBlur={() => setIsEditingReference(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setIsEditingReference(false)
                          }
                        }}
                        className="font-medium h-8"
                        autoFocus
                      />
                    ) : (
                      <>
                        <p
                          className={`font-medium ${!isApproved ? "cursor-pointer" : ""}`}
                          onClick={!isApproved ? handleReferenceEdit : undefined}
                        >
                          {paymentReference}
                        </p>
                        {!isApproved && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleReferenceEdit}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-lg text-blue-600">
                    ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Invoices</p>
                  <p className="font-medium">{mappings.length} invoices</p>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Date Added</p>
                    <p className="font-medium">{new Date(remittanceData.dateAdded).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-5 gap-6 h-full p-6">
                {/* PDF Viewer */}
                <div className="col-span-2">
                  <Card className="h-full">
                    <CardContent className="p-4 h-full">
                      <div className="border rounded-lg overflow-hidden bg-gray-50 h-full">
                        <img
                          src={remittanceData.pdfUrl || "/placeholder.svg"}
                          alt="Remittance PDF"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Invoice Mapping */}
                <div className="col-span-3">
                  <Card className="h-full">
                    <CardContent className="p-4 h-full overflow-auto">
                      <div className="space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="border-b bg-gray-50 sticky top-0">
                              <tr className="text-left text-sm">
                                <th className="p-3 font-medium">Extracted Invoice</th>
                                <th className="p-3 font-medium">Payment Amount</th>
                                <th className="p-3 font-medium">Match to Invoice</th>
                                <th className="p-3 font-medium">Invoice Total</th>
                                <th className="p-3 font-medium">Outstanding</th>
                                {!isApproved && <th className="p-3 font-medium w-12"></th>}
                              </tr>
                            </thead>
                            <tbody>
                              {mappings.map((mapping) => {
                                const outstanding = calculateOutstanding(mapping.invoiceTotal, mapping.paymentAmount)
                                return (
                                  <tr key={mapping.id} className="border-b">
                                    <td className="p-3">
                                      <Input
                                        value={mapping.extractedInvoiceNumber}
                                        onChange={(e) =>
                                          handleFieldChange(mapping.id, "extractedInvoiceNumber", e.target.value)
                                        }
                                        placeholder="Enter invoice number"
                                        className="w-full"
                                        disabled={isApproved}
                                      />
                                    </td>
                                    <td className="p-3">
                                      <div className="flex items-center space-x-2">
                                        {mapping.isEditing && !isApproved ? (
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                              $
                                            </span>
                                            <Input
                                              type="number"
                                              step="0.01"
                                              value={mapping.paymentAmount.toFixed(2)}
                                              onChange={(e) =>
                                                handleFieldChange(
                                                  mapping.id,
                                                  "paymentAmount",
                                                  Number.parseFloat(e.target.value) || 0,
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  toggleEdit(mapping.id)
                                                }
                                              }}
                                              className="w-full pl-6"
                                              onBlur={() => toggleEdit(mapping.id)}
                                              autoFocus
                                            />
                                          </div>
                                        ) : (
                                          <>
                                            <span className="font-medium">
                                              $
                                              {mapping.paymentAmount.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                              })}
                                            </span>
                                            {!isApproved && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleEdit(mapping.id)}
                                                className="h-6 w-6 p-0"
                                              >
                                                <Edit2 className="w-3 h-3" />
                                              </Button>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <Select
                                        value={mapping.matchedInvoiceNumber}
                                        onValueChange={(value) =>
                                          handleFieldChange(mapping.id, "matchedInvoiceNumber", value)
                                        }
                                        disabled={isApproved}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select invoice" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableInvoices.map((invoice) => (
                                            <SelectItem key={invoice.number} value={invoice.number}>
                                              {invoice.number} ($
                                              {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </td>
                                    <td className="p-3">
                                      <span className="font-medium">
                                        ${mapping.invoiceTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <Badge className={`${getOutstandingBadgeColor(outstanding)} border`}>
                                        ${Math.abs(outstanding).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        {outstanding < 0 ? " CR" : ""}
                                      </Badge>
                                    </td>
                                    {!isApproved && (
                                      <td className="p-3">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteRow(mapping.id)}
                                          className="h-8 w-8 p-0 hover:bg-red-50"
                                        >
                                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                            <Minus className="w-3 h-3 text-white" />
                                          </div>
                                        </Button>
                                      </td>
                                    )}
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Add Row Button */}
                        {!isApproved && (
                          <div className="flex justify-center pt-4">
                            <Button variant="outline" onClick={handleAddRow} className="bg-transparent">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Row
                            </Button>
                          </div>
                        )}

                        {/* Summary */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Payment Amount:</span>
                            <span className="font-bold text-lg text-blue-600">
                              ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* History Section */}
                        <div className="mt-6">
                          <h4 className="font-medium text-sm text-muted-foreground mb-3">History</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <span className="font-medium">Manual Override Applied</span>
                                <span className="text-muted-foreground ml-2">
                                  by Sarah Johnson - Payment amount adjusted
                                </span>
                              </div>
                              <span className="text-muted-foreground">Jan 15, 2024 3:15 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <span className="font-medium">AI Processing Completed</span>
                                <span className="text-muted-foreground ml-2">3 invoices matched</span>
                              </div>
                              <span className="text-muted-foreground">Jan 15, 2024 2:32 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <div>
                                <span className="font-medium">Uploaded</span>
                                <span className="text-muted-foreground ml-2">by John Smith</span>
                              </div>
                              <span className="text-muted-foreground">Jan 15, 2024 2:30 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Row Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Row</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice mapping? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Remittance Confirmation Dialog */}
      <AlertDialog open={showDeleteRemittanceDialog} onOpenChange={setShowDeleteRemittanceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Remittance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this remittance? This action cannot be undone and will permanently remove
              all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRemittance} className="bg-red-600 hover:bg-red-700">
              Delete Remittance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
