import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'
import AddToCartButton from './AddToCartButton'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [isOutOfStock, setIsOutOfStock] = useState(false)

  useEffect(() => {
    const anyOutOfStock = cartItem.some(item => {
      const productStock = item?.productId?.stock;
      const productQty = item?.quantity;  // Make sure to use quantity from cartItem itself, not `qty`
      
      // Debugging: log stock and quantity
      console.log(`Checking stock for product ${item?.productId?.name}: Stock: ${productStock}, Quantity: ${productQty}`);
      
      return productStock < productQty;  // Compare stock with cart quantity
    });
    
    console.log("Any product out of stock: ", anyOutOfStock);
    setIsOutOfStock(anyOutOfStock)
  }, [cartItem])

  const redirectToCheckoutPage = () => {
    if (isOutOfStock) return  // Prevent navigation if there's an out-of-stock item
    if (user?._id) {
      navigate("/checkout")
      if (close) close()
    } else {
      toast("Please Login")
    }
  }

  return (
    <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
      <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
        <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
          <h2 className='font-semibold'>Cart</h2>
          <Link to={"/"} className='lg:hidden'>
            <IoClose size={25} />
          </Link>
          <button onClick={close} className='hidden lg:block'>
            <IoClose size={25} />
          </button>
        </div>

        <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
          {
            cartItem[0] ? (
              <>
                <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                  <p>Your total savings</p>
                  <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                </div>
                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                  {
                    cartItem.map((item, index) => (
                      <div key={item?._id + "cartItemDisplay"} className='flex w-full gap-4'>
                        <div className='w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded'>
                          <img
                            src={item?.productId?.image[0]}
                            className='object-scale-down'
                          />
                        </div>
                        <div className='w-full max-w-sm text-xs'>
                          <p className='text-xs text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                          <p className='text-neutral-400'>{item?.productId?.unit}</p>
                          <p className='font-semibold'>{DisplayPriceInRupees(pricewithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                        </div>
                        <div>
                          <AddToCartButton data={item?.productId} />
                        </div>
                      </div>
                    ))
                  }
                </div>
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
                    <p className='flex items-center gap-2'>{totalQty} item</p>
                  </div>
                  <div className='flex gap-4 justify-between ml-1'>
                    <p>Delivery Charge</p>
                    <p className='flex items-center gap-2'>Free</p>
                  </div>
                  <div className='font-semibold flex items-center justify-between gap-4'>
                    <p>Grand total</p>
                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className='bg-white flex flex-col justify-center items-center'>
                <img
                  src={imageEmpty}
                  className='w-full h-full object-scale-down'
                />
                <Link onClick={close} to={"/"} className='block bg-green-600 px-4 py-2 text-white rounded'>Shop Now</Link>
              </div>
            )
          }
        </div>

        {
          cartItem[0] && (
            <div className='p-2 flex flex-col gap-2'>
              {
                isOutOfStock && (
                  <div className='text-red-600 font-semibold text-sm text-center'>
                    Some items in your cart are out of stock. Please update your cart to proceed.
                  </div>
                )
              }

              <div className={`px-4 font-bold text-base py-4 rounded flex items-center gap-4 justify-between ${isOutOfStock ? 'bg-red-300 text-red-800' : 'bg-green-700 text-neutral-100'}`}>
                <div>{DisplayPriceInRupees(totalPrice)}</div>
                <button
                  onClick={redirectToCheckoutPage}
                  className={`flex items-center gap-1 ${isOutOfStock ? 'cursor-not-allowed' : ''}`}
                  disabled={isOutOfStock}
                >
                  Proceed <FaCaretRight />
                </button>
              </div>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default DisplayCartItem
