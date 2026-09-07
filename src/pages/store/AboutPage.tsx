import { Link } from "react-router-dom"
import { ShieldCheck, Truck } from "lucide-react"
import { SEO } from "../../components/ui/SEO"

const structuredData = {
  "@type": "LocalBusiness",
  "name": "Printed Soul",
  "url": "https://printedsoul.in",
  "telephone": "+91-9999999999",
  "email": "support@printedsoul.in",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN",
  },
  "priceRange": "₹₹",
  "openingHours": "Mo-Sa 09:00-18:00",
  "sameAs": ["https://www.instagram.com/printedsoul.in"],
}

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "500+", label: "Unique Designs" },
  { value: "50+", label: "Phone Models Supported" },
  { value: "4.9★", label: "Average Rating" },
]

const pillars = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Quality Craftsmanship",
    description:
      "Every case is built with premium materials — dual-layer protection, tempered glass, and precision-fit engineering that stands the test of time.",
  },
  {
    icon: <span className="text-3xl leading-none">⭐</span>,
    title: "Express Yourself",
    description:
      "Choose from 500+ unique designs or go fully custom. Your phone case is an extension of your personality — make it unforgettable.",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Fast Delivery",
    description:
      "Orders processed within 24 hours and shipped pan-India with real-time tracking so your case arrives exactly when you need it.",
  },
]

const trustBadges = [
  { emoji: "🔒", label: "Secure Payment" },
  { emoji: "↩️", label: "Easy 7-Day Returns" },
  { emoji: "🇮🇳", label: "Made in India" },
  { emoji: "💬", label: "24/7 WhatsApp Support" },
]

export function AboutPage() {
  return (
    <>
      <SEO
        title="About Us | Printed Soul — Custom Phone Covers"
        description="Printed Soul is India's premium destination for custom phone covers. We make high-quality dual protection, glass and metal cases with unique designs."
        canonicalUrl="https://printedsoul.in/about"
        structuredData={structuredData}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-black text-white min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-widest mb-6 leading-tight">
          Wear Your Story
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10">
          India's premium destination for custom phone covers
        </p>
        <Link
          to="/products"
          className="bg-white text-black font-black uppercase tracking-widest px-8 py-4 text-sm hover:bg-gray-200 transition-colors duration-200"
        >
          Shop Now
        </Link>
      </section>

      {/* ── Our Story ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — story text */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Our Story</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-black mb-6 leading-tight">
              Born from a Passion for Design
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-5">
              Printed Soul was founded with a single belief: your phone case should say something about
              you. We set out to bring truly premium custom phone cases to India — cases that combine
              high-impact protection with artistic expression that you simply can't find anywhere else.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              We obsess over quality, not quantity. Every product — from our dual-layer protection cases
              to our tempered glass and metal editions — goes through rigorous quality checks before it
              reaches you. With 500+ unique designs and growing, we're here to help you find the one
              that's unmistakably yours.
            </p>
          </div>

          {/* Right — stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-black text-white rounded-none p-6 flex flex-col items-center justify-center text-center"
              >
                <span className="text-3xl font-black mb-2">{s.value}</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three Pillars ──────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 text-center mb-3">
            Why Printed Soul
          </p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-black text-center mb-12 leading-tight">
            Our Three Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="bg-white border border-gray-100 p-8 flex flex-col items-start gap-4 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="text-black">{p.icon}</div>
                <h3 className="text-lg font-black uppercase tracking-widest text-black">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ───────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6 border-t border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{b.emoji}</span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-700">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-24 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-6 leading-tight">
          Ready to Make It Yours?
        </h2>
        <p className="text-gray-400 text-base mb-10 max-w-md mx-auto">
          Browse our collection and find the perfect case that speaks to who you are.
        </p>
        <Link
          to="/products"
          className="bg-white text-black font-black uppercase tracking-widest px-8 py-4 text-sm hover:bg-gray-200 transition-colors duration-200 inline-block"
        >
          Explore Products
        </Link>
      </section>
    </>
  )
}