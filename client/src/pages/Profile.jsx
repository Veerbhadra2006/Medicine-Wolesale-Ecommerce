import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import fetchUserDetails from '../utils/fetchUserDetails';
import uploadImage from '../utils/UploadImage';

// ... (imports remain unchanged)

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    drugLicenseNumber: "",
    drugLicenseImage: "",
    gstNumber: "",
    panNumber: "",
    businessName: "",
    businessAddress: "",
  });

  const [summaryData, setSummaryData] = useState({
    name: "",
    email: "",
    mobile: "",
    drugLicenseNumber: "",
    drugLicenseImage: "",
    gstNumber: "",
    panNumber: "",
    businessName: "",
    businessAddress: "",
    checkVerified: false,
  });

  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchUserDetails();
        if (response?.data) {
          const data = response.data;

          setUserData({
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            drugLicenseNumber: "",
            drugLicenseImage: "",
            gstNumber: "",
            panNumber: "",
            businessName: "",
            businessAddress: "",
          });

          setSummaryData({
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            drugLicenseNumber: data.drugLicenseNumber || "",
            drugLicenseImage: data.drugLicenseImage || "",
            gstNumber: data.gstNumber || "",
            panNumber: data.panNumber || "",
            businessName: data.businessName || "",
            businessAddress: data.businessAddress || "",
            checkVerified: data.checkVerified || false,
          });

          const hasVerificationData =
            data.drugLicenseNumber ||
            data.gstNumber ||
            data.panNumber ||
            data.businessName ||
            data.businessAddress ||
            data.drugLicenseImage;

          setVerificationSubmitted(!!hasVerificationData);
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    const changed =
      userData.name !== summaryData.name ||
      userData.email !== summaryData.email ||
      userData.mobile !== summaryData.mobile;

    setHasChanges(changed);
  }, [userData, summaryData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadLicenseImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadImage(file);
      const { data: imageRes } = response;

      setUserData((prev) => ({
        ...prev,
        drugLicenseImage: imageRes.data.url,
      }));

      toast.success("License image uploaded!");
    } catch (err) {
      toast.error("Failed to upload license image.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const updatedUser = await fetchUserDetails();
      if (updatedUser?.data) {
        const updated = updatedUser.data;

        setUserData({
          name: updated.name || "",
          email: updated.email || "",
          mobile: updated.mobile || "",
          drugLicenseNumber: "",
          drugLicenseImage: "",
          gstNumber: "",
          panNumber: "",
          businessName: "",
          businessAddress: "",
        });

        setSummaryData({
          name: updated.name || "",
          email: updated.email || "",
          mobile: updated.mobile || "",
          drugLicenseNumber: updated.drugLicenseNumber || "",
          drugLicenseImage: updated.drugLicenseImage || "",
          gstNumber: updated.gstNumber || "",
          panNumber: updated.panNumber || "",
          businessName: updated.businessName || "",
          businessAddress: updated.businessAddress || "",
          checkVerified: updated.checkVerified || false,
        });

        const hasVerificationData =
          updated.drugLicenseNumber ||
          updated.gstNumber ||
          updated.panNumber ||
          updated.businessName ||
          updated.businessAddress ||
          updated.drugLicenseImage;

        setVerificationSubmitted(!!hasVerificationData);
        toast.success(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const verificationFields = [
    "drugLicenseNumber",
    "gstNumber",
    "panNumber",
    "businessName",
    "businessAddress",
  ];

  return (
    <div className="p-4">
      <div className="w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
        {summaryData.avatar ? (
          <img
            alt={summaryData.name || "User"}
            src={summaryData.avatar}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button
        onClick={() => setProfileAvatarEdit(true)}
        className="text-sm min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3"
      >
        Edit
      </button>

      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
      )}

      <form className="my-4 grid gap-4" onSubmit={handleSubmit}>
        {["name", "email", "mobile"].map((field) => (
          <div className="grid" key={field}>
            <label htmlFor={field}>
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              required
              placeholder={`Enter your ${field}`}
              className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
              value={userData[field]}
              onChange={handleOnChange}
              disabled={loading}
            />
          </div>
        ))}

        {verificationFields.map((field) => (
          <div className="grid" key={field}>
            <label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              type="text"
              id={field}
              name={field}
              required
              placeholder={`Enter your ${field}`}
              className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
              value={userData[field]}
              onChange={handleOnChange}
              disabled={verificationSubmitted || loading}
            />
          </div>
        ))}

        <div className="grid">
          <label>Drug License Image</label>
          {!verificationSubmitted ? (
            <>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleUploadLicenseImage}
                className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
                disabled={uploading || loading}
              />
              {uploading ? (
                <p className="text-sm text-yellow-600">Uploading...</p>
              ) : (
                userData.drugLicenseImage && (
                  <img
                    src={userData.drugLicenseImage}
                    alt="License Preview"
                    className="h-24 w-auto mt-2 rounded border"
                  />
                )
              )}
            </>
          ) : (
            userData.drugLicenseImage && (
              <img
                src={userData.drugLicenseImage}
                alt="License Preview"
                className="h-24 w-auto mt-2 rounded border"
              />
            )
          )}
        </div>

        {hasChanges && (
          <button
            type="submit"
            className="w-full py-2 mt-3 rounded bg-primary-200 hover:bg-primary-300 text-primary-800 font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </form>

      {verificationSubmitted && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="mb-2 font-semibold">Verification Summary</h3>
          <p>
            <strong>Drug License Number:</strong>{" "}
            {summaryData.drugLicenseNumber || "-"}
          </p>
          <p>
            <strong>GST Number:</strong> {summaryData.gstNumber || "-"}
          </p>
          <p>
            <strong>PAN Number:</strong> {summaryData.panNumber || "-"}
          </p>
          <p>
            <strong>Business Name:</strong> {summaryData.businessName || "-"}
          </p>
          <p>
            <strong>Business Address:</strong>{" "}
            {summaryData.businessAddress || "-"}
          </p>
          {summaryData.drugLicenseImage && (
            <img
              src={summaryData.drugLicenseImage}
              alt="Drug License"
              className="h-32 w-auto mt-2 rounded border"
            />
          )}
          {summaryData.checkVerified ? (
            <p className="mt-2 text-green-600 font-semibold">
              ✅ You are verified
            </p>
          ) : (
            <p className="mt-2 text-orange-600 font-semibold">
              ⏳ Verification pending
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
