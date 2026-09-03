import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export function getImageUrl(img?: any): string {
  // Use VITE_IMAGE_URL if provided (e.g. for remote server images), else VITE_API_URL
  const apiUrl = import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000";
  if (!img) return "/placeholder.png"
  
  let url = "";
  if (typeof img === "object") {
    if (img.url) url = img.url
    else if (img._id) url = `/api/images/${img._id}`
  } else if (typeof img === "string") {
    url = img
    if (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:")) {
      url = `/api/images/${url}`
    }
  }

  if (url.startsWith("/uploads") || url.startsWith("/api/images/")) {
    // Prefix with backend URL for uploads and database images
    return `${apiUrl.replace(/\/$/, "")}${url}`
  }

  // If we have a remote image server configured (local dev) and path starts with /
  if (url.startsWith("/") && import.meta.env.VITE_IMAGE_URL) {
    return `${import.meta.env.VITE_IMAGE_URL.replace(/\/$/, "")}${url}`
  }
  
  return url || "/placeholder.png"
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + "..." : text
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const
