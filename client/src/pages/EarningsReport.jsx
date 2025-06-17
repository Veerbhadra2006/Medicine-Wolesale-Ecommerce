import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { baseURL } from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { CalendarDays, CreditCard, HandCoins, IndianRupee } from 'lucide-react';

const EarningsReport = () => {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const isWithinRange = (dateStr) => {
    if (!startDate && !endDate) return true;

    const date = moment(dateStr);
    const start = startDate ? moment(startDate).startOf('day') : null;
    const end = endDate ? moment(endDate).endOf('day') : null;

    if (start && date.isBefore(start)) return false;
    if (end && date.isAfter(end)) return false;

    return true;
  };

  const filteredOrders = orders.filter((order) => isWithinRange(order.createdAt));

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date = moment(order.createdAt).format('DD/MM/YY');
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  const calculateEarnings = (ordersForDate) => {
    const onlineOrders = ordersForDate.filter(order => order.payment_status !== 'CASH ON DELIVERY');
    const codOrders = ordersForDate.filter(order => order.payment_status === 'CASH ON DELIVERY');

    const onlineTotal = onlineOrders.reduce((sum, order) => sum + order.totalAmt, 0);
    const codTotal = codOrders.reduce((sum, order) => sum + order.totalAmt, 0);

    return {
      onlineCount: onlineOrders.length,
      codCount: codOrders.length,
      onlineTotal,
      codTotal,
      totalEarning: onlineTotal + codTotal,
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold text-primary-700 mb-6 tracking-tight">Earnings Report</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>

      {/* No Orders */}
      {Object.entries(groupedOrders).length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">No orders found in this range.</p>
      )}

      {/* Earnings Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(groupedOrders).map(([date, ordersForDate]) => {
          const {
            onlineCount,
            codCount,
            onlineTotal,
            codTotal,
            totalEarning,
          } = calculateEarnings(ordersForDate);

          return (
            <div
              key={date}
              className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-primary-500 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-2 text-primary-600 mb-2">
                <CalendarDays size={20} />
                <h3 className="text-lg font-semibold">{date}</h3>
              </div>
              <div className="grid gap-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                  <CreditCard size={16} /> Online Orders: <span className="ml-auto font-medium">{onlineCount} | ₹{onlineTotal}</span>
                </p>
                <p className="flex items-center gap-2">
                  <HandCoins size={16} /> COD Orders: <span className="ml-auto font-medium">{codCount} | ₹{codTotal}</span>
                </p>
                <p className="flex items-center gap-2 text-primary-700 font-semibold mt-2">
                  <IndianRupee size={18} /> Total Earning:
                  <span className="ml-auto text-xl">₹{totalEarning}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarningsReport;
