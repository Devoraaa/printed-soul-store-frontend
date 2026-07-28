import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"

// Layouts
import { StoreLayout } from "./components/layouts/StoreLayout"
import { AuthLayout } from "./components/layouts/AuthLayout"

// Store Pages
import { HomePage } from "./pages/store/HomePage"
import { ProductsPage } from "./pages/store/ProductsPage"
import { ProductDetailPage } from "./pages/store/ProductDetailPage"
import { CategoryPage } from "./pages/store/CategoryPage"
import { PhoneCoversHubPage } from "./pages/store/PhoneCoversHubPage"
import { CartPage } from "./pages/store/CartPage"
import { CheckoutPage } from "./pages/store/CheckoutPage"
import { OrderSuccessPage } from "./pages/store/OrderSuccessPage"
import { OrderTrackingPage } from "./pages/store/OrderTrackingPage"

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage"
import { RegisterPage } from "./pages/auth/RegisterPage"
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage"

// Account Pages
import { AccountDashboardPage } from "./pages/account/AccountDashboardPage"
import { OrdersPage } from "./pages/account/OrdersPage"
import { OrderDetailPage } from "./pages/account/OrderDetailPage"
import { AddressesPage } from "./pages/account/AddressesPage"
import { ProfilePage } from "./pages/account/ProfilePage"

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
})

// Protected route wrapper
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Store */}
              <Route path="/" element={<StoreLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:slug" element={<ProductDetailPage />} />
                <Route path="phone-covers" element={<PhoneCoversHubPage />} />
                <Route path="categories/:slug" element={<CategoryPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="track" element={<OrderTrackingPage />} />
                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
              </Route>

              {/* Auth */}
              <Route element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Account */}
              <Route path="account" element={<ProtectedRoute><StoreLayout /></ProtectedRoute>}>
                <Route index element={<AccountDashboardPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
