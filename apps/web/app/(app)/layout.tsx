import type React from "react"
import { TopNavigation } from "@/components/top-navigation"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="pt-16">{children}</main>
    </div>
  )
}
