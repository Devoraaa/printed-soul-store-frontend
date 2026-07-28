import React from "react"
import { Outlet, Link } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-violet-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-indigo-400 blur-3xl" />
        </div>
        <div className="relative text-white text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-xl">PS</span>
            </div>
            <span className="text-2xl font-bold">Printed Soul</span>
          </Link>
          <h2 className="text-4xl font-bold mb-4">Express Yourself</h2>
          <p className="text-indigo-200 text-lg max-w-sm mx-auto">
            Premium custom phone cases designed for every personality and every device.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {["1000+", "50+", "4.9★"].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-xl font-bold">{stat}</div>
                <div className="text-xs text-indigo-200">{["Designs", "Devices", "Rating"][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="font-bold text-lg">Printed Soul</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
