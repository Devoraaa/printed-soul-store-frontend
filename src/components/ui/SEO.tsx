import React, { useEffect } from "react"

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string | string[]
  canonicalUrl?: string
  ogType?: "website" | "product" | "article"
  ogImage?: string
  ogImageAlt?: string
  noindex?: boolean
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
const BASE_URL = "https://printedsoul.in"

function setMetaTag(attrName: "name" | "property", attrValue: string, content?: string) {
  if (!content) {
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
  // Remove existing dynamic json-ld script
  const existingScript = document.head.querySelector("script#seo-dynamic-jsonld")
  if (existingScript) existingScript.remove()

  if (!data) return

  const script = document.createElement("script")
  script.id = "seo-dynamic-jsonld"
  script.type = "application/ld+json"

  // Wrap array in schema @graph or stringify
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
  structuredData,
}: SEOProps) {
  useEffect(() => {
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
      `${BASE_URL}${window.location.pathname}${window.location.search ? window.location.search : ""}`
    setCanonical(canonical)

    // Ensure full image URL for OG
    const fullOgImage = ogImage.startsWith("http")
      ? ogImage
      : `${BASE_URL}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`

    // 4. OpenGraph
    setMetaTag("property", "og:title", formattedTitle)
    setMetaTag("property", "og:description", description)
    setMetaTag("property", "og:type", ogType)
    setMetaTag("property", "og:url", canonical)
    setMetaTag("property", "og:image", fullOgImage)
    setMetaTag("property", "og:image:alt", ogImageAlt)
    setMetaTag("property", "og:site_name", SITE_NAME)
    setMetaTag("property", "og:locale", "en_IN")

    // 5. Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image")
    setMetaTag("name", "twitter:title", formattedTitle)
    setMetaTag("name", "twitter:description", description)
    setMetaTag("name", "twitter:image", fullOgImage)
    setMetaTag("name", "twitter:site", "@PrintedSoul")
    setMetaTag("name", "twitter:creator", "@PrintedSoul")

    // 6. JSON-LD Structured Data
    setStructuredData(structuredData)

    return () => {
      // Clean up dynamic structured data script on unmount
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
    structuredData,
  ])

  return null
}
