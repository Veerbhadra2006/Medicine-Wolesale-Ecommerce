import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()
  const [editAddressData, setEditAddressData] = useState(null)

  const handleCashOnDelivery = async () => {
    if (!addressList.length || !addressList[selectAddress]?.status) {
      return toast.error("Please add or select a valid address before placing the order.")
    }

    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchCartItem && fetchCartItem()
        fetchOrder && fetchOrder()
        navigate('/success', { state: { text: "Order" } })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async () => {
    if (!addressList.length || !addressList[selectAddress]?.status) {
      return toast.error("Please add or select a valid address before placing the order.");
    }
  
    // 👇 Frontend stock validation before calling backend or Stripe
    const outOfStockItem = cartItemsList.find(item => item.quantity > item?.productId?.stock)
  
    if (outOfStockItem) {
      return toast.error(`😕 Insufficient stock for "${outOfStockItem.productId.name}"`)
    }
  
    try {
      toast.loading("Redirecting to payment...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)
  
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })
  
      const { data: responseData } = response
      stripePromise.redirectToCheckout({ sessionId: responseData.id })
  
      fetchCartItem && fetchCartItem()
      fetchOrder && fetchOrder()
  
    } catch (error) {
      AxiosToastError(error)
    }
  }
  

  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        {/* Address Section */}
        <div className='w-full'>
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {
              addressList.map((address, index) => {
                return (
                  <label
                    key={address._id || index}
                    htmlFor={"address" + index}
                    className={!address.status ? "hidden" : ""}
                  >
                    <div className='border rounded p-3 flex gap-3 hover:bg-blue-50 justify-between items-start'>
                      <div className='flex gap-3'>
                        <input
                          id={"address" + index}
                          type='radio'
                          value={index}
                          checked={selectAddress === index}
                          onChange={(e) => setSelectAddress(Number(e.target.value))}
                          name='address'
                        />
                        <div>
                          <p>{address.address_line}</p>
                          <p>{address.city}</p>
                          <p>{address.state}</p>
                          <p>{address.country} - {address.pincode}</p>
                          <p>{address.mobile}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditAddressData(address)
                          setOpenAddress(true)
                        }}
                        className='flex items-center gap-1 text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition-all duration-300 hover:shadow-md hover:scale-105'
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </label>
                )
              })
            }
            {
              addressList.length === 0 && (
                <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                  Add address
                </div>
              )
            }
          </div>
        </div>

        {/* Summary Section */}
        <div className='w-full max-w-md bg-white py-4 px-2'>
          <h3 className='text-lg font-semibold'>Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'>
                <span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quantity total</p>
              <p>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <button
              className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold'
              onClick={handleOnlinePayment}
            >
              Online Payment
            </button>
            <button
              className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white'
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => { setOpenAddress(false); setEditAddressData(null) }} editAddressData={editAddressData} />}
    </section>
  )
}

export default CheckoutPage