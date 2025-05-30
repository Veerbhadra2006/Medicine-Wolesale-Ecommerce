import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../common/SummaryApi';
import moment from 'moment';
import { toast } from 'react-toastify';
import AxiosToastError from '../utils/AxiosToastError';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload?.role || '');
      } catch (err) {
        console.error("Failed to parse token", err);
      }
    }
  }, []);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/order/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      setOrders(res.data.data || []);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, currentStatus) => {
    const statusFlow = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

    const currentIndex = statusFlow.indexOf(currentStatus);
    const newIndex = statusFlow.indexOf(newStatus);

    // Prevent backward status movement
    if (newIndex < currentIndex) {
      toast.warning("You can't move status backwards!");
      return;
    }

    // Prevent status change if already delivered or cancelled
    if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') {
      toast.warning(`Status is already '${currentStatus}', can't change it now.`);
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/api/order/admin/order/update-status`,
        { orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      fetchAllOrders();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const groupedOrders = orders.reduce((acc, order) => {
    const date = moment(order.createdAt).format('DD/MM/YY');
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  const statusColor = {
    'Order Placed': 'text-yellow-500',
    'Confirmed': 'text-blue-500',
    'Preparing': 'text-indigo-500',
    'Out for Delivery': 'text-teal-600',
    'Delivered': 'text-green-400',
    'Cancelled': 'text-red-600',
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All User Orders</h2>

      {Object.keys(groupedOrders).map((date) => (
        <div key={date}>
          <h3 className="bg-gray-100 p-2 font-semibold text-gray-800 rounded">
            Orders on {date}
          </h3>

          {groupedOrders[date].map((order, index) => (
            <div key={order._id + index} className="border-b py-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <p>Order No: {order?.orderId}</p>
                <p className="text-gray-500">{moment(order.createdAt).format('hh:mm A')}</p>
              </div>

              <div className="flex gap-4 items-start mt-2">
                <img
                  src={order.product_details.image[0]}
                  alt="Product"
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{order.product_details.name}</p>

                  <p>
                    <span className="font-semibold">User:</span>{' '}
                    {order.userId?.name || 'N/A'} | {order.userId?.email || 'N/A'} |{' '}
                    {order.userId?.phone || '⚠️ Mobile number not Added in Profile'}
                  </p>

                  <p>
                    <span className="font-semibold">Payment:</span>{' '}
                    {order.payment_status === 'CASH ON DELIVERY' ? (
                      <span className="text-orange-600">Pay ₹{order.totalAmt} on delivery</span>
                    ) : (
                      <span className="text-green-600">Amount Paid ₹{order.totalAmt}</span>
                    )}
                  </p>

                  <p>
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`font-semibold ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </p>

                  <p className="whitespace-pre-wrap break-words">
                    <span className="font-semibold">Delivery Address:</span>{' '}
                    {order.delivery_address?.address_line
                      ? `${order.delivery_address.address_line}, ${order.delivery_address.city}, ${order.delivery_address.state}, ${order.delivery_address.country} - ${order.delivery_address.pincode},` : 'N/A'}
                    {order.delivery_address?.mobile && (
                      <>
                        <br />
                        <span className="font-semibold">Mobile:</span> {order.delivery_address.mobile}
                      </>
                    )}
                  </p>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    {['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((statusOption) => (
                      <button
                        key={statusOption}
                        className={`text-xs px-2 py-1 rounded border ${order.status === statusOption
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                          }`}
                        onClick={() => handleStatusUpdate(order.orderId, statusOption, order.status)}
                      >
                        {statusOption}
                      </button>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
