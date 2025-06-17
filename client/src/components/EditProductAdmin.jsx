import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from './Loading';
import ViewImage from './ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from './AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close ,data : propsData,fetchProductData}) => {
  const [data, setData] = useState({
    _id : propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  })
  const [imageLoading, setImageLoading] = useState(false)
  const [ViewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((preve) => ({
      ...preve,
      [name]: value
    }))
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageLoading(true)
    try {
      const response = await uploadImage(file)
      const { data: ImageResponse } = response
      const imageUrl = ImageResponse.data.url
      setData((preve) => ({
        ...preve,
        image: [...preve.image, imageUrl]
      }))
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setImageLoading(false)
    }
  }

  const handleDeleteImage = async (index) => {
    setData((preve) => {
      const newImages = [...preve.image]
      newImages.splice(index, 1)
      return {
        ...preve,
        image: newImages
      }
    })
  }

  const handleRemoveCategory = (index) => {
    setData((preve) => {
      const newCategories = [...preve.category]
      newCategories.splice(index, 1)
      return {
        ...preve,
        category: newCategories
      }
    })
  }

  const handleRemoveSubCategory = (index) => {
    setData((preve) => {
      const newSubCategories = [...preve.subCategory]
      newSubCategories.splice(index, 1)
      return {
        ...preve,
        subCategory: newSubCategories
      }
    })
  }

  const handleAddField = () => {
    if (!fieldName.trim()) return
    setData((preve) => ({
      ...preve,
      more_details: {
        ...preve.more_details,
        [fieldName]: ""
      }
    }))
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data
      })
      const { data: responseData } = response
      if (responseData.success) {
        successAlert(responseData.message)
        close?.()
        fetchProductData()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4'>
      <div className='bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]'>
        <section>
          <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Edit Product</h2>
            <button onClick={close}><IoClose size={20} /></button>
          </div>

          <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
              <div className='grid gap-1'>
                <label htmlFor='name' className='font-medium'>Name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter product name'
                  name='name'
                  value={data.name}
                  onChange={handleChange}
                  required
                  className='bg-blue-50 p-2 outline-none border rounded'
                />
              </div>

              <div className='grid gap-1'>
                <label htmlFor='description' className='font-medium'>Description</label>
                <textarea
                  id='description'
                  placeholder='Enter product description'
                  name='description'
                  value={data.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className='bg-blue-50 p-2 outline-none border rounded resize-none'
                />
              </div>

              <div>
                <p className='font-medium'>Image</p>
                <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                  <div className='text-center flex justify-center items-center flex-col'>
                    {imageLoading ? <Loading /> : (<><FaCloudUploadAlt size={35} /><p>Upload Image</p></>)}
                  </div>
                  <input
                    type='file'
                    id='productImage'
                    className='hidden'
                    accept='image/*'
                    onChange={handleUploadImage}
                  />
                </label>

                <div className='flex flex-wrap gap-4 mt-2'>
                  {data.image.map((img, index) => (
                    <div key={img + index} className='h-20 w-20 bg-blue-50 border relative group'>
                      <img
                        src={img}
                        alt={img}
                        className='w-full h-full object-scale-down cursor-pointer'
                        onClick={() => setViewImageURL(img)}
                      />
                      <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 text-white hidden group-hover:block cursor-pointer rounded'>
                        <MdDelete />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='grid gap-1'>
                <label className='font-medium'>Category</label>
                <select
                  className='bg-blue-50 border w-full p-2 rounded'
                  value={selectCategory}
                  onChange={(e) => {
                    const category = allCategory.find(el => el._id === e.target.value)
                    if (category && !data.category.some(c => c._id === category._id)) {
                      setData(preve => ({
                        ...preve,
                        category: [...preve.category, category]
                      }))
                    }
                    setSelectCategory("")
                  }}
                >
                  <option value=''>Select Category</option>
                  {allCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <div className='flex flex-wrap gap-3 mt-2'>
                  {data.category.map((c, index) => (
                    <div key={c._id + index} className='text-sm flex items-center gap-1 bg-blue-50 px-2 py-1 rounded'>
                      <p>{c.name}</p>
                      <IoClose size={20} className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className='grid gap-1'>
                <label className='font-medium'>Sub Category</label>
                <select
                  className='bg-blue-50 border w-full p-2 rounded'
                  value={selectSubCategory}
                  onChange={(e) => {
                    const subCategory = allSubCategory.find(el => el._id === e.target.value)
                    if (subCategory && !data.subCategory.some(c => c._id === subCategory._id)) {
                      setData(preve => ({
                        ...preve,
                        subCategory: [...preve.subCategory, subCategory]
                      }))
                    }
                    setSelectSubCategory("")
                  }}
                >
                  <option value=''>Select Sub Category</option>
                  {allSubCategory.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <div className='flex flex-wrap gap-3 mt-2'>
                  {data.subCategory.map((c, index) => (
                    <div key={c._id + index} className='text-sm flex items-center gap-1 bg-blue-50 px-2 py-1 rounded'>
                      <p>{c.name}</p>
                      <IoClose size={20} className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)} />
                    </div>
                  ))}
                </div>
              </div>

              {['unit', 'stock', 'price', 'discount'].map((field) => (
                <div className='grid gap-1' key={field}>
                  <label htmlFor={field} className='font-medium'>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    id={field}
                    type={field === 'unit' ? 'text' : 'number'}
                    name={field}
                    value={data[field]}
                    onChange={handleChange}
                    required
                    className='bg-blue-50 p-2 outline-none border rounded'
                  />
                </div>
              ))}

              {Object.keys(data.more_details).map((k) => (
                <div className='grid gap-1' key={k}>
                  <label htmlFor={k} className='font-medium'>{k}</label>
                  <input
                    id={k}
                    type='text'
                    value={data.more_details[k]}
                    onChange={(e) => setData(preve => ({
                      ...preve,
                      more_details: {
                        ...preve.more_details,
                        [k]: e.target.value
                      }
                    }))}
                    required
                    className='bg-blue-50 p-2 outline-none border rounded'
                  />
                </div>
              ))}

              <div onClick={() => setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
                Add Fields
              </div>

              <button type='submit' className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
                Update Product
              </button>
            </form>
          </div>

          {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}

          {openAddField && (
            <AddFieldComponent
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
              close={() => setOpenAddField(false)}
            />
          )}
        </section>
      </div>
    </section>
  )
}

export default EditProductAdmin
