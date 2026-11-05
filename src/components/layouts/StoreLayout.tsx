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
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isTransparent = isHome && !isScrolled

  const isLinkActive = (to: string) => {
    if (to === "/") return location.pathname === "/" && !location.search
    return (location.pathname + location.search) === to
  }

  const getLinkClasses = (to: string) => {
    const active = isLinkActive(to)
    const base = "px-4 py-2 text-[14px] sm:text-[15px] font-bold rounded-full transition-all whitespace-nowrap"
    if (isTransparent) {
      return active
        ? `${base} bg-white/25 text-white shadow-sm ring-1 ring-white/30 backdrop-blur-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`
        : `${base} text-white/95 hover:text-white hover:bg-white/20 hover:shadow-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`
    }
    return active
      ? `${base} bg-neutral-900 text-[#F4EFEA] shadow-sm`
      : `${base} text-neutral-800 hover:text-white hover:bg-black`
  }

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

      {/* ─── Header Container ───────────────────────── */}
      <header className={`w-full z-50 transition-all duration-300 ${
        isHome ? "fixed top-0 left-0 right-0" : "sticky top-0"
      }`}>
        {/* Main Navbar */}
        <div className={`w-full transition-all duration-300 ${
          isTransparent
            ? "bg-gradient-to-b from-black/90 via-black/50 to-transparent text-white border-transparent pt-2 pb-6"
            : "bg-[#F4EFEA]/95 backdrop-blur-xl border-b border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-neutral-900 py-2 sm:py-2.5"
        }`}>
          <div className="max-w-[1700px] mx-auto px-4 md:px-8">
            <div className="flex h-18 sm:h-20 items-center justify-between gap-4">

              {/* Official Printed Soul Unified Horizontal Logo */}
              <Link to="/" onMouseEnter={handleMenuClose} className="flex items-center shrink-0 group py-1">
                <img
                  src={isTransparent ? "/logo-horizontal-white.png" : "/logo-horizontal.png"}
                  alt="Printed Soul"
                  className="h-9 sm:h-10 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-sm"
                />
              </Link>

              {/* ─── Category Nav (desktop) ───────────── */}
              <nav className="hidden lg:flex items-center gap-1.5 flex-1 overflow-x-auto hide-scrollbar px-3">
                <Link
                  to="/"
                  onMouseEnter={handleMenuClose}
                  className={getLinkClasses("/")}
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
                  className={`${getLinkClasses("/products?sort=new")} flex items-center gap-1.5`}
                >
                  <span>New Arrivals</span>
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                </Link>

                {/* Dynamic categories from DB */}
                {categories.map((cat: any) => {
                  const catPath = `/products?category=${cat.slug || cat._id}`
                  return (
                    <Link
                      key={cat._id}
                      to={catPath}
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
                      className={getLinkClasses(catPath)}
                    >
                      {cat.name}
                    </Link>
                  )
                })}

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
                  className={getLinkClasses("/products")}
                >
                  Shop All
                </Link>
              </nav>

              {/* ─── Action Icons ────────────────────── */}
              <div onMouseEnter={handleMenuClose} className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`p-2.5 transition-all rounded-full lg:px-4 lg:py-2.5 lg:text-xs lg:font-bold lg:flex lg:items-center lg:gap-2.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${
                    isTransparent
                      ? "text-white hover:bg-white/30 lg:bg-white/20 lg:border lg:border-white/40 lg:text-white lg:hover:bg-white/35 backdrop-blur-md shadow-md"
                      : "text-neutral-800 hover:bg-black/5 lg:text-neutral-700 lg:bg-white lg:border lg:border-black/15 lg:hover:border-black"
                  }`}
                  aria-label="Search"
                >
                  <Search className="h-4 w-4 lg:h-4 lg:w-4" strokeWidth={2.5} />
                  <span className="hidden lg:inline">Search…</span>
                </button>

                {/* Cart */}
                <button
                  onClick={() => setCartDrawerOpen(true)}
                  className={`relative p-2.5 transition-all group cursor-pointer rounded-full hover:scale-110 active:scale-95 ${
                    isTransparent ? "hover:bg-white/25 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "hover:bg-black/5 text-neutral-900"
                  }`}
                >
                  <ShoppingBag className="h-6 w-6" strokeWidth={2.2} />
                  {totalItems > 0 && (
                    <span className={`absolute -top-0.5 -right-0.5 h-5 w-5 text-[10px] font-black flex items-center justify-center rounded-full shadow-md ${
                      isTransparent ? "bg-white text-black" : "bg-neutral-900 text-white"
                    }`}>
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </button>

                {/* Account */}
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setAccountOpen(!accountOpen)}
                      className={`flex items-center gap-1.5 p-1 transition-all cursor-pointer rounded-full hover:scale-105 ${
                        isTransparent ? "hover:bg-white/20" : "hover:bg-black/5"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs font-black shadow-md border-2 border-white/20">
                        {user?.name[0].toUpperCase()}
                      </div>
                      <ChevronDown className={`h-3.5 w-3.5 hidden md:block ${isTransparent ? "text-white" : "text-neutral-700"}`} />
                    </button>
                    {accountOpen && (
                      <div
                        className="absolute right-0 mt-2 w-52 rounded-2xl border border-black/[0.08] bg-white shadow-2xl py-2 z-50 overflow-hidden text-neutral-900"
                        onMouseLeave={() => setAccountOpen(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-black/[0.05]">
                          <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="h-3.5 w-3.5 text-gray-500" /> My Account
                        </Link>
                        <Link to="/account/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                          <Package className="h-3.5 w-3.5 text-gray-500" /> My Orders
                        </Link>
                        <div className="border-t border-black/[0.05] my-1" />
                        <button onClick={() => { logout(); setAccountOpen(false) }} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                          <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className={`hidden md:flex items-center justify-center px-6 py-2.5 text-xs font-black tracking-wider rounded-full active:scale-95 hover:scale-105 transition-all cursor-pointer shadow-md uppercase ${
                      isTransparent
                        ? "bg-white text-neutral-950 hover:bg-neutral-100"
                        : "bg-neutral-900 text-white hover:bg-black"
                    }`}
                  >
                    Sign In
                  </button>
                )}

                {/* Mobile Menu */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className={`lg:hidden p-2 rounded-full cursor-pointer transition-colors ${
                    isTransparent ? "text-white hover:bg-white/20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Mobile Navigation Sheet */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[72px] sm:top-[80px] z-50 bg-black/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#F4EFEA] border-b border-black/[0.08] shadow-2xl p-5 max-h-[85vh] overflow-y-auto space-y-4 rounded-b-3xl">
              {/* Quick Search Trigger */}
              <button
                onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 bg-white border border-black/[0.08] rounded-2xl text-xs font-semibold text-neutral-500 shadow-2xs cursor-pointer"
              >
                <Search className="h-4 w-4 text-neutral-400" />
                <span>Search designs, models, anime...</span>
              </button>

              {/* Main Links */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-2 space-y-0.5 shadow-2xs">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                </Link>

                <Link
                  to="/products?sort=new"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    New Arrivals
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                </Link>

                {categories.map((cat: any) => (
                  <Link
                    key={cat._id}
                    to={`/products?category=${cat.slug || cat._id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                  </Link>
                ))}

                <Link
                  to="/products"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-neutral-900 hover:bg-neutral-50 transition-colors border-t border-black/[0.04] mt-1"
                >
                  <span>Explore All Collections</span>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                </Link>
              </div>

              {/* User Account or Sign In */}
              <div className="bg-white rounded-2xl border border-black/[0.06] p-3 shadow-2xs">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 pb-2 border-b border-black/[0.05]">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-black text-xs flex items-center justify-center">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/account"
                        onClick={() => setMobileOpen(false)}
                        className="text-center py-2 text-xs font-bold text-neutral-700 bg-neutral-50 rounded-xl hover:bg-neutral-100"
                      >
                        Account
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setMobileOpen(false)}
                        className="text-center py-2 text-xs font-bold text-neutral-700 bg-neutral-50 rounded-xl hover:bg-neutral-100"
                      >
                        My Orders
                      </Link>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); openAuthModal(); }}
                    className="w-full py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors shadow-sm cursor-pointer"
                  >
                    Sign In / Create Account
                  </button>
                )}
              </div>

              {/* Track Order & Help shortcut */}
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 px-2 pt-1">
                <Link to="/track" onClick={() => setMobileOpen(false)} className="hover:text-black">
                  📦 Track Order
                </Link>
                <a
                  href="https://wa.me/919999999999?text=Hi%20Printed%20Soul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black"
                >
                  💬 WhatsApp Help
                </a>
              </div>
            </div>
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
