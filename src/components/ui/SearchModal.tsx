import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, TrendingUp, Smartphone, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`)
      onClose()
      setQuery("")
    }
  }

  const popularSearches = ["iPhone 15 Pro Max", "Virat Kohli", "Dual Protection", "Glass Case"]

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
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
          >
            {/* Search Input Area */}
            <div className="p-6 md:p-8 border-b border-gray-100 relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <Search className="h-8 w-8 text-gray-400 shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for cases, players, or devices..."
                  className="w-full pl-6 pr-12 py-2 text-2xl md:text-4xl font-display font-semibold tracking-tight text-black placeholder-gray-300 bg-transparent focus:outline-none"
                />
                <button 
                  type="button" 
                  onClick={onClose}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </form>
            </div>

            {/* Suggestions Area */}
            <div className="p-6 md:p-8 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    <TrendingUp className="h-4 w-4" /> Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => { setQuery(term); navigate(`/products?search=${encodeURIComponent(term)}`); onClose(); }}
                        className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium hover:border-black transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                    <Smartphone className="h-4 w-4" /> Top Categories
                  </h3>
                  <div className="space-y-2">
                    <button onClick={() => { navigate('/categories/glass-case'); onClose(); }} className="flex items-center justify-between w-full p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                      <span className="font-medium text-gray-700 group-hover:text-black">Premium Glass Cases</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                    </button>
                    <button onClick={() => { navigate('/categories/dual-protection-case'); onClose(); }} className="flex items-center justify-between w-full p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                      <span className="font-medium text-gray-700 group-hover:text-black">Dual Protection Covers</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
