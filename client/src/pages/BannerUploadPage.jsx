import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryApi, { baseURL } from '../common/SummaryApi';
import Axios from '../utils/Axios';
import { valideURLConvert } from '../utils/valideURLConvert';
import { useNavigate } from 'react-router-dom';

const BannerUploadPage = () => {
  const [formData, setFormData] = useState({ link_url: '', image: '', type: 'top' });
  const [banners, setBanners] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${baseURL}${SummaryApi.getAllBanners.url}`, {
        withCredentials: true,
      });
      setBanners(res.data);
    } catch (err) {
      console.error('Error fetching banners:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await Axios({ ...SummaryApi.getCategory });
      if (res.data.success) {
        setCategoryList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await Axios({ ...SummaryApi.getSubCategory });
      if (res.data.success) {
        setSubCategoryList(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const handleCategorySelect = (categoryId) => {
    const category = categoryList.find(c => c._id === categoryId);
    if (!category) return;

    const subcategory = subCategoryList.find(sub =>
      sub.category?.some(cat => cat._id === categoryId)
    );

    const categorySlug = valideURLConvert(category.name);

    if (subcategory) {
      const subcategorySlug = valideURLConvert(subcategory.name);
      const url = `/${categorySlug}-${category._id}/${subcategorySlug}-${subcategory._id}`;
      setFormData(prev => ({ ...prev, link_url: url }));
    } else {
      const url = `/${categorySlug}-${category._id}`;
      setFormData(prev => ({ ...prev, link_url: url }));
    }
  };

  const handleImageChange = async e => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setFormData(prev => ({ ...prev, image: base64 }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}${SummaryApi.uploadBanner.url}`, formData, {
        withCredentials: true
      });
      alert('Banner Uploaded');
      setFormData({ link_url: '', image: '', type: 'top' });
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`${baseURL}/api/admin/banner/${id}`, {
        withCredentials: true
      });
      alert('Banner Deleted');
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleBannerClick = (url) => {
    if (url) {
      console.log("Navigating to:", url);
      navigate(url);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Banner</h2>
     <form onSubmit={handleSubmit} className="space-y-3 mb-8">
  <select
    onChange={e => {
      const selectedId = e.target.value;
      if (selectedId) handleCategorySelect(selectedId);
    }}
    className="w-full border p-2 rounded"
  >
    <option value="">Select Category</option>
    {categoryList.map(cat => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>

  {/* Add Banner Type Selection */}
  <select
    className="w-full border p-2 rounded"
    value={formData.type || 'top'}
    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
  >
    <option value="top">Top Banner</option>
    <option value="middle">Middle Banner</option>
  </select>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="w-full border p-2 rounded"
  />

  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
    Upload
  </button>
</form>


      <h3 className="text-lg font-semibold mb-2">Uploaded Banners</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(b => (
          <div
            key={b._id}
            onClick={() => handleBannerClick(b.link_url)}
            className="border rounded shadow p-2 relative cursor-pointer hover:shadow-md transition"
          >
            <img src={b.image_url} alt="Banner" className="w-full h-40 object-cover rounded" />
            <p className="text-sm mt-2 truncate">{b.link_url}</p>
            <p className="text-xs text-gray-600 mt-1">Type: <span className="font-semibold">{b.type}</span></p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering banner click
                handleDelete(b._id);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerUploadPage;

const convertToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
  });
