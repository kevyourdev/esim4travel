import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/customers/orders', {
        credentials: 'include'
      });

      if (response.status === 401) {
        navigate('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrderDetails(data);
      setSelectedOrder(orderId);
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const fetchQRCodes = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/qr-code`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR codes');
      }

      const data = await response.json();
      setQrCodes(data.qrCodes);
      setShowQRModal(true);
    } catch (err) {
      console.error('Error fetching QR codes:', err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReceipt = (order) => {
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order #${order.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #0D9488; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #0D9488; }
          .order-info { background: #F0FDFA; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .order-info h2 { margin: 0 0 10px 0; color: #134E4A; }
          .order-info p { margin: 5px 0; color: #374151; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
          th { background: #F9FAFB; font-weight: 600; color: #374151; }
          .total-row { font-weight: bold; font-size: 18px; }
          .total-row td { border-top: 2px solid #0D9488; padding-top: 15px; }
          .footer { text-align: center; color: #6B7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
          .status-completed { background: #D1FAE5; color: #065F46; }
          .status-pending { background: #FEF3C7; color: #92400E; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">eSIM4Travel</div>
          <p style="color: #6B7280; margin-top: 5px;">Travel eSIM Data Plans</p>
        </div>

        <div class="order-info">
          <h2>Order Receipt</h2>
          <p><strong>Order Number:</strong> #${order.id}</p>
          <p><strong>Date:</strong> ${formatDate(order.created_at)}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Status:</strong> <span class="status status-${order.status}">${order.status.toUpperCase()}</span></p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Package</th>
              <th>Qty</th>
              <th style="text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.destination_name}</td>
                <td>${item.package_name}</td>
                <td>${item.quantity}</td>
                <td style="text-align: right;">$${item.total_price.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3"><strong>Subtotal</strong></td>
              <td style="text-align: right;">$${order.subtotal.toFixed(2)}</td>
            </tr>
            ${order.discount > 0 ? `
              <tr style="color: #059669;">
                <td colspan="3">Discount</td>
                <td style="text-align: right;">-$${order.discount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr class="total-row">
              <td colspan="3">Total</td>
              <td style="text-align: right; color: #0D9488;">$${order.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Thank you for choosing eSIM4Travel!</p>
          <p>For support, visit: support@esim4travel.com</p>
          <p style="margin-top: 15px; font-size: 12px;">This receipt was generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print/save
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    // Give it a moment to render, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">View and manage your eSIM orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/destinations')}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
            >
              Browse Destinations
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Orders List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 bg-teal-600 text-white font-semibold">
                  Order History ({orders.length})
                </div>
                <div className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => fetchOrderDetails(order.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                        selectedOrder === order.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-gray-900">
                          Order #{order.id}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {formatDate(order.created_at)}
                      </div>
                      <div className="text-lg font-bold text-teal-600">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Details */}
            <div className="lg:col-span-2">
              {orderDetails ? (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Order #{orderDetails.id}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Placed on {formatDate(orderDetails.created_at)}
                        </p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getStatusBadgeClass(orderDetails.status)}`}>
                        {orderDetails.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Customer Email */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Customer Email</h3>
                      <p className="text-gray-600">{orderDetails.email}</p>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {orderDetails.items && orderDetails.items.map((item, index) => (
                          <div key={index} className="flex items-start justify-between border-b border-gray-200 pb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{item.destination_name}</h4>
                              <p className="text-sm text-gray-600">{item.package_name}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">${item.total_price.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">${item.unit_price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">${orderDetails.subtotal.toFixed(2)}</span>
                      </div>
                      {orderDetails.discount > 0 && (
                        <div className="flex justify-between mb-2 text-green-600">
                          <span>Discount</span>
                          <span>-${orderDetails.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span className="text-teal-600">${orderDetails.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      {/* Download Receipt Button */}
                      <button
                        onClick={() => downloadReceipt(orderDetails)}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Receipt
                      </button>

                      {/* QR Code Button */}
                      {orderDetails.status === 'completed' && (
                        <button
                          onClick={() => fetchQRCodes(orderDetails.id)}
                          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                        >
                          View QR Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Your QR Codes</h2>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                {qrCodes.map((qr, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <h3 className="font-semibold text-gray-900 mb-4">{qr.destination}</h3>
                    <div className="flex items-center justify-center bg-gray-100 p-8 rounded-lg mb-4">
                      <div className="w-48 h-48 bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                        QR Code Placeholder
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Package:</strong> {qr.package}</p>
                      <p><strong>Activation Code:</strong> {qr.activationCode}</p>
                    </div>
                    <button
                      onClick={() => {
                        const data = `Order QR Code\nDestination: ${qr.destination}\nPackage: ${qr.package}\nActivation: ${qr.activationCode}`;
                        const blob = new Blob([data], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `qr-code-${qr.destination.toLowerCase().replace(/\s+/g, '-')}.txt`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                      }}
                      className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
                    >
                      Download QR Code Info
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;
