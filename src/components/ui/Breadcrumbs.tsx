import React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
  const location = useLocation()
  const paths = location.pathname.split("/").filter((p) => p)

  if (paths.length === 0) return null // Don't show on home page

  return (
    <nav aria-label="Breadcrumb" className="bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center text-sm overflow-x-auto whitespace-nowrap">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        {paths.map((path, index) => {
          const isLast = index === paths.length - 1
          const href = `/${paths.slice(0, index + 1).join("/")}`
          
          // Format the path text (e.g., 'product-name' -> 'Product Name')
          const text = path
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

          return (
            <React.Fragment key={path}>
              <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50 shrink-0" />
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {text}
                </span>
              ) : (
                <Link to={href} className="text-muted-foreground hover:text-primary transition-colors">
                  {text}
                </Link>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
