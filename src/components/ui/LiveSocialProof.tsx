import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Sparkles } from "lucide-react"

interface PurchaseItem {
  name: string
  location: string
  item: string
  timeAgo: string
  image: string
}

const PURCHASES: PurchaseItem[] = [
  {
    name: "Vikram S.",
    location: "New Delhi",
    item: "Virat Kohli Legacy Edition Artwork",
    timeAgo: "2m ago",
    image: "/costers.webp",
  },
  {
    name: "Aanya M.",
    location: "Bengaluru",
    item: "Mindset of Abundance Floral Tote",
    timeAgo: "4m ago",
    image: "/small.webp",
  },
  {
    name: "Rohan D.",
    location: "Mumbai",
    item: "Legends Rise Pro Mousepad 4MM",
    timeAgo: "1m ago",
    image: "/metal.webp",
  },
  {
    name: "Pooja K.",
    location: "Pune",
    item: "Ripple Flow Coaster (Set of 4)",
    timeAgo: "6m ago",
    image: "/costers.webp",
  },
  {
    name: "Ananya B.",
    location: "Jaipur",
    item: "King Energy Ceramic Coffee Mug",
    timeAgo: "3m ago",
    image: "/mug.webp",
  },
  {
    name: "Aditya R.",
    location: "Hyderabad",
    item: "17 Dual Case - Shock Armor Edition",
    timeAgo: "Just now",
    image: "/glass.webp",
  },
]

export function LiveSocialProof() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (isDismissed) return

    // Initial show after 3.5s
    const initTimer = setTimeout(() => {
      setIsVisible(true)
    }, 3500)

    // Repeat cycle every 12 seconds
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % PURCHASES.length)
        setIsVisible(true)
      }, 1000)
    }, 11000)

    return () => {
      clearTimeout(initTimer)
      clearInterval(interval)
    }
  }, [isDismissed])

  if (isDismissed) return null
  const current = PURCHASES[currentIdx]

  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-30 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto max-w-[310px] sm:max-w-xs bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex items-center gap-3 relative group"
          >
            {/* Image Thumbnail with green live badge */}
            <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-[#FAF7F2] border border-black/[0.06] shrink-0">
              <img
                src={current.image}
                alt={current.item}
                className="w-full h-full object-cover"
              />
              <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              </span>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pr-3">
              <p className="text-[11px] font-bold text-neutral-900 leading-tight truncate">
                <span className="text-neutral-500 font-normal">{current.name}</span> in <span className="text-neutral-800">{current.location}</span>
              </p>
              <p className="text-[11.5px] font-black text-neutral-950 truncate mt-0.5 leading-snug">
                {current.item}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[9.5px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Verified Order • {current.timeAgo}</span>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss notification"
              className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
