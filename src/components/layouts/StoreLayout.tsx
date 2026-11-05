import React, { useState, useRef, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { ShoppingBag, Search, Menu, X, User, Package, LogOut, ChevronDown, Truck, ShieldCheck, Lock, Sparkles } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { AuthModal } from "../ui/AuthModal"
import { SearchModal } from "../ui/SearchModal"
import { CartDrawer } from "../ui/CartDrawer"
import { CategoryHoverMenu, type HoverCategoryItem } from "../ui/CategoryHoverMenu"
import { catalogApi } from "../../lib/api"

export function StoreLayout() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth()
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Hover menu state
  const [hoveredCategory, setHoveredCategory] = useState<HoverCategoryItem | null>(null)
  const [isHoverMenuOpen, setIsHoverMenuOpen] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-close menu on route change
  useEffect(() => {
    setIsHoverMenuOpen(false)
  }, [location.pathname, location.search])

  const handleCategoryMouseEnter = (cat: HoverCategoryItem) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHoveredCategory(cat)
    setIsHoverMenuOpen(true)
  }

  const handleCategoryMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverMenuOpen(false)
    }, 200)
  }

  const handleMenuMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setIsHoverMenuOpen(true)
  }

  const handleMenuMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverMenuOpen(false)
    }, 200)
  }

  const handleMenuClose = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setIsHoverMenuOpen(false)
  }

  // Fetch categories dynamically for navbar
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
    staleTime: 60 * 60 * 1000,
  })

  const categories = (categoriesData?.data?.data || [])
    .filter((c: any) => !c.parentCategory)
    .sort((a: any, b: any) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EFEA] text-neutral-900">
      <AuthModal />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* ─── Luxury Announcement Bar ────────────────── */}
      <div className="bg-[#191816] text-[#F4EFEA] text-[10px] sm:text-[11px] font-semibold tracking-wider py-2 px-4 text-center flex items-center justify-center gap-2 relative z-50">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="uppercase tracking-[0.15em]">Free Express Delivery Across India on Orders Above ₹499 • 100% Satisfaction Guaranteed</span>
      </div>

      {/* ─── Main Navbar ───────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#F4EFEA]/90 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative">
        <div className="max-w-[1700px] mx-auto px-3 md:px-6">
          <div className="flex h-15 items-center justify-between gap-4">

            {/* Official Printed Soul Unified Horizontal Logo */}
            <Link to="/" onMouseEnter={handleMenuClose} className="flex items-center shrink-0 group py-1">
              <img
                src="/logo-horizontal.png"
                alt="Printed Soul"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
              />
            </Link>

            {/* ─── Category Nav (desktop) ───────────── */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto hide-scrollbar px-2">
              <Link
                to="/"
                onMouseEnter={handleMenuClose}
                className="px-3.5 py-1.5 text-[13px] font-semibold text-neutral-700 hover:text-black rounded-full hover:bg-black/[0.05] transition-all whitespace-nowrap"
              >
                Home
              </Link>

              <Link
                to="/products?sort=new"
                onMouseEnter={() =>
                  handleCategoryMouseEnter({
                    type: "new",
                    name: "New Arrivals",
                    slug: "new",
                  })
                }
                onMouseLeave={handleCategoryMouseLeave}
                className="px-3.5 py-1.5 text-[13px] font-semibold text-neutral-700 hover:text-black rounded-full hover:bg-black/[0.05] transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <span>New Arrivals</span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              </Link>

              {/* Dynamic categories from DB */}
              {categories.map((cat: any) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug || cat._id}`}
                  onMouseEnter={() =>
                    handleCategoryMouseEnter({
                      type: "category",
                      _id: cat._id,
                      name: cat.name,
                      slug: cat.slug,
                      description: cat.description,
                      subcategories: cat.subcategories,
                    })
                  }
                  onMouseLeave={handleCategoryMouseLeave}
                  className="px-3.5 py-1.5 text-[13px] font-semibold text-neutral-700 hover:text-black rounded-full hover:bg-black/[0.05] transition-all whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}

              <Link
                to="/products"
                onMouseEnter={() =>
                  handleCategoryMouseEnter({
                    type: "all",
                    name: "All Collections",
                    slug: "all",
                  })
                }
                onMouseLeave={handleCategoryMouseLeave}
                className="px-3.5 py-1.5 text-[13px] font-semibold text-neutral-700 hover:text-black rounded-full hover:bg-black/[0.05] transition-all whitespace-nowrap"
              >
                Shop All
              </Link>
            </nav>

            {/* ─── Action Icons ────────────────────── */}
            <div onMouseEnter={handleMenuClose} className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-700 hover:bg-black/[0.04] transition-colors rounded-full lg:px-3.5 lg:py-1.5 lg:text-xs lg:font-medium lg:text-neutral-500 lg:bg-white lg:border lg:border-black/[0.08] lg:flex lg:items-center lg:gap-2 shadow-sm cursor-pointer hover:border-black/30"
                aria-label="Search"
              >
                <Search className="h-4 w-4 lg:h-3.5 lg:w-3.5" strokeWidth={2.2} />
                <span className="hidden lg:inline">Search…</span>
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 hover:bg-black/[0.04] transition-colors group cursor-pointer rounded-full"
              >
                <ShoppingBag className="h-5 w-5 text-neutral-900" strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-black text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-sm">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-1.5 p-1 hover:bg-black/[0.04] transition-colors cursor-pointer rounded-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user?.name[0].toUpperCase()}
                    </div>
                    <ChevronDown className="h-3 w-3 text-neutral-500 hidden md:block" />
                  </button>
                  {accountOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-2xl border border-black/[0.08] bg-white shadow-xl py-2 z-50 overflow-hidden"
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

        {/* Compact Category Hover Dropdown */}
        <CategoryHoverMenu
          isOpen={isHoverMenuOpen}
          activeCategory={hoveredCategory}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
          onClose={handleMenuClose}
        />
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Trust Strip */}
      <section className="max-w-[1700px] mx-auto px-3 md:px-6 my-8 w-full">
        <div className="bg-white rounded-3xl border border-black/[0.06] py-7 px-6 sm:px-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Truck, title: "Free Express Shipping", sub: "On all orders above ₹499" },
              { icon: ShieldCheck, title: "Armor Grade Cases", sub: "Drop-tested & scratch proof" },
              { icon: Lock, title: "100% Secure Checkout", sub: "Encrypted UPI, Cards & NetBanking" },
              { icon: Sparkles, title: "10,000+ Happy Souls", sub: "Rated 4.9/5 by verified buyers" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-[#F4EFEA] text-neutral-900 border border-black/[0.05] flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">{item.title}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{item.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121211] text-neutral-400 border-t border-neutral-800">
        <div className="max-w-[1700px] mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <Link to="/" className="inline-flex items-center mb-4 group">
                <img src="/logo-horizontal-white.png" alt="Printed Soul" className="h-8 md:h-9 w-auto object-contain opacity-95 group-hover:opacity-100 transition-opacity" />
              </Link>
              <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
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
              <h4 className="font-semibold mb-3 text-xs text-white uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-xs text-white uppercase tracking-widest">Support</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/track" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><a href="https://wa.me/919999999999?text=Hi%20Printed%20Soul%2C%20I%20need%20help" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Support</a></li>
                <li><a href="mailto:support@printedsoul.in" className="hover:text-white transition-colors">Email Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-xs text-white uppercase tracking-widest">Newsletter</h4>
              <p className="text-[11px] text-neutral-400 mb-3">Get exclusive drops & discounts.</p>
              <form className="flex rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 p-1" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="bg-transparent text-white text-xs px-3 py-1.5 w-full focus:outline-none" required />
                <button type="submit" className="bg-white text-black font-bold px-4 py-1.5 text-xs rounded-full hover:bg-neutral-200 transition-colors cursor-pointer shrink-0">Join</button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] gap-4">
            <p>© {new Date().getFullYear()} Printed Soul Store. All rights reserved.</p>
            <div className="flex items-center gap-2 grayscale opacity-70 hover:opacity-100 transition-opacity">
              {["VISA", "MC", "UPI", "RUPAY"].map(m => (
                <div key={m} className="h-5 w-10 bg-white rounded flex items-center justify-center text-[9px] font-black text-black">{m}</div>
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
