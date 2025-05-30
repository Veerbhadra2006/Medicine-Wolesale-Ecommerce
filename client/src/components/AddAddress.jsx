import React from 'react';
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider';

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (data) => {
    console.log("data", data);

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
      <div className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>
        <div className='flex justify-between items-center gap-4'>
          <h2 className='font-semibold'>Add Address</h2>
          <button onClick={close} className='hover:text-red-500'>
            <IoClose size={25} />
          </button>
        </div>
        <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>

          {/* Address Line */}
          <div className='grid gap-1'>
            <label htmlFor='addressline'>Address Line :</label>
            <input
              type='text'
              id='addressline'
              className={`border p-2 rounded ${errors.addressline ? 'border-red-500' : 'bg-blue-50'}`}
              {...register("addressline", { required: "Address line is required" })}
            />
            {errors.addressline && <span className='text-red-500 text-sm'>{errors.addressline.message}</span>}
          </div>

          {/* City */}
          <div className='grid gap-1'>
            <label htmlFor='city'>City :</label>
            <input
              type='text'
              id='city'
              className={`border p-2 rounded ${errors.city ? 'border-red-500' : 'bg-blue-50'}`}
              {...register("city", { required: "City is required" })}
            />
            {errors.city && <span className='text-red-500 text-sm'>{errors.city.message}</span>}
          </div>

          {/* State */}
          <div className='grid gap-1'>
            <label htmlFor='state'>State :</label>
            <input
              type='text'
              id='state'
              className={`border p-2 rounded ${errors.state ? 'border-red-500' : 'bg-blue-50'}`}
              {...register("state", { required: "State is required" })}
            />
            {errors.state && <span className='text-red-500 text-sm'>{errors.state.message}</span>}
          </div>

          {/* Pincode */}
          <div className='grid gap-1'>
            <label htmlFor='pincode'>Pincode :</label>
            <input
              type='text'
              id='pincode'
              className={`border p-2 rounded ${errors.pincode ? 'border-red-500' : 'bg-blue-50'}`}
              {...register("pincode", { required: "Pincode is required" })}
            />
            {errors.pincode && <span className='text-red-500 text-sm'>{errors.pincode.message}</span>}
          </div>

          {/* Country */}
          <div className='grid gap-1'>
            <label htmlFor='country'>Country :</label>
            <input
              type='text'
              id='country'
              className={`border p-2 rounded ${errors.country ? 'border-red-500' : 'bg-blue-50'}`}
              {...register("country", { required: "Country is required" })}
            />
            {errors.country && <span className='text-red-500 text-sm'>{errors.country.message}</span>}
          </div>

          {/* Mobile Number */}
          <div className='grid gap-1'>
            <label htmlFor='mobile'>Mobile No. :</label>
            <input
              type='text'
              id='mobile'
              className={`border p-2 rounded ${errors.mobile ? 'border-red-500' : 'bg-blue-50'}`}
              {...register("mobile", { required: "Mobile number is required" })}
            />
            {errors.mobile && <span className='text-red-500 text-sm'>{errors.mobile.message}</span>}
          </div>

          <button type='submit' className='bg-primary-200 w-full py-2 font-semibold mt-4 hover:bg-primary-100'>
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
