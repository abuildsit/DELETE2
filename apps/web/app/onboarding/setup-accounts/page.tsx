"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const mockBankAccounts = [
  { id: 1, name: "Main Operating Account", number: "12-3456-1234567-00", balance: 125000.5 },
  { id: 2, name: "Payroll Account", number: "12-3456-7654321-00", balance: 45000.0 },
  { id: 3, name: "Savings Account", number: "12-3456-9876543-00", balance: 200000.0 },
]

export default function SetupAccountsPage() {
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([1, 2])
  const [defaultAccount, setDefaultAccount] = useState<string>("1")
  const router = useRouter()
  const { toast } = useToast()

  const handleAccountToggle = (accountId: number) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
    )
  }

  const handleFinishSetup = () => {
    toast({
      title: "Setup complete",
      description: "Your RemitMatch account is ready to use!",
    })
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Setup Bank Accounts</CardTitle>
          <CardDescription>Select which bank accounts to include in RemitMatch for payment mapping</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Available Bank Accounts</h3>
            {mockBankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={selectedAccounts.includes(account.id)}
                    onCheckedChange={() => handleAccountToggle(account.id)}
                  />
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.number} • Balance: $
                      {account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                {selectedAccounts.includes(account.id) && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>
            ))}
          </div>

          {selectedAccounts.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Default Payment Account</label>
              <Select value={defaultAccount} onValueChange={setDefaultAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default account" />
                </SelectTrigger>
                <SelectContent>
                  {mockBankAccounts
                    .filter((account) => selectedAccounts.includes(account.id))
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This account will be used as the default for payment mapping
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleFinishSetup} disabled={selectedAccounts.length === 0}>
              Finish Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
