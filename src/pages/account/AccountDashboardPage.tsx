import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Package, MapPin, User, ShoppingBag } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { orderApi } from "../../lib/api"
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../lib/utils"

const accountLinks = [
  { href: "/account/orders", icon: Package, title: "My Orders", desc: "Track and manage your orders" },
  { href: "/account/addresses", icon: MapPin, title: "Addresses", desc: "Manage your saved addresses" },
  { href: "/account/profile", icon: User, title: "Profile", desc: "Update your account info" },
]

export function AccountDashboardPage() {
  const { user } = useAuth()
  const { data } = useQuery({ queryKey: ["my-orders"], queryFn: () => orderApi.getMyOrders({ limit: 3 }) })
  const orders = data?.data?.data || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">My Account</h1>
        <p className="text-muted-foreground">Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {accountLinks.map(({ href, icon: Icon, title, desc }) => (
          <Link key={href} to={href} className="p-5 rounded-2xl border bg-card hover:shadow-md hover:border-primary/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>

      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link to="/account/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {orders.map((order: any) => (
              <Link key={order._id} to={`/account/orders/${order._id}`}
                className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatPrice(order.totalAmount)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
