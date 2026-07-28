import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { productApi } from "../../lib/api"
import { ProductCard } from "./ProductCard"

interface CategorySectionProps {
  categoryId: string
  title: string
  slug: string
  subtitle?: string
}

export function CategorySection({ categoryId, title, slug, subtitle }: CategorySectionProps) {
  const { data } = useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: () => productApi.getAll({ category: categoryId, limit: 4 }),
    enabled: !!categoryId,
  })

  const products = data?.data?.data || []

  if (!categoryId || products.length === 0) return null

  return (
    <section className="py-24 bg-[#F5F5F7]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold tracking-tighter mb-2">{title}</h2>
            {subtitle ? (
              <p className="text-gray-500 text-lg md:text-xl font-medium tracking-tight mb-4">{subtitle}</p>
            ) : (
              <p className="text-gray-500 text-lg md:text-xl font-medium tracking-tight mb-4">The latest and greatest, customized for you.</p>
            )}
          </div>
          <Link to={`/categories/${slug}`} className="hidden md:flex items-center gap-2 font-semibold text-gray-800 hover:text-gray-500 transition-colors">
            View All <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link to={`/categories/${slug}`} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white border border-gray-200 text-black font-semibold hover:bg-gray-50 transition-colors shadow-sm w-full">
            View All {title}
          </Link>
        </div>
      </div>
    </section>
  )
}
