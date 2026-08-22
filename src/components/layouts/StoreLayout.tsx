import React, { useState } from "react"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { ShoppingBag, Search, Menu, X, User, Package, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { cn } from "../../lib/utils"
import { AuthModal } from "../ui/AuthModal"
import { SearchModal } from "../ui/SearchModal"
import { MegaMenu } from "../ui/MegaMenu"


export function StoreLayout() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth()
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [megaMenuType, setMegaMenuType] = useState<"categories" | "brands" | null>(null)
  const navigate = useNavigate()



  const navLinks = [
    { title: "Home", href: "/" },
    { title: "New Arrivals", href: "/products?sort=new" },
    { title: "Categories", href: "/products?category=all" },
    { title: "Brands", href: "/products?brand=all" },
    { title: "Shop All", href: "/products" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthModal />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {/* Announcement bar */}
      <div className="bg-black text-white text-center text-xs py-2 px-4 font-medium tracking-wide">
        🚚 Free shipping on orders above ₹499 &nbsp;|&nbsp; 📱 Custom cases for 1000+ devices
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex h-18 items-center justify-between gap-6 py-1">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 rounded-2xl bg-black flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md">
                <span className="text-white font-black text-base tracking-tighter">PS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl tracking-tight text-gray-900 leading-none">
                  PRINTED SOUL
                </span>
                <span className="text-[9px] font-bold text-violet-600 tracking-widest uppercase mt-0.5">
                  PREMIUM CASES & DESIGN
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex items-center gap-9">
                {navLinks.map((link) => (
                  <div key={link.href} className="h-16 flex items-center relative group"
                    onMouseEnter={() => {
                      if (link.title === "Categories") { setMegaMenuType("categories"); setMegaMenuOpen(true) }
                      else if (link.title === "Brands") { setMegaMenuType("brands"); setMegaMenuOpen(true) }
                    }}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    onClick={() => setMegaMenuOpen(false)}
                  >
                    <Link to={link.href} className="text-[14px] font-bold text-gray-600 hover:text-black transition-colors py-2 tracking-tight">
                      {link.title}
                    </Link>
                    <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
                  </div>
                ))}
              </nav>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
              {/* Search Pill Button */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2.5 p-2 md:px-3.5 md:py-2 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 transition-all text-xs font-semibold border border-gray-200/60"
                aria-label="Search"
              >
                <Search className="h-4 w-4 text-gray-500" strokeWidth={2.2} />
                <span className="hidden lg:inline text-gray-400 font-medium">Search cases…</span>
                <kbd className="hidden lg:inline-block bg-white text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded border shadow-2xs">⌘K</kbd>
              </button>

              {/* Cart Button */}
              <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group">
                <ShoppingBag className="h-5 w-5 text-gray-900 group-hover:scale-110 transition-transform" strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user?.name[0].toUpperCase()}
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-500 hidden md:block" />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white shadow-2xl py-2 z-50 animate-fade-in" onMouseLeave={() => setAccountOpen(false)}>
                      <div className="px-4 py-2.5 border-b">
                        <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-4 w-4 text-gray-500" /> My Account
                      </Link>
                      <Link to="/account/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        <Package className="h-4 w-4 text-gray-500" /> Track My Orders
                      </Link>
                      <div className="border-t my-1"></div>
                      <button onClick={() => { logout(); setAccountOpen(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={openAuthModal} className="hidden md:flex items-center justify-center px-5 py-2.5 text-xs font-bold tracking-wide rounded-full bg-black text-white hover:bg-gray-900 active:scale-95 transition-all shadow-md">
                  Sign In
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Integration */}
        <MegaMenu 
          isOpen={megaMenuOpen} 
          type={megaMenuType}
          onMouseEnter={() => setMegaMenuOpen(true)} 
          onMouseLeave={() => setMegaMenuOpen(false)}
          onClose={() => setMegaMenuOpen(false)} 
        />

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background py-4 px-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="py-2 px-3 text-sm font-medium rounded-lg hover:bg-muted">
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Breadcrumbs removed as per user request to avoid duplication */}

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Trust Features Section */}
      <section className="bg-white border-t border-gray-200 py-12 md:py-16">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-violet-600" />
              </div>
              <h4 className="font-display font-black text-sm text-gray-900 uppercase tracking-widest mb-1">Free Shipping</h4>
              <p className="text-xs text-gray-500 font-medium">On all orders above ₹499</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h4 className="font-display font-black text-sm text-gray-900 uppercase tracking-widest mb-1">Premium Quality</h4>
              <p className="text-xs text-gray-500 font-medium">Armor grade drop protection</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
              <h4 className="font-display font-black text-sm text-gray-900 uppercase tracking-widest mb-1">Secure Payments</h4>
              <p className="text-xs text-gray-500 font-medium">100% secure checkout</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514"></path></svg>
              </div>
              <h4 className="font-display font-black text-sm text-gray-900 uppercase tracking-widest mb-1">Top Rated</h4>
              <p className="text-xs text-gray-500 font-medium">Loved by 10,000+ customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-400 border-t border-black">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
            <div className="col-span-2 md:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-6 opacity-90 hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <span className="text-black font-bold text-sm tracking-tighter">PS</span>
                </div>
                <span className="font-display font-bold text-xl text-white tracking-tight">Printed Soul</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500 max-w-sm">Premium custom phone cases for every personality and device. Make it yours.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm text-white">Shop</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/products?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
                <li><Link to="/products?category=all" className="hover:text-white transition-colors">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm text-white">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="mailto:support@printedsoul.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display font-semibold mb-4 text-sm text-white">Stay in the Loop</h4>
              <p className="text-xs text-gray-500 mb-3">Subscribe for exclusive drops & discounts.</p>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email address" className="bg-gray-900 border border-gray-800 text-white text-xs rounded-l-xl px-3 py-2 w-full focus:outline-none focus:border-gray-600" required />
                <button type="submit" className="bg-white text-black font-bold px-3 py-2 rounded-r-xl text-xs hover:bg-gray-200 transition-colors">Join</button>
              </form>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-sm gap-6">
            <p>© {new Date().getFullYear()} Printed Soul Store. All rights reserved.</p>
            <div className="flex items-center gap-3 grayscale opacity-60 hover:opacity-100 transition-opacity">
              <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[10px] font-black text-black">VISA</div>
              <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[10px] font-black text-black">MC</div>
              <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[10px] font-black text-black">UPI</div>
              <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-[10px] font-black text-black">RUPAY</div>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
