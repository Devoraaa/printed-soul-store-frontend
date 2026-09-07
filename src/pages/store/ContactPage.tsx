import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from "lucide-react"
import { SEO } from "../../components/ui/SEO"

export function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("Order Issue")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
    } catch {
      // intentionally ignored — we show success regardless
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  return (
    <>
      <SEO
        title="Contact Us | Printed Soul"
        description="Get in touch with Printed Soul. We're here to help with your order, custom cases, or any queries."
        canonicalUrl="https://printedsoul.in/contact"
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Get In Touch</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest leading-tight">
          We're Here to Help
        </h1>
      </section>

      {/* ── Two-column layout ──────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* ── LEFT: Contact info ────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="border border-gray-100 p-6 flex gap-4 items-start hover:shadow-md transition-shadow duration-200">
              <div className="bg-black p-3 text-white shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                <a
                  href="mailto:support@printedsoul.in"
                  className="text-black font-semibold hover:underline text-sm"
                >
                  support@printedsoul.in
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="border border-gray-100 p-6 flex gap-4 items-start hover:shadow-md transition-shadow duration-200">
              <div className="bg-black p-3 text-white shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                    WhatsApp
                  </p>
                  <p className="text-black font-semibold text-sm">+91 9999999999</p>
                </div>
                <a
                  href="https://wa.me/919999999999?text=Hi%20Printed%20Soul%2C%20I%20need%20help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-gray-800 transition-colors duration-200 w-fit"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="border border-gray-100 p-6 flex gap-4 items-start hover:shadow-md transition-shadow duration-200">
              <div className="bg-black p-3 text-white shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                  Location
                </p>
                <p className="text-black font-semibold text-sm">Mumbai, Maharashtra, India</p>
              </div>
            </div>

            {/* Hours */}
            <div className="border border-gray-100 p-6 flex gap-4 items-start hover:shadow-md transition-shadow duration-200">
              <div className="bg-black p-3 text-white shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                  Business Hours
                </p>
                <p className="text-black font-semibold text-sm">Mon–Sat: 9AM to 6PM IST</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Contact form ───────────────────────────────────── */}
          <div>
            {isSubmitted ? (
              <div className="border border-gray-100 p-10 flex flex-col items-center justify-center text-center gap-5 min-h-[400px]">
                <CheckCircle className="w-14 h-14 text-green-500" />
                <h3 className="text-2xl font-black uppercase tracking-widest text-black">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setName("")
                    setEmail("")
                    setSubject("Order Issue")
                    setMessage("")
                  }}
                  className="mt-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black underline transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border border-gray-100 p-8 flex flex-col gap-5"
              >
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors placeholder-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white text-gray-700"
                  >
                    <option>Order Issue</option>
                    <option>Product Query</option>
                    <option>Custom Order Request</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={20}
                    rows={5}
                    placeholder="Tell us how we can help you... (min. 20 characters)"
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none placeholder-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-black text-white font-black uppercase tracking-widest px-6 py-4 text-sm hover:bg-gray-900 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending…</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}