import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    const response = await uploadImage(file);
    const imageUrl = response?.data?.data?.url;

    setData(prev => ({
      ...prev,
      image: [...prev.image, imageUrl]
    }));
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    data.image.splice(index, 1);
    setData(prev => ({
      ...prev
    }));
  };

  const handleRemoveCategory = (index) => {
    data.category.splice(index, 1);
    setData(prev => ({
      ...prev
    }));
  };

  const handleRemoveSubCategory = (index) => {
    data.subCategory.splice(index, 1);
    setData(prev => ({
      ...prev
    }));
  };

  const handleAddField = () => {
    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      });
      const responseData = response.data;

      if (responseData.success) {
        successAlert(responseData.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>
      <div className='grid p-3'>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          {/* Name */}
          <div className='grid gap-1'>
            <label htmlFor='name' className='font-medium'>Name</label>
            <input id='name' type='text' placeholder='Enter product name' name='name' value={data.name} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          {/* Description */}
          <div className='grid gap-1'>
            <label htmlFor='description' className='font-medium'>Description</label>
            <textarea id='description' name='description' value={data.description} onChange={handleChange} required rows={3} placeholder='Enter product description' className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none' />
          </div>

          {/* Image Upload */}
          <div>
            <p className='font-medium'>Image</p>
            <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
              <div className='text-center flex justify-center items-center flex-col'>
                {imageLoading ? <Loading /> : (<><FaCloudUploadAlt size={35} /><p>Upload Image</p></>)}
              </div>
              <input type='file' id='productImage' className='hidden' accept='image/*' onChange={handleUploadImage} />
            </label>

            {/* Uploaded Images */}
            <div className='flex flex-wrap gap-4'>
              {data.image.map((img, index) => (
                <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                  <img src={img} alt={img} className='w-full h-full object-scale-down cursor-pointer' onClick={() => setViewImageURL(img)} />
                  <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                    <MdDelete />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className='grid gap-1'>
            <label className='font-medium'>Category</label>
            <select className='bg-blue-50 border w-full p-2 rounded' value={selectCategory} onChange={(e) => {
              const value = e.target.value;
              const category = allCategory.find(el => el._id === value);
              const alreadyExist = data.category.find(cat => cat._id === value);
              if (!alreadyExist) {
                setData(prev => ({
                  ...prev,
                  category: [...prev.category, category]
                }));
              }
              setSelectCategory("");
            }}>
              <option value="">Select Category</option>
              {allCategory.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className='flex flex-wrap gap-3'>
              {data.category.map((c, index) => (
                <div key={c._id + index + "cat"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2 px-2 py-1 rounded'>
                  <p>{c.name}</p>
                  <IoClose size={20} className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Sub Category */}
          <div className='grid gap-1'>
            <label className='font-medium'>Sub Category</label>
            <select className='bg-blue-50 border w-full p-2 rounded' value={selectSubCategory} onChange={(e) => {
              const value = e.target.value;
              const subCategory = allSubCategory.find(el => el._id === value);
              const alreadyExist = data.subCategory.find(sub => sub._id === value);
              if (!alreadyExist) {
                setData(prev => ({
                  ...prev,
                  subCategory: [...prev.subCategory, subCategory]
                }));
              }
              setSelectSubCategory("");
            }}>
              <option value="">Select Sub Category</option>
              {allSubCategory.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className='flex flex-wrap gap-3'>
              {data.subCategory.map((c, index) => (
                <div key={c._id + index + "subcat"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2 px-2 py-1 rounded'>
                  <p>{c.name}</p>
                  <IoClose size={20} className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Unit, Stock, Price, Discount */}
          <div className='grid gap-1'>
            <label htmlFor='unit' className='font-medium'>Pack Size Per Strips</label>
            <input id='unit' type='text' placeholder='Enter Pack Size Per Strip' name='unit' value={data.unit} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='stock' className='font-medium'>Number of Stock</label>
            <input id='stock' type='number' placeholder='Enter product stock' name='stock' value={data.stock} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='price' className='font-medium'>Price</label>
            <input id='price' type='number' placeholder='Enter product price' name='price' value={data.price} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='discount' className='font-medium'>Discount</label>
            <input id='discount' type='number' placeholder='Enter product discount' name='discount' value={data.discount} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          {/* Additional Fields */}
          {Object.keys(data.more_details).map((key, index) => (
            <div className='grid gap-1' key={key}>
              <label htmlFor={key} className='font-medium'>{key}</label>
              <input
                id={key}
                type='text'
                value={data.more_details[key]}
                onChange={(e) => {
                  const value = e.target.value;
                  setData(prev => ({
                    ...prev,
                    more_details: {
                      ...prev.more_details,
                      [key]: value
                    }
                  }));
                }}
                required
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
          ))}

          {/* Add Custom Field Button */}
          <div onClick={() => setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
            Add Fields
          </div>

          <button type='submit' className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
            Submit
          </button>
        </form>
      </div>

      {/* Image Preview */}
      {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}

      {/* Add Field Modal */}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
