export default function Features() {
  return (
    <section className="difference-section py-16 bg-gray-50 dark:bg-black transition-colors">
      <div className="difference-container max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="section-header text-center mb-12">
          <h2 className="section-title text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Why Choose SecureBank?
          </h2>
          <p className="section-subtitle text-gray-600 dark:text-gray-300">
            Smart, fast, and secure banking for everyone.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid grid md:grid-cols-3 gap-6">
          {/* Customers */}
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="card-title text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              For Customers
            </h3>
            <ul className="feature-list space-y-2 text-gray-700 dark:text-gray-300">
              <li>✔ Open and manage accounts easily</li>
              <li>✔ 24/7 online banking</li>
              <li>✔ Instant fund transfers</li>
              <li>✔ Secure mobile access</li>
            </ul>
          </div>

          {/* Bankers */}
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="card-title text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              For Bankers
            </h3>
            <ul className="feature-list space-y-2 text-gray-700 dark:text-gray-300">
              <li>✔ Manage customers efficiently</li>
              <li>✔ Monitor transactions</li>
              <li>✔ Provide quick support</li>
              <li>✔ Secure client handling</li>
            </ul>
          </div>

          {/* Admins */}
          <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="card-title text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              For Admins
            </h3>
            <ul className="feature-list space-y-2 text-gray-700 dark:text-gray-300">
              <li>✔ Oversee bank operations</li>
              <li>✔ Manage user accounts</li>
              <li>✔ Ensure compliance & security</li>
              <li>✔ Generate financial reports</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
