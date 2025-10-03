"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="hero relative">
      {/* Background */}
      <div className="hero-background relative">
        <img
          src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad"
          alt="SecureBank Finance Background"
          className="hero-image w-full h-[500px] object-cover"
        />
        <div className="hero-overlay absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="hero-content absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="hero-content-inner max-w-3xl text-white">
          <div className="badge inline-block bg-blue-600 text-white px-4 py-1 rounded-full mb-4">
            Your Trusted Digital Banking Partner
          </div>

          <h1 className="hero-title text-4xl md:text-6xl font-bold mb-4">
            Banking Made <span className="text-blue-400">Secure</span>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl mb-6 text-gray-100">
            Manage your accounts, transfer money, and stay in control of your finances with SecureBank.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons flex gap-4 justify-center mb-10">
            <button
              className="btn btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push("/signup")}
            >
              Sign In
            </button>
            <button
              className="btn btn-outline px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600"
              onClick={() => router.push("/login")}
            >
              Log In
            </button>
          </div>

          {/* Stats */}
          <div className="stats grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat">
              <div className="stat-number text-2xl font-bold">1M+</div>
              <div className="stat-label text-gray-200">Active Customers</div>
            </div>
            <div className="stat">
              <div className="stat-number text-2xl font-bold">500+</div>
              <div className="stat-label text-gray-200">Bank Branches</div>
            </div>
            <div className="stat">
              <div className="stat-number text-2xl font-bold">24/7</div>
              <div className="stat-label text-gray-200">Online Support</div>
            </div>
            <div className="stat">
              <div className="stat-number text-2xl font-bold">100%</div>
              <div className="stat-label text-gray-200">Secure Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
