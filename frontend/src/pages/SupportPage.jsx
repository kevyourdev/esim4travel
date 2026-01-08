import { useState } from 'react';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('ios');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    category: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const iosSteps = [
    {
      step: 1,
      title: 'Check Device Compatibility',
      description: 'Ensure your iPhone is unlocked and supports eSIM (iPhone XS/XR and newer).'
    },
    {
      step: 2,
      title: 'Ensure Internet Connection',
      description: 'Connect to WiFi or use mobile data before starting the installation.'
    },
    {
      step: 3,
      title: 'Open Settings',
      description: 'Go to Settings > Cellular or Mobile Data.'
    },
    {
      step: 4,
      title: 'Add Cellular Plan',
      description: 'Tap "Add Cellular Plan" or "Add eSIM".'
    },
    {
      step: 5,
      title: 'Scan QR Code',
      description: 'Use your camera to scan the QR code sent to your email.'
    },
    {
      step: 6,
      title: 'Label Your Plan',
      description: 'Give your eSIM a label (e.g., "Travel Data").'
    },
    {
      step: 7,
      title: 'Select Default Line',
      description: 'Choose which line to use for cellular data and calls.'
    },
    {
      step: 8,
      title: 'Activate eSIM',
      description: 'Your eSIM will activate automatically. You\'re ready to go!'
    }
  ];

  const androidSteps = [
    {
      step: 1,
      title: 'Check Device Compatibility',
      description: 'Ensure your Android device supports eSIM (Pixel 3 and newer, Samsung S20+, etc.).'
    },
    {
      step: 2,
      title: 'Connect to WiFi',
      description: 'Make sure you have an active internet connection.'
    },
    {
      step: 3,
      title: 'Open Settings',
      description: 'Go to Settings > Network & Internet > Mobile Network.'
    },
    {
      step: 4,
      title: 'Add Mobile Network',
      description: 'Tap the "+" icon to add a new network or "Download a SIM instead".'
    },
    {
      step: 5,
      title: 'Scan QR Code',
      description: 'Select "Scan QR code" and use your camera to scan the QR code from your email.'
    },
    {
      step: 6,
      title: 'Enable eSIM',
      description: 'Turn on your new eSIM plan and enable mobile data.'
    },
    {
      step: 7,
      title: 'Activation Complete',
      description: 'Your eSIM is now active and ready to use!'
    }
  ];

  const compatibleDevices = {
    iphone: [
      'iPhone 15, 15 Plus, 15 Pro, 15 Pro Max',
      'iPhone 14, 14 Plus, 14 Pro, 14 Pro Max',
      'iPhone 13, 13 mini, 13 Pro, 13 Pro Max',
      'iPhone 12, 12 mini, 12 Pro, 12 Pro Max',
      'iPhone 11, 11 Pro, 11 Pro Max',
      'iPhone XS, XS Max, XR',
      'iPhone SE (2020, 2022)'
    ],
    ipad: [
      'iPad Pro 11-inch (all models)',
      'iPad Pro 12.9-inch (3rd generation and later)',
      'iPad Air (3rd generation and later)',
      'iPad (7th generation and later)',
      'iPad Mini (5th generation and later)'
    ],
    android: [
      'Google Pixel 3, 3 XL, 3a, 3a XL',
      'Google Pixel 4, 4 XL, 4a, 4a 5G',
      'Google Pixel 5, 5a',
      'Google Pixel 6, 6 Pro, 6a',
      'Google Pixel 7, 7 Pro, 7a',
      'Google Pixel 8, 8 Pro',
      'Samsung Galaxy S20, S20+, S20 Ultra',
      'Samsung Galaxy S21, S21+, S21 Ultra',
      'Samsung Galaxy S22, S22+, S22 Ultra',
      'Samsung Galaxy S23, S23+, S23 Ultra',
      'Samsung Galaxy Z Flip, Z Flip3, Z Flip4',
      'Samsung Galaxy Z Fold, Z Fold2, Z Fold3, Z Fold4',
      'Samsung Galaxy Note 20, Note 20 Ultra'
    ]
  };

  const faqItems = [
    {
      question: 'My eSIM isn\'t activating. What should I do?',
      answer: 'First, ensure you have a stable internet connection (WiFi recommended). Check that your device is unlocked and eSIM compatible. Try restarting your device and scanning the QR code again. If the issue persists, contact our support team.'
    },
    {
      question: 'I accidentally deleted my eSIM. Can I reinstall it?',
      answer: 'Yes! Simply go back to your order confirmation email and scan the QR code again. Your eSIM can be reinstalled multiple times on the same device. Note: Once installed on a device, it cannot be transferred to another device.'
    },
    {
      question: 'Why is my data not working?',
      answer: 'Make sure your eSIM is enabled in your device settings and that "Data Roaming" is turned ON. Also verify that you\'re in an area with network coverage. Go to Settings > Cellular/Mobile Data and ensure your eSIM is selected for cellular data.'
    },
    {
      question: 'Can I use my eSIM with my regular SIM card?',
      answer: 'Yes! Most eSIM-compatible devices support dual SIM functionality, allowing you to use both your regular SIM and eSIM simultaneously. You can choose which line to use for calls, messages, and data in your device settings.'
    },
    {
      question: 'My eSIM is installed but showing "No Service"',
      answer: 'This can happen if you\'re outside the coverage area or if the eSIM hasn\'t fully activated yet. Wait a few minutes and restart your device. Ensure that airplane mode is OFF and that you\'re in a covered destination. Check your data allowance hasn\'t been exhausted.'
    },
    {
      question: 'How do I check my remaining data?',
      answer: 'Most devices show data usage in Settings > Cellular/Mobile Data. However, this may not be 100% accurate. For the most accurate reading, you can log into your account on our website or contact support with your order number.'
    },
    {
      question: 'The QR code won\'t scan. What are my options?',
      answer: 'If the QR code won\'t scan, you can manually enter the activation code. In your device settings, select "Enter Details Manually" instead of scanning. You\'ll need the SM-DP+ Address and Activation Code from your order email.'
    },
    {
      question: 'Can I top up my eSIM data?',
      answer: 'Currently, our eSIMs are one-time use and cannot be topped up. Once your data or validity period expires, you\'ll need to purchase a new eSIM. We\'re working on rechargeable eSIM options for the future.'
    }
  ];

  const handleFaqClick = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.category) {
      errors.category = 'Please select an issue category';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:3001/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          orderId: formData.orderNumber || null,
          category: formData.category,
          subject: `Support Request - ${formData.category}`,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit support request');
      }

      const data = await response.json();
      console.log('Support ticket created:', data);
      setFormSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          orderNumber: '',
          category: '',
          message: ''
        });
        setFormSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setSubmitError('Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Support Center</h1>
          <p className="text-xl text-center text-teal-50">
            Get help with your eSIM installation and troubleshooting
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Installation Guides Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Installation Guides</h2>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('ios')}
                className={`pb-4 px-1 border-b-2 font-medium text-lg transition-colors ${
                  activeTab === 'ios'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📱 iOS / iPhone
              </button>
              <button
                onClick={() => setActiveTab('android')}
                className={`pb-4 px-1 border-b-2 font-medium text-lg transition-colors ${
                  activeTab === 'android'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🤖 Android
              </button>
            </div>
          </div>

          {/* iOS Installation Steps */}
          {activeTab === 'ios' && (
            <div className="space-y-6">
              {iosSteps.map((step) => (
                <div key={step.step} className="bg-white rounded-lg shadow-sm p-6 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0 hidden md:block">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      Screenshot
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Android Installation Steps */}
          {activeTab === 'android' && (
            <div className="space-y-6">
              {androidSteps.map((step) => (
                <div key={step.step} className="bg-white rounded-lg shadow-sm p-6 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0 hidden md:block">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      Screenshot
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Compatible Devices Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">eSIM Compatible Devices</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-2">📱</span> iPhone
              </h3>
              <ul className="space-y-2 text-gray-600">
                {compatibleDevices.iphone.map((device, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    {device}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-2">📲</span> iPad
              </h3>
              <ul className="space-y-2 text-gray-600">
                {compatibleDevices.ipad.map((device, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    {device}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-2">🤖</span> Android
              </h3>
              <ul className="space-y-2 text-gray-600">
                {compatibleDevices.android.map((device, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-teal-600 mr-2">✓</span>
                    {device}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Video Tutorials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-300 h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-5xl mb-2">▶️</div>
                  <div className="text-sm">Video Player</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  How to Install eSIM on iPhone
                </h3>
                <p className="text-sm text-gray-600">Step-by-step installation guide for iOS devices</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-300 h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-5xl mb-2">▶️</div>
                  <div className="text-sm">Video Player</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  How to Install eSIM on Android
                </h3>
                <p className="text-sm text-gray-600">Complete guide for Android eSIM activation</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-300 h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-5xl mb-2">▶️</div>
                  <div className="text-sm">Video Player</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Troubleshooting Common Issues
                </h3>
                <p className="text-sm text-gray-600">Solutions to the most common eSIM problems</p>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Troubleshooting FAQ</h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => handleFaqClick(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaqIndex === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Support</h2>
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    placeholder="ORD-123456"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    <option value="installation">Installation Help</option>
                    <option value="activation">Activation Issues</option>
                    <option value="connectivity">Connectivity Problems</option>
                    <option value="billing">Billing Questions</option>
                    <option value="refund">Refund Request</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent ${
                      formErrors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please describe your issue in detail..."
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                  )}
                </div>

                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Support Hours:</strong> 24/7 via email
              </p>
              <p className="text-sm text-gray-600">
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Mock Live Chat Widget */}
      {!chatOpen ? (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 transition-all hover:scale-110 z-50"
          aria-label="Open live chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl w-80 z-50">
          <div className="bg-teal-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Live Chat (Demo)</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 h-64 bg-gray-50 overflow-y-auto">
            <div className="mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm inline-block">
                <p className="text-sm text-gray-700">
                  👋 Hello! This is a demo chat widget. In production, you would be connected to a live support agent.
                </p>
              </div>
            </div>
            <div className="mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm inline-block">
                <p className="text-sm text-gray-700">
                  For real support, please use the contact form above or email us at support@esim4travel.com
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message... (demo only)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                disabled
              />
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
