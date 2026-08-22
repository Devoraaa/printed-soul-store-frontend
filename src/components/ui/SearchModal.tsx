import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, TrendingUp, Smartphone, ArrowRight, Package } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { productApi } from "../../lib/api"
import { getImageUrl, formatPrice } from "../../lib/utils"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
      setQuery("")
      setDebouncedQuery("")
    }
  }, [isOpen])

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => productApi.getAll({ search: debouncedQuery, limit: 6 }),
    enabled: debouncedQuery.trim().length > 1,
  })

  const searchResults = data?.data?.data || []
  const hasQuery = debouncedQuery.trim().length > 1

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      onClose()
    }
  }

  const navigateToProduct = (slug: string) => {
    navigate(`/products/${slug}`)
    onClose()
  }

  const popularSearches = ["iPhone 15 Pro Max", "Spider-Man", "Virat Kohli", "Glass Case"]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/80 backdrop-blur-2xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Search Input Area */}
            <div className="p-6 md:p-8 border-b border-gray-100 relative shrink-0">
              <form onSubmit={handleSearch} className="flex items-center">
                <Search className="h-7 w-7 md:h-8 md:w-8 text-gray-400 shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search designs, players, devices..."
                  className="w-full pl-5 pr-12 py-2 text-xl md:text-3xl font-display font-black tracking-tight text-black placeholder-gray-300 bg-transparent focus:outline-none"
                />
                <button 
                  type="button" 
                  onClick={onClose}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </form>
            </div>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto scrollbar-none flex-1">
              {!hasQuery ? (
                <div className="p-6 md:p-8 bg-gray-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        <TrendingUp className="h-4 w-4" /> Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => { setQuery(term); navigate(`/products?search=${encodeURIComponent(term)}`); onClose(); }}
                            className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:border-black hover:text-black transition-colors cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        <Smartphone className="h-4 w-4" /> Top Categories
                      </h3>
                      <div className="space-y-2">
                        <button onClick={() => { navigate('/categories/glass-case'); onClose(); }} className="flex items-center justify-between w-full p-3 rounded-2xl bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                          <span className="font-bold text-sm text-gray-700 group-hover:text-black">Premium Glass Cases</span>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                        </button>
                        <button onClick={() => { navigate('/categories/dual-protection-case'); onClose(); }} className="flex items-center justify-between w-full p-3 rounded-2xl bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer">
                          <span className="font-bold text-sm text-gray-700 group-hover:text-black">Dual Protection Covers</span>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {isLoading ? "Searching..." : `Results for "${debouncedQuery}"`}
                    </h3>
                    {searchResults.length > 0 && (
                      <button 
                        onClick={handleSearch}
                        className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 cursor-pointer"
                      >
                        View All <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                          <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-100 rounded w-2/3" />
                            <div className="h-3 bg-gray-100 rounded w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {searchResults.map((product: any) => (
                        <button
                          key={product._id}
                          onClick={() => navigateToProduct(product.slug)}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group text-left cursor-pointer border border-transparent hover:border-gray-100 w-full"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/60 shadow-sm">
                            <img 
                              src={product.images?.[0] ? getImageUrl(product.images[0]) : "/placeholder.png"} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.comparePrice > product.price && (
                                <span className="text-[10px] text-gray-400 line-through font-semibold">
                                  {formatPrice(product.comparePrice)}
                                </span>
                              )}
                              {product.category && (
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest px-1.5 py-0.5 rounded border border-gray-200 ml-auto hidden md:inline-block truncate max-w-[80px]">
                                  {product.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <Package className="h-6 w-6 text-gray-300" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">No designs found</h4>
                      <p className="text-sm text-gray-500">We couldn't find anything matching "{debouncedQuery}".</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Mobile Footer for quick submit */}
            {hasQuery && searchResults.length > 0 && (
              <div className="md:hidden p-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={handleSearch}
                  className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm shadow-md"
                >
                  See all results
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
