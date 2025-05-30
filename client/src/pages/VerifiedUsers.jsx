import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import Loading from '../components/Loading';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import verifiedbadge from '../assets/verifiedbadge.png';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const VerifiedUsers = () => {
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchVerifiedUsers = async () => {
        try {
            setLoading(true);
            const response = await Axios({ ...SummaryApi.getVerifiedUsers });
            if (response.data.success) {
                setVerifiedUsers(response.data.data || []);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const response = await Axios({
                url: `${SummaryApi.updateUserStatus.url}/${userId}`,
                method: SummaryApi.updateUserStatus.method,
                data: { status: newStatus },
            });
            if (response.data.success) {
                toast.success('Status updated!');
                fetchVerifiedUsers(); // Refresh
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchVerifiedUsers();
    }, []);

    return (
        <section className="verified-users bg-[#0f172a] min-h-screen py-8 px-6 text-white">
            <div className="max-w-screen-xl mx-auto">
                <h3 className="text-3xl font-bold mb-6 text-green-400">Verified Users</h3>

                {loading ? (
                    <Loading />
                ) : verifiedUsers.length === 0 ? (
                    <p className="text-gray-300 text-lg">😅 No verified users found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {verifiedUsers.map(user => (
                            <div key={user._id} className="flex flex-col items-center">
                                <div className="w-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-green-500/30 p-4 rounded-2xl shadow-lg shadow-green-500/20">

                                    {/* ✅ NAME AND BADGE INLINE WITH SPACE BETWEEN */}
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xl font-semibold text-green-300">
                                            {user.name || 'Unnamed'}
                                        </h4>
                                        <img 
                                            src={verifiedbadge} 
                                            alt="Verified Badge" 
                                            className="w-10 h-10 ml-4"
                                        />
                                    </div>

                                    <p className="text-sm text-gray-300"><span className="font-semibold">Mobile:</span> {user.mobile}</p>
                                    <p className="text-sm text-gray-300"><span className="font-semibold">Email:</span> {user.email || 'N/A'}</p>
                                    <p className="text-sm text-gray-300"><span className="font-semibold">Drug License No:</span> {user.drugLicenseNumber}</p>
                                    <p className="text-sm text-gray-300"><span className="font-semibold">Business Name:</span> {user.businessName}</p>
                                    <p className="text-sm text-gray-300"><span className="font-semibold">Business Address:</span> {user.businessAddress}</p>
                                    <p className="text-sm text-gray-300"><span className="font-semibold">GST No:</span> {user.gstNumber}</p>
                                    <p className="text-sm text-gray-300"><span className="font-semibold">PAN No:</span> {user.panNumber}</p>
                                    <p className="text-sm text-gray-300"><span className="font-semibold">Business Type:</span> {user.businessType}</p>

                                    {user.drugLicenseImage && (
                                        <div className="mt-4">
                                            <img
                                                src={user.drugLicenseImage}
                                                alt="Drug License"
                                                className="w-full h-40 object-contain mt-3 rounded-lg border border-white/20 cursor-pointer"
                                                onClick={() => setSelectedImage(user.drugLicenseImage)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 👇 STATUS SECTION BELOW CARD */}
                                <div className="mt-4 w-full flex items-center gap-4 px-2">
                                    <p className="text-green-300 font-bold">
                                        Status:{' '}
                                        <span className={`ml-1 ${user.status === 'Active' ? 'text-green-400' : user.status === 'Inactive' ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {user.status}
                                        </span>
                                    </p>
                                    <select
                                        value={user.status}
                                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                        className="bg-green-600 text-white rounded-md px-4 py-2 focus:outline-none hover:bg-green-700 transition"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>

                                {/* 👇 ZOOMABLE IMAGE PREVIEW */}
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default VerifiedUsers;
