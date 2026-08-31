import axios from "axios"

// Dev: Vite proxy handles "/api" → localhost:5000
// Production (VPS): set VITE_API_URL=https://api.yourdomain.com in .env
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pss_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pss_token")
      localStorage.removeItem("pss_user")
      // Redirect to login only if not already there
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  sendOtp: (data: any) => api.post("/auth/send-otp", data),
  verifyOtp: (data: any) => api.post("/auth/verify-otp", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateMe: (data: any) => api.put("/auth/me", data),
  updatePassword: (data: any) => api.put("/auth/update-password", data),
  forgotPassword: (data: any) => api.post("/auth/forgot-password", data),
}

// ── Products ──────────────────────────────────────────────────────────────
export const productApi = {
  getAll: (params?: any) => api.get("/products", { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  getFeatured: () => api.get("/products/featured"),
  getByDevice: (deviceSlug: string) => api.get(`/products/by-device/${deviceSlug}`),
  getDesignVariants: (designSlug: string, deviceModel?: string) => api.get(`/products/design/${designSlug}`, { params: { deviceModel } }),
  // Admin
  adminGetAll: (params?: any) => api.get("/products/admin/all", { params }),
  create: (data: FormData) => api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id: string) => api.delete(`/products/${id}`),
  removeImage: (id: string, imageId: string) => api.delete(`/products/${id}/images/${imageId}`),
}

// ── Catalog ───────────────────────────────────────────────────────────────
export const catalogApi = {
  getBrands: () => api.get("/catalog/brands"),
  getCategories: () => api.get("/catalog/categories"),
  getCategoryBySlug: (slug: string) => api.get(`/catalog/categories/${slug}`),
  getDevices: (params?: any) => api.get("/catalog/devices", { params }),
  getDevicesByBrand: (brandSlug: string) => api.get(`/catalog/devices/brand/${brandSlug}`),
  // Admin CRUD
  createBrand: (data: FormData) => api.post("/catalog/brands", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateBrand: (id: string, data: FormData) => api.put(`/catalog/brands/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteBrand: (id: string) => api.delete(`/catalog/brands/${id}`),
  createCategory: (data: FormData) => api.post("/catalog/categories", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateCategory: (id: string, data: FormData) => api.put(`/catalog/categories/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteCategory: (id: string) => api.delete(`/catalog/categories/${id}`),
  createDevice: (data: any) => api.post("/catalog/devices", data),
  updateDevice: (id: string, data: any) => api.put(`/catalog/devices/${id}`, data),
  deleteDevice: (id: string) => api.delete(`/catalog/devices/${id}`),
}

// ── Cart ──────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get("/cart"),
  add: (productId: string, quantity: number) => api.post("/cart", { productId, quantity }),
  update: (productId: string, quantity: number) => api.put("/cart", { productId, quantity }),
  remove: (productId: string) => api.delete(`/cart/${productId}`),
  clear: () => api.delete("/cart/clear"),
}

// ── Orders ────────────────────────────────────────────────────────────────
export const orderApi = {
  create: (data: any) => api.post("/orders", data),
  verifyPayment: (data: any) => api.post("/orders/razorpay/verify", data),
  getMyOrders: (params?: any) => api.get("/orders/my", { params }),
  getMyOrderById: (id: string) => api.get(`/orders/my/${id}`),
  cancelOrder: (id: string, reason?: string) => api.put(`/orders/my/${id}/cancel`, { reason }),
  trackOrder: (query: string) => api.get(`/orders/track/${query}`),
  // Admin
  adminGetAll: (params?: any) => api.get("/orders/admin", { params }),
  adminGetById: (id: string) => api.get(`/orders/admin/${id}`),
  adminUpdateStatus: (id: string, data: any) => api.put(`/orders/admin/${id}/status`, data),
  getStats: () => api.get("/orders/admin/stats"),
}

// ── Addresses ─────────────────────────────────────────────────────────────
export const addressApi = {
  getAll: () => api.get("/user/addresses"),
  create: (data: any) => api.post("/user/addresses", data),
  update: (id: string, data: any) => api.put(`/user/addresses/${id}`, data),
  delete: (id: string) => api.delete(`/user/addresses/${id}`),
}

// ── Reviews ───────────────────────────────────────────────────────────────
export const reviewApi = {
  getForProduct: (productId: string) => api.get(`/user/reviews/${productId}`),
  create: (data: any) => api.post("/user/reviews", data),
  adminGetAll: () => api.get("/user/admin/reviews"),
  approve: (id: string) => api.put(`/user/admin/reviews/${id}/approve`),
  delete: (id: string) => api.delete(`/user/admin/reviews/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getRevenueAnalytics: (days?: number) => api.get("/admin/analytics/revenue", { params: { days } }),
  getOrdersByStatus: () => api.get("/admin/analytics/orders-by-status"),
  getTopProducts: () => api.get("/admin/analytics/top-products"),
  getCustomers: (params?: any) => api.get("/admin/customers", { params }),
  getCustomerById: (id: string) => api.get(`/admin/customers/${id}`),
  getLowStock: () => api.get("/admin/inventory/low-stock"),
  updateStock: (id: string, stock: number) => api.put(`/admin/inventory/${id}/stock`, { stock }),
  previewGeneration: (data: any) => api.post("/admin/automation/preview", data),
  generateProducts: (data: any) => api.post("/admin/automation/generate", data),
}

// ── Images ────────────────────────────────────────────────────────────────
export const imageApi = {
  getUrl: (id: string) => `/api/images/${id}`,
  upload: (file: File) => {
    const form = new FormData()
    form.append("image", file)
    return api.post("/images/upload", form, { headers: { "Content-Type": "multipart/form-data" } })
  },
}

// ── Banners ───────────────────────────────────────────────────────────────
export const bannerApi = {
  getAll: () => api.get("/banners"),
}

// ── Social Posts ──────────────────────────────────────────────────────────
export const socialPostApi = {
  getActive: () => api.get("/social-posts/active"),
}
