import React, { useState } from 'react'
import axios from 'axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'

const Support = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !message || !phone || !businessName || !subject) {
      toast.error("All fields are required")
      return
    }

    try {
      const res = await axios({
        method: SummaryApi.supportSend.method,
        url: SummaryApi.supportSend.url,
        data: {
          name,
          email,
          message,
          phone,
          businessName,
          subject
        }
      })

      if (res.data.success) {
        toast.success("Message sent successfully!")
        setName('')
        setEmail('')
        setMessage('')
        setPhone('')
        setBusinessName('')
        setSubject('')
      }
    } catch (err) {
      toast.error("Something went wrong")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center px-4">
      <div
        className="w-full max-w-xl backdrop-blur-md bg-white/30 border border-gray-300 rounded-2xl p-8 shadow-md animate-fade-in-up"
      >
        <h1 className="text-3xl text-center font-semibold text-gray-800 mb-6">
          Customer Support
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="glass-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="glass-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Phone"
            className="glass-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Business Name"
            className="glass-input"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            className="glass-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            placeholder="Your Message"
            className="glass-input h-32 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-gray-700 hover:bg-gray-800 text-white font-semibold shadow transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>

      <style>
        {`
          .glass-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(156, 163, 175, 0.5); /* gray-400 with opacity */
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(8px);
            color: #374151; /* gray-700 */
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .glass-input::placeholder {
            color: #6b7280; /* gray-500 */
          }

          .glass-input:focus {
            border-color: #4b5563; /* gray-600 */
            box-shadow: 0 0 8px rgba(75, 85, 99, 0.5);
            background: rgba(255, 255, 255, 0.8);
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
        `}
      </style>
    </div>
  )
}

export default Support
