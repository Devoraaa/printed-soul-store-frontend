import React, { useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { ShoppingBag, Search, Menu, X, User, Package, LogOut, ChevronDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { AuthModal } from "../ui/AuthModal"
import { SearchModal } from "../ui/SearchModal"
import { CartDrawer } from "../ui/CartDrawer"
import { catalogApi } from "../../lib/api"

export function StoreLayout() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth()
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const navigate = useNavigate()

  // Fetch categories dynamically for navbar
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
    staleTime: 60 * 60 * 1000,
  })

  const categories = (categoriesData?.data?.data || []).filter((c: any) => !c.parentCategory)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthModal />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* Announcement bar */}
      <div className="bg-black text-white text-center text-[11px] py-1.5 px-4 font-medium tracking-wide">
        🚚 Free shipping on orders above ₹499 &nbsp;|&nbsp; 📱 Custom cases for 1000+ devices &nbsp;|&nbsp; ⚡ Same-day dispatch
      </div>

      {/* ─── Main Navbar ───────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="flex h-14 items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tighter">PS</span>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-black text-[15px] tracking-tight text-gray-900">PRINTED SOUL</span>
                <span className="text-[8px] font-bold text-violet-600 tracking-widest uppercase">PREMIUM CASES & DESIGN</span>
              </div>
            </Link>

            {/* ─── Category Nav (desktop) ───────────── */}
            <nav className="hidden lg:flex items-center gap-0 flex-1 overflow-x-auto hide-scrollbar">
              <Link
                to="/"
                className="px-3 py-4 text-[12px] font-semibold text-gray-600 hover:text-black border-b-2 border-transparent hover:border-black transition-all whitespace-nowrap"
              >
                Home
              </Link>
              <Link
                to="/products?sort=new"
                className="px-3 py-4 text-[12px] font-semibold text-gray-600 hover:text-black border-b-2 border-transparent hover:border-black transition-all whitespace-nowrap"
              >
                New Arrivals
              </Link>

              {/* Dynamic categories from DB */}
              {categories.map((cat: any) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug || cat._id}`}
                  className="px-3 py-4 text-[12px] font-semibold text-gray-600 hover:text-black border-b-2 border-transparent hover:border-black transition-all whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}

              <Link
                to="/products"
                className="px-3 py-4 text-[12px] font-semibold text-gray-600 hover:text-black border-b-2 border-transparent hover:border-black transition-all whitespace-nowrap"
              >
                Shop All
              </Link>
            </nav>

            {/* ─── Action Icons ────────────────────── */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all cursor-pointer rounded-sm"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="hidden lg:inline">Search…</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 hover:bg-gray-100 transition-colors group cursor-pointer rounded-sm"
              >
                <ShoppingBag className="h-5 w-5 text-gray-900" strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-1 p-1 hover:bg-gray-100 transition-colors cursor-pointer rounded-sm"
                  >
                    <div className="w-7 h-7 bg-black flex items-center justify-center text-white text-[11px] font-bold">
                      {user?.name[0].toUpperCase()}
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-500 hidden md:block" />
                  </button>
                  {accountOpen && (
                    <div
                      className="absolute right-0 mt-1 w-52 border border-gray-200 bg-white shadow-xl py-1 z-50"
                      onMouseLeave={() => setAccountOpen(false)}
                    >
                      <div className="px-3 py-2 border-b">
                        <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-3.5 w-3.5 text-gray-500" /> My Account
                      </Link>
                      <Link to="/account/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package className="h-3.5 w-3.5 text-gray-500" /> My Orders
                      </Link>
                      <div className="border-t my-1" />
                      <button onClick={() => { logout(); setAccountOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="hidden md:flex items-center justify-center px-4 py-1.5 text-[11px] font-bold tracking-wide bg-black text-white hover:bg-gray-900 active:scale-95 transition-all cursor-pointer"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-white py-3 px-4">
            <nav className="flex flex-col gap-0">
              <Link to="/" onClick={() => setMobileOpen(false)} className="py-2.5 px-2 text-sm font-semibold text-gray-700 border-b border-gray-100 hover:bg-gray-50">Home</Link>
              <Link to="/products?sort=new" onClick={() => setMobileOpen(false)} className="py-2.5 px-2 text-sm font-semibold text-gray-700 border-b border-gray-100 hover:bg-gray-50">New Arrivals</Link>
              {categories.map((cat: any) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug || cat._id}`}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 px-2 text-sm font-semibold text-gray-700 border-b border-gray-100 hover:bg-gray-50"
                >
                  {cat.name}
                </Link>
              ))}
              <Link to="/products" onClick={() => setMobileOpen(false)} className="py-2.5 px-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Shop All</Link>
              {!isAuthenticated && (
                <button onClick={() => { openAuthModal(); setMobileOpen(false) }} className="mt-3 w-full py-2.5 bg-black text-white text-sm font-bold text-center cursor-pointer">
                  Sign In / Register
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Trust Strip */}
      <section className="bg-neutral-50 border-t border-gray-200 py-6">
        <div className="max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🚚", title: "Free Shipping", sub: "On orders above ₹499" },
              { icon: "🛡️", title: "Premium Quality", sub: "Armor grade protection" },
              { icon: "🔒", title: "Secure Payments", sub: "100% safe checkout" },
              { icon: "⭐", title: "Top Rated", sub: "Loved by 10,000+ buyers" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">{item.title}</p>
                  <p className="text-[11px] text-gray-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] text-gray-400 border-t border-neutral-900">
        <div className="max-w-[1700px] mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4 opacity-90 hover:opacity-100">
                <div className="w-7 h-7 bg-white flex items-center justify-center">
                  <span className="text-black font-bold text-xs tracking-tighter">PS</span>
                </div>
                <span className="font-bold text-lg text-white tracking-tight">Printed Soul</span>
              </Link>
              <p className="text-xs leading-relaxed text-gray-500 max-w-sm">
                Premium custom phone cases for every personality and device. Make it yours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-xs text-white uppercase tracking-widest">Shop</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/products?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
                {categories.slice(0, 4).map((cat: any) => (
                  <li key={cat._id}>
                    <Link to={`/products?category=${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-xs text-white uppercase tracking-widest">Support</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="mailto:support@printedsoul.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-xs text-white uppercase tracking-widest">Newsletter</h4>
              <p className="text-[11px] text-gray-500 mb-3">Get exclusive drops & discounts.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="bg-neutral-900 border border-neutral-800 text-white text-xs px-2.5 py-2 w-full focus:outline-none focus:border-gray-600" required />
                <button type="submit" className="bg-white text-black font-bold px-3 py-2 text-xs hover:bg-gray-200 transition-colors cursor-pointer">OK</button>
              </form>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-[11px] gap-4">
            <p>© {new Date().getFullYear()} Printed Soul Store. All rights reserved.</p>
            <div className="flex items-center gap-2 grayscale opacity-60 hover:opacity-100 transition-opacity">
              {["VISA", "MC", "UPI", "RUPAY"].map(m => (
                <div key={m} className="h-5 w-9 bg-white flex items-center justify-center text-[9px] font-black text-black">{m}</div>
              ))}
            </div>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
