import React from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/NoData';
import { baseURL } from '../common/SummaryApi';
import { toast } from 'react-toastify';
import AxiosToastError from '../utils/AxiosToastError';
import axios from 'axios';
import moment from 'moment';

const MyOrders = () => {
  const orders = useSelector((state) => state.orders.order);

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/order/cancel`,
        { orderId },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
          withCredentials: true,
        }
      );
      toast.success(res.data.message || 'Order cancelled successfully');
      window.location.reload();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const groupedOrders = orders.reduce((acc, order) => {
    const date = moment(order.createdAt).format('DD/MM/YY');
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'text-yellow-600';
      case 'Confirmed':
        return 'text-blue-600';
      case 'Preparing':
        return 'text-purple-600';
      case 'Out for Delivery':
        return 'text-green-500';
      case 'Delivered':
        return 'text-green-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className='p-4'>
      <div className='bg-white shadow-md p-3 font-semibold text-lg'>My Orders</div>

      {!orders[0] && <NoData />}

      {Object.keys(groupedOrders).map((date) => (
        <div key={date}>
          <h2 className='bg-gray-100 p-2 px-4 font-semibold text-gray-800 mt-4 rounded'>
            Orders on {date}
          </h2>

          {groupedOrders[date].map((order, index) => (
            <div key={order._id + index} className='border-b py-4'>
              <div className='flex justify-between items-center text-sm font-semibold'>
                <p>Order No: {order?.orderId}</p>
                <p className='text-gray-500'>
                  {moment(order.createdAt).format('hh:mm A')}
                </p>
              </div>

              <div className='flex gap-4 items-start mt-2'>
                <img
                  src={order.product_details.image[0]}
                  alt='Product'
                  className='w-16 h-16 rounded object-cover'
                />
                <div className='flex flex-col gap-1'>
                  <p className='font-medium'>{order.product_details.name}</p>

                  <p>
                    Status:{' '}
                    <span className={`${getStatusColorClass(order.status)} font-semibold`}>
                      {order.status}
                    </span>
                  </p>

                  <p>
                    Payment:{' '}
                    <span className='text-green-600 font-semibold'>
                      {order.payment_status}
                    </span>
                  </p>

                  {(order.status === 'Order Placed' || order.status === 'Preparing') && (
                    <div className='mt-2'>
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        className='bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600'
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
