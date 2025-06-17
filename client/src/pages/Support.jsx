import React, { useState } from 'react';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support request submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="support max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Support</h1>
      <p className="mb-6">
        Agar aapko koi dikkat ya sawaal hai, hume yeh form bhar ke bhejein. Hum jald hi aapko reply karenge.
      </p>

      {submitted && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded">
          Thank you for contacting support! We will get back to you shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block font-semibold mb-1">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-semibold mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Support;
