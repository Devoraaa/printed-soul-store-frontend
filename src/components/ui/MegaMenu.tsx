import React from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Folder, Tag } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { catalogApi } from "../../lib/api"
import { getImageUrl } from "../../lib/utils"

interface MegaMenuProps {
  isOpen: boolean
  type: "categories" | "brands" | null
  onMouseLeave: () => void
  onMouseEnter: () => void
  onClose: () => void
}

export function MegaMenu({ isOpen, type, onMouseLeave, onMouseEnter, onClose }: MegaMenuProps) {
  // Fetch categories dynamically (Cached for 1 hour to prevent slowdowns)
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.getCategories(),
    staleTime: 60 * 60 * 1000, 
  })

  // Fetch brands dynamically
  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => catalogApi.getBrands(),
    staleTime: 60 * 60 * 1000, 
  })

  const categories = categoriesData?.data?.data || []
  const brands = brandsData?.data?.data || []

  const items = type === "categories" 
    ? categories.map((c: any) => ({
        id: c._id,
        title: c.name,
        description: c.description || "Explore our premium collection",
        image: getImageUrl(c.image?._id || c.image) !== "/placeholder.png" ? getImageUrl(c.image?._id || c.image) : "/small.png", // Fallback if no real image
        href: `/products?category=${c.slug}`,
        icon: <Folder className="h-5 w-5" />
      }))
    : brands.map((b: any) => ({
        id: b._id,
        title: b.name,
        description: b.description || "Top brands & models",
        image: getImageUrl(b.logo?._id || b.logo) !== "/placeholder.png" ? getImageUrl(b.logo?._id || b.logo) : "/small.png",
        href: `/products?brand=${b.slug}`,
        icon: <Tag className="h-5 w-5" />
      }))

  if (!type || items.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-16 left-4 right-4 bg-white border border-gray-100 shadow-2xl z-40 overflow-hidden rounded-2xl mt-2 max-h-[80vh] overflow-y-auto"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="container mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {items.map((item: any) => (
                <div key={item.id} className="flex flex-col gap-4 group">
                  {/* Image Column */}
                  <Link to={item.href} onClick={onClose} className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = type === "categories" ? "/small.png" : "/hero.png"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </Link>
                  
                  {/* Content Column */}
                  <div className="flex flex-col flex-1">
                    <Link to={item.href} onClick={onClose} className="flex items-center gap-2 mb-1">
                      <div className="p-2 rounded-full bg-black/5 group-hover:bg-black group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="font-display font-bold text-lg group-hover:text-black transition-colors">{item.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">{item.description}</p>
                    
                    <ul className="space-y-2 mt-auto">
                      <li>
                        <Link to={item.href} onClick={onClose} className="text-sm font-medium text-gray-600 hover:text-black hover:translate-x-1 inline-block transition-all">
                          View Collection &rarr;
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
