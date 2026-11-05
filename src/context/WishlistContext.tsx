import React, { createContext, useContext, useState, useEffect } from "react"

interface WishlistContextType {
  wishlistIds: string[]
  isInWishlist: (id: string) => boolean
  toggleWishlist: (product: any) => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("pss_wishlist")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("pss_wishlist", JSON.stringify(wishlistIds))
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [wishlistIds])

  const isInWishlist = (id: string) => {
    if (!id) return false
    return wishlistIds.includes(String(id))
  }

  const toggleWishlist = (product: any) => {
    const id = String(product?._id || product?.id || "")
    if (!id) return

    setWishlistIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider")
  }
  return ctx
}
