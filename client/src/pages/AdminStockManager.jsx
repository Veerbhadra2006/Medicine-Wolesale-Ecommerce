import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import Loading from '../components/Loading';
import AxiosToastError from '../utils/AxiosToastError';

const AdminStockManager = () => {
  const [productData, setProductData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: 1,
          limit: 100, // fetch more data now since pagination is removed
        }
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const filterLowStockProducts = () => {
    const filtered = productData.filter(product => product.stock < 50);
    setLowStockProducts(filtered);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (productData.length > 0) {
      filterLowStockProducts();
    }
  }, [productData]);

  const getSubCategoryName = (subCategoryArray) => {
    if (Array.isArray(subCategoryArray) && subCategoryArray.length > 0) {
      const subCategoryId = subCategoryArray[0]?._id;
      const found = allSubCategory.find(sub => sub._id === subCategoryId);
      return found ? found.name : 'N/A';
    }
    return 'N/A';
  };

  return (
    <section className="admin-stock-manager bg-[#0f172a] min-h-screen py-8 px-6 text-white">
      <div className="max-w-screen-xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-cyan-400">Admin Stock Manager</h3>

        {loading ? (
          <Loading />
        ) : (
          <>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-300 text-lg">No products with low stock found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-lg shadow-cyan-500/20 border border-cyan-500/30 rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="w-full h-40 mb-4 overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center">
                      {product.image?.length > 0 ? (
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-gray-400">No Image Available</div>
                      )}
                    </div>

                    <h4 className="text-xl font-semibold mb-1 line-clamp-2 text-cyan-200">{product.name}</h4>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-gray-400">Category:</span> {product.category?.[0]?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-gray-400">Subcategory:</span> {getSubCategoryName(product.subCategory)}
                    </p>
                    <p className="text-sm text-yellow-300 font-semibold mt-2">
                      Stock: {product.stock}
                    </p>
                    <p className="text-xs text-pink-500 font-semibold mt-1 animate-pulse">
                      ⚠️ Low Stock Alert
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdminStockManager;
