import { useState, useEffect } from 'react'

// List of known eSIM-compatible devices
const ESIM_COMPATIBLE_DEVICES = {
  Apple: [
    'iPhone XS', 'iPhone XS Max', 'iPhone XR',
    'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
    'iPhone 12', 'iPhone 12 Mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
    'iPhone 13', 'iPhone 13 Mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
    'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
    'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
    'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max',
    'iPhone SE (2nd generation)', 'iPhone SE (3rd generation)',
    'iPad Pro (11-inch)', 'iPad Pro (12.9-inch)',
    'iPad Air (3rd generation)', 'iPad Air (4th generation)', 'iPad Air (5th generation)',
    'iPad (7th generation)', 'iPad (8th generation)', 'iPad (9th generation)', 'iPad (10th generation)',
    'iPad Mini (5th generation)', 'iPad Mini (6th generation)',
    'Apple Watch Series 3', 'Apple Watch Series 4', 'Apple Watch Series 5',
    'Apple Watch Series 6', 'Apple Watch SE', 'Apple Watch Series 7',
    'Apple Watch Series 8', 'Apple Watch Ultra', 'Apple Watch Series 9', 'Apple Watch Ultra 2'
  ],
  Samsung: [
    'Galaxy S20', 'Galaxy S20+', 'Galaxy S20 Ultra',
    'Galaxy S21', 'Galaxy S21+', 'Galaxy S21 Ultra',
    'Galaxy S22', 'Galaxy S22+', 'Galaxy S22 Ultra',
    'Galaxy S23', 'Galaxy S23+', 'Galaxy S23 Ultra',
    'Galaxy S24', 'Galaxy S24+', 'Galaxy S24 Ultra',
    'Galaxy Z Fold', 'Galaxy Z Fold 2', 'Galaxy Z Fold 3', 'Galaxy Z Fold 4', 'Galaxy Z Fold 5',
    'Galaxy Z Flip', 'Galaxy Z Flip 3', 'Galaxy Z Flip 4', 'Galaxy Z Flip 5',
    'Galaxy Note 20', 'Galaxy Note 20 Ultra',
    'Galaxy A54 5G', 'Galaxy A34 5G'
  ],
  Google: [
    'Pixel 2', 'Pixel 2 XL',
    'Pixel 3', 'Pixel 3 XL', 'Pixel 3a', 'Pixel 3a XL',
    'Pixel 4', 'Pixel 4 XL', 'Pixel 4a', 'Pixel 4a 5G',
    'Pixel 5', 'Pixel 5a',
    'Pixel 6', 'Pixel 6 Pro', 'Pixel 6a',
    'Pixel 7', 'Pixel 7 Pro', 'Pixel 7a',
    'Pixel 8', 'Pixel 8 Pro', 'Pixel 8a',
    'Pixel Fold'
  ],
  Motorola: [
    'Razr 2019', 'Razr 5G', 'Razr 2022', 'Razr+ 2023',
    'Edge+', 'Edge 30 Pro', 'Edge 40 Pro'
  ],
  Huawei: [
    'P40', 'P40 Pro', 'P40 Pro+',
    'Mate 40', 'Mate 40 Pro',
    'Watch 2 Pro'
  ],
  Other: [
    'Oppo Find X3 Pro', 'Oppo Find X5 Pro',
    'OnePlus 11', 'OnePlus 12',
    'Xiaomi 12T Pro', 'Xiaomi 13', 'Xiaomi 13 Pro',
    'Sony Xperia 1 IV', 'Sony Xperia 1 V', 'Sony Xperia 5 IV'
  ]
}

