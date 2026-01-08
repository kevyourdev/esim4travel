export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using eSIM4Travel's services, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              eSIM4Travel provides digital eSIM data packages for mobile connectivity in various countries and regions.
              Our services include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Digital eSIM profiles for instant activation</li>
              <li>Data-only mobile connectivity (no voice or SMS)</li>
              <li>Coverage in 190+ destinations worldwide</li>
              <li>Regional multi-country packages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Device Compatibility</h2>
            <p className="text-gray-700 leading-relaxed">
              eSIMs are only compatible with unlocked devices that support eSIM technology. It is the customer's
              responsibility to verify their device compatibility before purchase. We do not offer refunds for
              incompatible devices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Activation and Usage</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Upon purchase, you will receive a QR code via email for eSIM installation. The validity period
              begins upon first connection to a supported network. Data packages have the following limitations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Validity periods are non-extendable</li>
              <li>Unused data does not roll over</li>
              <li>QR codes are single-use and non-transferable</li>
              <li>Fair usage policies apply to unlimited plans</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment and Pricing</h2>
            <p className="text-gray-700 leading-relaxed">
              All prices are displayed in USD and include applicable taxes. Payment is required at the time of
              purchase. We accept major credit cards, PayPal, and Apple Pay. Promotional codes cannot be combined
              and are subject to terms and expiration dates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              Refunds are only available for unused eSIMs that have not been installed or activated. Once a QR code
              has been scanned and the eSIM profile installed, the purchase is considered final. Please see our
              Refund Policy page for complete details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to provide reliable service, we cannot guarantee uninterrupted coverage in all
              locations. Network availability and speeds depend on local carrier infrastructure and may vary.
              We are not liable for service disruptions beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy and Data</h2>
            <p className="text-gray-700 leading-relaxed">
              We collect and process personal information in accordance with our Privacy Policy. By using our
              services, you consent to such processing and warrant that all data provided is accurate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              eSIM4Travel shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages resulting from your use or inability to use the service. Our total liability shall not exceed
              the amount paid for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon
              posting to our website. Continued use of our services constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms and Conditions, please contact our support team at
              support@esim4travel.com or visit our Help Center.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Last updated: January 2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}
