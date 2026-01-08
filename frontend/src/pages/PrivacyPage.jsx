export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Email address (required for eSIM delivery)</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Order history and purchase details</li>
              <li>Device information and compatibility data</li>
              <li>Communication preferences and support inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Process and deliver your eSIM orders</li>
              <li>Send order confirmations and QR codes</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send important service updates and notifications</li>
              <li>Improve our products and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Mobile network operators to provision eSIM services</li>
              <li>Payment processors to handle transactions</li>
              <li>Cloud service providers for data storage</li>
              <li>Analytics services to improve our website</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. This includes
              encryption of sensitive data, secure servers, and regular security audits. However, no method of
              transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Maintain your shopping cart and session</li>
              <li>Remember your preferences</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Personalize your experience</li>
              <li>Serve relevant advertisements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can control cookies through your browser settings, but disabling certain cookies may limit
              website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise these rights, please contact us at privacy@esim4travel.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and comply with
              legal obligations. Order history and transaction records are kept for a minimum of 7 years for
              accounting and tax purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to children under 13 years of age. We do not knowingly collect personal
              information from children. If you become aware that a child has provided us with personal information,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure
              appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by
              email or through a notice on our website. Please review this policy periodically for updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-3 text-gray-700">
              <p>Email: privacy@esim4travel.com</p>
              <p>Support: support@esim4travel.com</p>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Last updated: January 2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}
