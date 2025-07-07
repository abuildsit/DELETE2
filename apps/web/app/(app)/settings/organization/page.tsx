"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, XCircle, Trash2, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockMembers = [
  { id: 1, name: "John Smith", email: "john@acme.com", role: "Owner", status: "Active" },
  { id: 2, name: "Sarah Johnson", email: "sarah@acme.com", role: "Admin", status: "Active" },
  { id: 3, name: "Mike Davis", email: "mike@acme.com", role: "User", status: "Active" },
  { id: 4, name: "Lisa Chen", email: "lisa@acme.com", role: "Auditor", status: "Pending" },
]

const mockBankAccounts = [
  { id: 1, name: "Main Operating Account", number: "****1234", isDefault: true, connected: true },
  { id: 2, name: "Payroll Account", number: "****5678", isDefault: false, connected: true },
  { id: 3, name: "Savings Account", number: "****9012", isDefault: false, connected: false },
]

export default function OrganizationSettingsPage() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("User")
  const { toast } = useToast()

  const handleInviteUser = () => {
    if (!inviteEmail) return

    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${inviteEmail} as ${inviteRole}`,
    })
    setInviteEmail("")
    setInviteRole("User")
  }

  const handleXeroReconnect = () => {
    toast({
      title: "Reconnecting to Xero",
      description: "Redirecting to Xero authentication...",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organisation Settings</h1>
        <p className="text-muted-foreground">Manage your organisation's integrations, members, and preferences</p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xero Integration</CardTitle>
              <CardDescription>Connect your Xero account to sync invoice and payment data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Connected to Xero</p>
                    <p className="text-sm text-muted-foreground">Last synced: 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleXeroReconnect}>
                  Reconnect
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Connected Organisation</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">Acme Corporation</p>
                  <p className="text-sm text-muted-foreground">Organisation ID: 12345</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>Select which bank accounts to include in RemitMatch for payment mapping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Switch checked={account.connected} />
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-muted-foreground">Account: {account.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {account.isDefault && <Badge variant="secondary">Default</Badge>}
                      {account.connected ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <Label htmlFor="default-account">Default Payment Account</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select default account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBankAccounts
                      .filter((acc) => acc.connected)
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.name} ({account.number})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your organisation's team members and their roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invite New Member */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Invite New Member</h4>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Auditor">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleInviteUser}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                </div>
              </div>

              {/* Current Members */}
              <div className="space-y-3">
                <h4 className="font-medium">Current Members</h4>
                {mockMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={member.status === "Active" ? "secondary" : "outline"}>{member.status}</Badge>
                      <Badge variant="outline">{member.role}</Badge>
                      {member.role !== "Owner" && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your RemitMatch subscription and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Business Plan</h3>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">$15/month • Up to 30 remittances per month</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">This Month's Usage</p>
                    <p className="text-2xl font-bold text-blue-600">12 / 30</p>
                  </div>
                  <div>
                    <p className="font-medium">Next Billing Date</p>
                    <p>February 15, 2024</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Available Plans</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium">Pro Plan</h5>
                    <p className="text-2xl font-bold">
                      $30<span className="text-sm font-normal">/month</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">Up to 120 remittances</p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Upgrade
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium">Max Plan</h5>
                    <p className="text-2xl font-bold">
                      $50<span className="text-sm font-normal">/month</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">Up to 250 remittances</p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
