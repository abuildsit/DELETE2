"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function ConnectXeroPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleConnectXero = () => {
    setIsConnecting(true)

    // Simulate Xero connection
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      toast({
        title: "Connected to Xero",
        description: "Successfully connected to Acme Corporation in Xero",
      })
    }, 2000)
  }

  const handleContinue = () => {
    router.push("/onboarding/setup-accounts")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Connect to Xero</CardTitle>
          <CardDescription>Connect your Xero account to sync invoice and payment data with RemitMatch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">What happens when you connect?</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Access to your invoice data for matching</li>
                    <li>• Automatic payment export to Xero</li>
                    <li>• Real-time reconciliation status</li>
                    <li>• Secure, read-only access to necessary data</li>
                  </ul>
                </div>
              </div>

              <Button className="w-full" onClick={handleConnectXero} disabled={isConnecting}>
                {isConnecting ? "Connecting..." : "Connect to Xero"}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">Successfully Connected!</h3>
                  <p className="text-muted-foreground">
                    Connected to <strong>Acme Corporation</strong> in Xero
                  </p>
                </div>
              </div>

              <Button className="w-full" onClick={handleContinue}>
                Continue Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
