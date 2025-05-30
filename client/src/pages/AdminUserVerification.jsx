import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import Loading from '../components/Loading';
import AxiosToastError from '../utils/AxiosToastError';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const AdminUserVerification = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null); // for success message
  const [selectedImage, setSelectedImage] = useState(null); // for image preview

  const getUnverifiedUsers = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getUnverifiedUsers });
      if (response.data.success) {
        setPendingUsers(response.data.data || []);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    try {
      setLoading(true);
      const response = await Axios({
        url: `${SummaryApi.verifyUserById.url}/${userId}`,
        method: SummaryApi.verifyUserById.method,
      });

      if (response.data.success) {
        setPopup("User verified successfully ✅");
        getUnverifiedUsers(); // Refresh
        setTimeout(() => setPopup(null), 3000);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUnverifiedUsers();
  }, []);

  return (
    <section className="bg-[#0f172a] min-h-screen py-8 px-6 text-white relative">
      <div className="max-w-screen-xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-pink-400">Pending User Verifications</h3>

        {loading ? (
          <Loading />
        ) : (
          <>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-300 text-lg">🎉 No pending verifications at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingUsers.map(user => (
                  <div key={user._id} className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-pink-500/30 p-4 rounded-2xl shadow-lg shadow-pink-500/20 space-y-2">
                    <h4 className="text-xl font-semibold text-pink-300">{user.name || "Unnamed"}</h4>
                    <p><span className="font-semibold">Mobile:</span> {user.mobile}</p>
                    <p><span className="font-semibold">Email:</span> {user.email || "N/A"}</p>
                    <p><span className="font-semibold">Drug License No:</span> {user.drugLicenseNumber}</p>
                    <p><span className="font-semibold">GST No:</span> {user.gstNumber || "N/A"}</p>
                    <p><span className="font-semibold">PAN No:</span> {user.panNumber || "N/A"}</p>
                    <p><span className="font-semibold">Business Name:</span> {user.businessName}</p>
                    <p><span className="font-semibold">Business Address:</span> {user.businessAddress}</p>
                    <p><span className="font-semibold">Business Type:</span> {user.businessType}</p>

                    {user.drugLicenseImage && (
                      <div>
                        <p className="font-semibold">Drug License Image:</p>
                        <img
                          src={user.drugLicenseImage}
                          alt="Drug License"
                          className="mt-1 w-full h-40 object-contain border border-gray-600 rounded-lg cursor-pointer"
                          onClick={() => setSelectedImage(user.drugLicenseImage)}
                        />
                      </div>
                    )}

                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={() => handleVerify(user._id)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-300"
                      >
                        ✅ Verify User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 🎉 POPUP MESSAGE */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-lg z-50"
          >
            {popup}
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGE PREVIEW MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <TransformWrapper
            doubleClick={{ disabled: true }}
            pinch={{ disabled: false }}
            wheel={{ disabled: false }}
            panning={{ disabled: false }}
            zoomAnimation={{ animationTime: 200 }}
          >
            <TransformComponent>
              <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-screen max-w-screen"
              >
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-auto h-auto max-h-screen max-w-screen object-contain rounded-lg select-none"
                  draggable={false}
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </section>
  );
};

export default AdminUserVerification;
