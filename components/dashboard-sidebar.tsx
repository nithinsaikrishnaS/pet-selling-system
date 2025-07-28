"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboardIcon, PawPrintIcon, ShoppingBagIcon, SettingsIcon, HomeIcon, PlusIcon } from "lucide-react"
import Link from "next/link"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboardIcon,
    },
    {
      id: "listings",
      label: "My Listings",
      icon: PawPrintIcon,
    },
    {
      id: "purchases",
      label: "My Purchases",
      icon: ShoppingBagIcon,
    },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-fur-gray/20 shadow-sm">
      <div className="p-6">
        <div className="space-y-2">
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-fur-gray uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                asChild
                className="w-full justify-start bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-lg"
              >
                <Link href="/sell">
                  <PlusIcon className="h-4 w-4 mr-3" />
                  List New Pet
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-sky-blue-collar text-sky-blue-collar hover:bg-sky-blue-collar hover:text-cream-white rounded-lg bg-transparent"
              >
                <Link href="/pets">
                  <HomeIcon className="h-4 w-4 mr-3" />
                  Browse Pets
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div>
            <h3 className="text-sm font-semibold text-fur-gray uppercase tracking-wider mb-3">Dashboard</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-paw-brown text-cream-white shadow-md"
                        : "text-dark-nose-black hover:bg-paw-brown/10 hover:text-paw-brown"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  )
}
