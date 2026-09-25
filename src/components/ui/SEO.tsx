import React, { useEffect } from "react"

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string | string[]
  canonicalUrl?: string
  ogType?: "website" | "product" | "article"
  ogImage?: string
  ogImageAlt?: string
  noindex?: boolean
  price?: number | string
  currency?: string
  availability?: "in stock" | "out of stock" | "preorder"
  brand?: string
  breadcrumbs?: BreadcrumbItem[]
  structuredData?: Record<string, any> | Record<string, any>[]
}

const DEFAULT_TITLE = "Printed Soul — Buy Custom Phone Cases, Glass & Metal Covers Online India"
const DEFAULT_DESCRIPTION =
  "Shop premium custom mobile back covers, 9H toughened glass cases, dual protection shockproof covers, and metal armor cases for Apple, Samsung, Vivo, Oppo & more at Printed Soul India. Free shipping above ₹499."
const DEFAULT_KEYWORDS = [
  "Printed Soul",
  "buy phone covers online india",
  "custom phone cases india",
  "toughened glass phone case",
  "dual protection shockproof cover",
  "metal armor mobile cover",
  "anime phone cases",
  "aesthetic phone covers",
  "custom coffee mugs",
  "custom wall frames india",
  "insulated tumbler bottles",
  "gaming mousepads",
  "designer coasters",
]
const SITE_NAME = "Printed Soul"
const DEFAULT_OG_IMAGE = "https://printedsoul.in/hero.webp"

function getBaseUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin
  }
  return "https://printedsoul.in"
}

function setMetaTag(attrName: "name" | "property", attrValue: string, content?: string) {
  if (content === undefined || content === null || content === "") {
    const existing = document.head.querySelector(`meta[${attrName}="${attrValue}"]`)
    if (existing) existing.remove()
    return
  }

  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function setCanonical(href?: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!href) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", "canonical")
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

function setStructuredData(data?: Record<string, any> | Record<string, any>[]) {
  const existingScript = document.head.querySelector("script#seo-dynamic-jsonld")
  if (existingScript) existingScript.remove()

  if (!data) return

  const script = document.createElement("script")
  script.id = "seo-dynamic-jsonld"
  script.type = "application/ld+json"

  const payload = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data,
      }
    : data

  script.textContent = JSON.stringify(payload, null, 2)
  document.head.appendChild(script)
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = "Printed Soul Store",
  noindex = false,
  price,
  currency = "INR",
  availability = "in stock",
  brand = "Printed Soul",
  breadcrumbs,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const baseUrl = getBaseUrl()

    // 1. Page Title
    const formattedTitle = title
      ? `${title} | ${SITE_NAME}`
      : DEFAULT_TITLE
    document.title = formattedTitle

    // 2. Standard Meta
    setMetaTag("name", "description", description)
    const keywordsStr = Array.isArray(keywords) ? keywords.join(", ") : keywords
    setMetaTag("name", "keywords", keywordsStr)
    setMetaTag(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    )

    // 3. Canonical URL
    const canonical =
      canonicalUrl ||
      `${baseUrl}${window.location.pathname}${window.location.search ? window.location.search : ""}`
    setCanonical(canonical)

    // Ensure full image URL for OG
    const fullOgImage = ogImage.startsWith("http")
      ? ogImage
      : `${baseUrl}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`

    // 4. OpenGraph
    setMetaTag("property", "og:title", formattedTitle)
    setMetaTag("property", "og:description", description)
    setMetaTag("property", "og:type", ogType)
    setMetaTag("property", "og:url", canonical)
    setMetaTag("property", "og:image", fullOgImage)
    setMetaTag("property", "og:image:alt", ogImageAlt)
    setMetaTag("property", "og:site_name", SITE_NAME)
    setMetaTag("property", "og:locale", "en_IN")

    // E-commerce Product Specific OpenGraph Tags
    if (ogType === "product") {
      if (price !== undefined) {
        setMetaTag("property", "product:price:amount", String(price))
        setMetaTag("property", "product:price:currency", currency)
        setMetaTag("property", "og:price:amount", String(price))
        setMetaTag("property", "og:price:currency", currency)
      }
      setMetaTag("property", "product:availability", availability)
      setMetaTag("property", "product:brand", brand)
      setMetaTag("property", "product:condition", "new")
    } else {
      setMetaTag("property", "product:price:amount")
      setMetaTag("property", "product:price:currency")
      setMetaTag("property", "og:price:amount")
      setMetaTag("property", "og:price:currency")
      setMetaTag("property", "product:availability")
      setMetaTag("property", "product:brand")
      setMetaTag("property", "product:condition")
    }

    // 5. Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image")
    setMetaTag("name", "twitter:title", formattedTitle)
    setMetaTag("name", "twitter:description", description)
    setMetaTag("name", "twitter:image", fullOgImage)
    setMetaTag("name", "twitter:site", "@PrintedSoul")
    setMetaTag("name", "twitter:creator", "@PrintedSoul")

    // 6. JSON-LD Structured Data
    let finalStructuredData: any = structuredData

    if (breadcrumbs && breadcrumbs.length > 0) {
      const alreadyHasBreadcrumb = Array.isArray(structuredData)
        ? structuredData.some((item: any) => item["@type"] === "BreadcrumbList")
        : Boolean(structuredData && (structuredData as any)["@type"] === "BreadcrumbList")

      if (!alreadyHasBreadcrumb) {
        const breadcrumbSchema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((crumb, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": crumb.name,
            "item": crumb.url.startsWith("http") ? crumb.url : `${baseUrl}${crumb.url.startsWith("/") ? "" : "/"}${crumb.url}`
          }))
        }

        if (Array.isArray(structuredData)) {
          finalStructuredData = [breadcrumbSchema, ...structuredData]
        } else if (structuredData && typeof structuredData === "object") {
          finalStructuredData = [breadcrumbSchema, structuredData]
        } else {
          finalStructuredData = breadcrumbSchema
        }
      }
    }

    setStructuredData(finalStructuredData)

    return () => {
      const script = document.head.querySelector("script#seo-dynamic-jsonld")
      if (script) script.remove()
    }
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogType,
    ogImage,
    ogImageAlt,
    noindex,
    price,
    currency,
    availability,
    brand,
    breadcrumbs,
    structuredData,
  ])

  return null
}
