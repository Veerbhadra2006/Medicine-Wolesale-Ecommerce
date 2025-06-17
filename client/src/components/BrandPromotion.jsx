import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import Feat1 from '../assets/fast_delivery.png';
import Feat2 from '../assets/offers.png';
import Feat3 from '../assets/medicine_box.png';
import Feat4 from '../assets/customer_support.png';
import AppStoreLogo from '../assets/app-store.webp';
import PlayStoreLogo from '../assets/play-store.webp';
import QRCodeImage from '../assets/qrcode.png';
import PhoneImage from '../assets/phone_image.png';
import BikeImage from '../assets/medicine_van.png';

const allFeatures = [
    {
        imgSrc: Feat1,
        text: 'Fast Delivery',
        description:
            'Get your orders delivered swiftly, directly from our store to your doorstep.',
    },
    {
        imgSrc: Feat2,
        text: 'Best Prices & Offers',
        description:
            'Enjoy unbeatable prices on every order, with exclusive offers and exciting cashback deals.',
    },
    {
        imgSrc: Feat3,
        text: 'Wide Assortment',
        description:
            'Wide assortment of genuine medicines and essentials, ready to deliver.',
    },
    {
        imgSrc: Feat4,
        text: 'Best Customer Support',
        description:
            'Reliable support team, always ready to assist with your needs.',
    },
];

const PromoFeature = ({ imgSrc, text, description }) => (
    <div className="border rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
        <img className="w-20 h-30 mb-4 object-contain" src={imgSrc} alt={text} />
        <h5 className="text-black font-semibold text-sm">{text}</h5>
        <p className="text-xs text-gray-600 mt-2">{description}</p>
    </div>
);

const BrandPromotion = () => {
    return (
        <section className="py-10 bg-white">
            <div className="max-w-6xl mx-auto px-4" >
                {/* Promo section */}
                <div className="bg-green-100 rounded-2xl p-8 flex flex-col lg:flex-row items-center gap-10 ">
                    {/* Left image */}

                        <div className="hidden lg:flex justify-center items-center relative w-[480px] h-[500px]">
                            <img
                                src={PhoneImage}
                                alt="Phone"
                                className="absolute z-10 h-full object-contain"
                            />
                            <img
                                src={BikeImage}
                                alt="Bike"
                                className="absolute bottom-[-50px] left-1/50 -translate-x-1/2 h-[280px] animate-carMove z-20"
                            />
                        </div>

                        {/* Right content */}
                        <div className="w-full lg:w-1/2 space-y-5">
                            <h2 className="text-3xl font-bold">Get the bringit app</h2>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                    <IoCheckmarkCircle className="text-green-600 mr-2" />
                                    Miss live order tracking
                                </div>
                                <div className="flex items-center text-sm">
                                    <IoCheckmarkCircle className="text-green-600 mr-2" />
                                    Miss latest feature updates
                                </div>
                            </div>

                            {/* QR Code Section */}
                            <div className="bg-green-200 p-4 rounded-xl flex items-center gap-4 max-w-md mt-4">
                                <img src={QRCodeImage} alt="QR Code" className="w-24 h-24" />
                                <div>
                                    <p className="font-semibold">
                                        Simple way to download the Bringit app
                                    </p>
                                    <span className="text-sm text-gray-600">
                                        Scan QR code and download now
                                    </span>
                                </div>
                            </div>

                            {/* App download buttons (optional) */}
                            <div className="flex gap-3 mt-4">
                                <img src={AppStoreLogo} alt="App Store" className="w-32 h-10" />
                                <img src={PlayStoreLogo} alt="Play Store" className="w-32 h-10" />
                            </div>
                        </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                    {allFeatures.map((feat, i) => (
                        <PromoFeature key={i} {...feat} />
                    ))}
                </div>
                
                 <div className="border-b _border-light pt-3 pb-10">
            <p className="text-sm _text-default">
              "XYZ Pharmaceuticals is a registered entity owned by XYZ Pharmaceuticals Private Limited. It is not affiliated with any other brand of similar name. All mentioned trademarks and logos belong to their respective owners and are used only for identification purposes".
            </p>
          </div>
            </div>
        </section>
    );
};

export default BrandPromotion;