export default function DeviceCompatibilityChecker({ isOpen, onClose }) {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedDevice, setSelectedDevice] = useState('')
  const [checkResult, setCheckResult] = useState(null)
  const [detectedDevice, setDetectedDevice] = useState(null)

  // Auto-detect device on mount
  useEffect(() => {
    if (isOpen) {
      detectDevice()
    }
  }, [isOpen])

  const detectDevice = () => {
    const userAgent = navigator.userAgent

    // Simple detection based on user agent
    if (/iPhone/.test(userAgent)) {
      setDetectedDevice({ brand: 'Apple', type: 'iPhone' })
      setSelectedBrand('Apple')
    } else if (/iPad/.test(userAgent)) {
      setDetectedDevice({ brand: 'Apple', type: 'iPad' })
      setSelectedBrand('Apple')
    } else if (/Samsung/.test(userAgent)) {
      setDetectedDevice({ brand: 'Samsung', type: 'Samsung device' })
      setSelectedBrand('Samsung')
    } else if (/Pixel/.test(userAgent)) {
      setDetectedDevice({ brand: 'Google', type: 'Pixel device' })
      setSelectedBrand('Google')
    } else if (/Android/.test(userAgent)) {
      setDetectedDevice({ brand: 'Android', type: 'Android device' })
    } else {
      setDetectedDevice(null)
    }
  }

  const handleCheck = () => {
    if (selectedDevice) {
      setCheckResult({
        compatible: true,
        device: selectedDevice
      })
    }
  }

  const handleReset = () => {
    setSelectedBrand('')
    setSelectedDevice('')
    setCheckResult(null)
  }

  if (!isOpen) return null

  const brands = Object.keys(ESIM_COMPATIBLE_DEVICES)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-card rounded-xl border-2 border-foreground shadow-hard-xl max-w-lg w-full animate-pop">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-full border-2 border-foreground flex items-center justify-center shadow-hard">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-heading font-extrabold text-foreground">Device Compatibility</h2>
                <p className="text-sm text-mutedForeground">Check if your device supports eSIM</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-muted border-2 border-foreground flex items-center justify-center hover:bg-secondary hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!checkResult ? (
              <>
                {/* Auto-detected device */}
                {detectedDevice && (
                  <div className="mb-6 p-4 bg-quaternary/20 rounded-lg border-2 border-quaternary">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-quaternary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-foreground font-medium">
                        Detected: <strong>{detectedDevice.type}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Brand Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-heading font-bold text-foreground mb-2">
                    Select Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value)
                      setSelectedDevice('')
                    }}
                    className="w-full px-4 py-3 border-2 border-foreground rounded-lg bg-input text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent shadow-hard-sm"
                  >
                    <option value="">Choose a brand...</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Device Selection */}
                {selectedBrand && (
                  <div className="mb-6">
                    <label className="block text-sm font-heading font-bold text-foreground mb-2">
                      Select Device
                    </label>
                    <select
                      value={selectedDevice}
                      onChange={(e) => setSelectedDevice(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-foreground rounded-lg bg-input text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-accent shadow-hard-sm"
                    >
                      <option value="">Choose your device...</option>
                      {ESIM_COMPATIBLE_DEVICES[selectedBrand].map(device => (
                        <option key={device} value={device}>{device}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Check Button */}
                <button
                  onClick={handleCheck}
                  disabled={!selectedDevice}
                  className="w-full bg-accent hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm text-white border-2 border-foreground py-3 px-6 rounded-full font-bold shadow-hard transition-all duration-300 ease-bouncy disabled:bg-mutedForeground disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                >
                  Check Compatibility
                </button>

                {/* Note */}
                <p className="mt-4 text-xs text-mutedForeground text-center">
                  Don't see your device? Most phones released after 2020 support eSIM.
                  Check your device settings for "Cellular" or "Mobile Data" options.
                </p>
              </>
            ) : (
              /* Results */
              <div className="text-center">
                {checkResult.compatible ? (
                  <>
                    <div className="w-20 h-20 bg-quaternary rounded-full border-2 border-foreground flex items-center justify-center mx-auto mb-4 shadow-hard">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-heading font-extrabold text-foreground mb-2">
                      Great News!
                    </h3>
                    <p className="text-mutedForeground mb-2">
                      Your <strong className="text-foreground">{checkResult.device}</strong> supports eSIM.
                    </p>
                    <p className="text-sm text-mutedForeground mb-6">
                      You can purchase and install eSIM data plans on your device.
                    </p>

                    {/* Installation Tips */}
                    <div className="bg-muted rounded-lg border-2 border-border p-4 mb-6 text-left">
                      <h4 className="font-heading font-bold text-foreground mb-2 text-sm">Quick Setup Tips:</h4>
                      <ul className="text-sm text-mutedForeground space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold">1.</span>
                          Go to Settings → Cellular/Mobile Data
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold">2.</span>
                          Select "Add eSIM" or "Add Cellular Plan"
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold">3.</span>
                          Scan the QR code we send you
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-secondary rounded-full border-2 border-foreground flex items-center justify-center mx-auto mb-4 shadow-hard">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-heading font-extrabold text-foreground mb-2">
                      Not Compatible
                    </h3>
                    <p className="text-mutedForeground mb-6">
                      Unfortunately, this device doesn't support eSIM technology.
                    </p>
                  </>
                )}

                <button
                  onClick={handleReset}
                  className="text-accent hover:text-accent/80 font-bold transition-colors"
                >
                  ← Check Another Device
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
