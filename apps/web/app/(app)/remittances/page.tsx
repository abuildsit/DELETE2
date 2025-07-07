"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Calendar, Filter, DollarSign, CheckCircle2 } from "lucide-react"
import { RemittanceUploadDialog } from "@/components/remittance-upload-dialog"
import { RemittanceDetailModal } from "@/components/remittance-detail-modal"

type RemittanceStatus =
  | "Uploaded"
  | "Data Retrieved"
  | "All payments matched - Awaiting Approval"
  | "Error - Payments Unmatched"
  | "Exported to Xero - Unreconciled"
  | "Exported to Xero - Reconciled"
  | "Export Failed"
  | "Soft Deleted"

interface Remittance {
  id: string
  status: RemittanceStatus
  dateAdded: string
  paymentDate: string
  paymentAmount: number
  reference: string
  invoiceCount: number
  customerName: string
  processingTime: string
  lastUpdated: string
}

const mockRemittances: Remittance[] = [
  {
    id: "REM-2024-001",
    status: "All payments matched - Awaiting Approval",
    dateAdded: "2024-01-15",
    paymentDate: "2024-01-14",
    paymentAmount: 15750.0,
    reference: "PAY-ABC-001",
    invoiceCount: 3,
    customerName: "ABC Manufacturing Ltd",
    processingTime: "2.3s",
    lastUpdated: "2024-01-15 14:30",
  },
  {
    id: "REM-2024-002",
    status: "Exported to Xero - Unreconciled",
    dateAdded: "2024-01-14",
    paymentDate: "2024-01-13",
    paymentAmount: 8250.5,
    reference: "PAY-XYZ-002",
    invoiceCount: 2,
    customerName: "XYZ Services Inc",
    processingTime: "1.8s",
    lastUpdated: "2024-01-14 16:45",
  },
  {
    id: "REM-2024-003",
    status: "Error - Payments Unmatched",
    dateAdded: "2024-01-13",
    paymentDate: "2024-01-12",
    paymentAmount: 12300.75,
    reference: "PAY-DEF-003",
    invoiceCount: 4,
    customerName: "DEF Construction",
    processingTime: "Failed",
    lastUpdated: "2024-01-13 09:15",
  },
  {
    id: "REM-2024-004",
    status: "Exported to Xero - Reconciled",
    dateAdded: "2024-01-12",
    paymentDate: "2024-01-11",
    paymentAmount: 5500.0,
    reference: "PAY-GHI-004",
    invoiceCount: 1,
    customerName: "GHI Consulting",
    processingTime: "1.2s",
    lastUpdated: "2024-01-12 11:20",
  },
  {
    id: "REM-2024-005",
    status: "Export Failed",
    dateAdded: "2024-01-11",
    paymentDate: "2024-01-10",
    paymentAmount: 9875.25,
    reference: "PAY-JKL-005",
    invoiceCount: 2,
    customerName: "JKL Enterprises",
    processingTime: "3.1s",
    lastUpdated: "2024-01-11 13:55",
  },
]

const getStatusBadgeVariant = (status: RemittanceStatus) => {
  switch (status) {
    case "All payments matched - Awaiting Approval":
    case "Data Retrieved":
    case "Uploaded":
      return "default"
    case "Exported to Xero - Unreconciled":
    case "Exported to Xero - Reconciled":
      return "secondary"
    case "Export Failed":
      return "destructive"
    case "Error - Payments Unmatched":
      return "outline"
    case "Soft Deleted":
      return "outline"
    default:
      return "default"
  }
}

export default function RemittancesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>("all")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedRemittanceId, setSelectedRemittanceId] = useState<string | null>(null)

  const filteredRemittances = mockRemittances.filter((remittance) => {
    const matchesSearch =
      remittance.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remittance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remittance.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || remittance.status === statusFilter

    // Amount filter logic
    let matchesAmount = true
    const min = minAmount ? Number.parseFloat(minAmount) : null
    const max = maxAmount ? Number.parseFloat(maxAmount) : null
    if (min !== null && remittance.paymentAmount < min) matchesAmount = false
    if (max !== null && remittance.paymentAmount > max) matchesAmount = false

    // Invoice status filter logic
    let matchesInvoiceStatus = true
    if (invoiceStatusFilter !== "all") {
      const invoiceStatus = remittance.invoiceCount > 0 ? "balanced" : "pending"
      matchesInvoiceStatus = invoiceStatusFilter === invoiceStatus
    }

    return matchesSearch && matchesStatus && matchesAmount && matchesInvoiceStatus
  })

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Remittances</h1>
          <p className="text-muted-foreground">Manage and track your remittance reconciliations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Filters Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 flex-wrap gap-y-3">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by reference, ID, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[280px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="All payments matched - Awaiting Approval">Awaiting Approval</SelectItem>
                <SelectItem value="Exported to Xero - Unreconciled">Unreconciled</SelectItem>
                <SelectItem value="Exported to Xero - Reconciled">Reconciled</SelectItem>
                <SelectItem value="Error - Payments Unmatched">Unmatched</SelectItem>
                <SelectItem value="Export Failed">Export Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Amount Range Filter */}
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-20"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-20"
              />
            </div>

            <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Invoice status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoice Status</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr className="text-left">
                  <th className="p-4 font-medium text-sm">Status</th>
                  <th className="p-4 font-medium text-sm">Reference</th>
                  <th className="p-4 font-medium text-sm">Date Added</th>
                  <th className="p-4 font-medium text-sm">Payment Date</th>
                  <th className="p-4 font-medium text-sm">Amount</th>
                  <th className="p-4 font-medium text-sm">Invoices</th>
                  <th className="p-4 font-medium text-sm">Invoice Status</th>
                  <th className="p-4 font-medium text-sm">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredRemittances.map((remittance) => {
                  // Calculate invoice status based on outstanding amounts
                  const invoiceStatus = remittance.invoiceCount > 0 ? "Balanced" : "Pending"
                  const statusColor = invoiceStatus === "Balanced" ? "text-green-600" : "text-orange-600"

                  return (
                    <tr
                      key={remittance.id}
                      className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedRemittanceId(remittance.id)}
                    >
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(remittance.status)} className="text-xs">
                          {remittance.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{remittance.reference}</div>
                      </td>
                      <td className="p-4 text-sm">{new Date(remittance.dateAdded).toLocaleDateString()}</td>
                      <td className="p-4 text-sm">{new Date(remittance.paymentDate).toLocaleDateString()}</td>
                      <td className="p-4 font-medium text-sm">
                        ${remittance.paymentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-sm text-center">
                        <Badge variant="outline" className="text-xs">
                          {remittance.invoiceCount}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        <span className={statusColor}>{invoiceStatus}</span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{remittance.lastUpdated}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredRemittances.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No remittances found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <RemittanceDetailModal
        remittanceId={selectedRemittanceId}
        open={!!selectedRemittanceId}
        onOpenChange={(open) => !open && setSelectedRemittanceId(null)}
      />
      <RemittanceUploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />
    </div>
  )
}
