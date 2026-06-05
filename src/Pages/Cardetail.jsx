import React, { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import { assets } from "../assets/assets";

import Loader from "../Components/Loader";

import { getPublicCars } from "../redux/ownerSlice";

import {
  createBooking,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../redux/bookingSlice";

const Cardetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { publicCars, loading } = useSelector((state) => state.owner);

  const { token } = useSelector((state) => state.user);

  const { loading: bookingLoading } = useSelector((state) => state.booking);

  const [car, setCar] = useState(null);

  const [pickupDate, setPickupDate] = useState("");

  const [returnDate, setReturnDate] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [specialRequest, setSpecialRequest] = useState("");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // FETCH CARS
  useEffect(() => {
    if (publicCars.length === 0) {
      dispatch(getPublicCars());
    }
  }, [dispatch, publicCars.length]);

  // FIND CAR
  useEffect(() => {
    const foundCar = publicCars.find((item) => item._id === id);

    if (foundCar) {
      setCar(foundCar);
    }
  }, [id, publicCars]);

  // TOTAL DAYS
  const totalDays = useMemo(() => {
    if (!pickupDate || !returnDate) {
      return 0;
    }

    const pickup = new Date(pickupDate);

    const returnD = new Date(returnDate);

    const diff = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));

    return diff > 0 ? diff : 0;
  }, [pickupDate, returnDate]);

  // TOTAL PRICE
  const totalPrice = totalDays > 0 ? totalDays * car?.pricePerDay : 0;

  // BOOK NOW
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please Login First");
      return;
    }

    if (!pickupDate || !returnDate || !pickupLocation || !mobileNumber) {
      toast.error("Please Fill All Fields");
      return;
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error("Return date must be greater than pickup date");
      return;
    }

    const bookingData = {
      car: car._id,
      pickupDate,
      returnDate,
      pickupLocation,
      mobileNumber,
      paymentMethod,
      specialRequest,
    };

    // CREATE BOOKING FIRST
    const bookingResult = await dispatch(createBooking(bookingData));

    if (!bookingResult.payload?.success) {
      toast.error(bookingResult.payload?.message || "Booking Failed");
      return;
    }

    const booking = bookingResult.payload.booking;

    // OFFLINE PAYMENT
    if (paymentMethod === "COD") {
      toast.success("Booking Created Successfully");

      navigate("/my-bookings");

      return;
    }

    const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

    // RAZORPAY PAYMENT
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Failed To Load Razorpay");
      return;
    }

    const orderResult = await dispatch(
      createRazorpayOrder({
        bookingId: booking._id,
      }),
    );

    if (!orderResult.payload?.success) {
      toast.error(orderResult.payload?.message || "Failed To Create Order");
      return;
    }

    const { order, key } = orderResult.payload;

    const options = {
      key,

      amount: order.amount,

      currency: order.currency,

      name: "Car Rental",

      description: "Car Booking Payment",

      order_id: order.id,

      handler: async function (response) {
        const verifyResult = await dispatch(
          verifyRazorpayPayment({
            bookingId: booking._id,

            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature,
          }),
        );

        if (verifyResult.payload?.success) {
          toast.success("Payment Successful");

          navigate("/my-bookings");
        } else {
          toast.error(
            verifyResult.payload?.message || "Payment Verification Failed",
          );
        }
      },

      prefill: {
        contact: mobileNumber,
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  if (loading || !car) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-10 px-4 md:px-10 lg:px-20 xl:px-32">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all mb-8 cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
          <img
            src={assets.arrow_icon}
            alt=""
            className="rotate-180 group-hover:brightness-0 group-hover:invert transition-all"
          />
        </div>

        <span className="font-medium text-sm md:text-base">Back To Cars</span>
      </button>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="xl:col-span-2">
          {/* CAR IMAGE */}
          <div className="relative overflow-hidden rounded-[32px] shadow-2xl">
            <img
              src={car.image}
              alt=""
              className="w-full h-[280px] md:h-[500px] object-cover hover:scale-105 duration-700 transition-all"
            />

            <div className="absolute top-5 left-5 bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg">
              Available Now
            </div>

            <div className="absolute bottom-5 right-5 bg-black/70 backdrop-blur-md text-white px-5 py-3 rounded-2xl">
              <p className="text-xs opacity-80">Price Per Day</p>

              <h2 className="text-2xl font-bold">₹{car.pricePerDay}</h2>
            </div>
          </div>

          {/* CAR INFO */}
          <div className="bg-white rounded-[32px] shadow-xl mt-8 p-6 md:p-10">
            {/* TITLE */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 capitalize leading-tight">
                  {car.brand} {car.model}
                </h1>

                <p className="mt-3 text-gray-500 text-lg">
                  {car.category} • {car.year}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 px-6 py-4 rounded-2xl">
                <p className="text-sm text-gray-500">Booking Status</p>

                <h3 className="text-blue-600 font-bold text-xl mt-1">
                  Ready To Book
                </h3>
              </div>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              {[
                {
                  icon: assets.users_icon,
                  title: "Seats",
                  value: `${car.seating_capacity} Seats`,
                },
                {
                  icon: assets.fuel_icon,
                  title: "Fuel",
                  value: car.fuel_type,
                },
                {
                  icon: assets.carIcon,
                  title: "Transmission",
                  value: car.transmission,
                },
                {
                  icon: assets.location_icon,
                  title: "Location",
                  value: car.location,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-blue-600 hover:text-white transition-all duration-300 rounded-3xl p-6 text-center group shadow-sm hover:shadow-xl"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white flex items-center justify-center shadow-md">
                    <img src={item.icon} alt="" className="h-6" />
                  </div>

                  <p className="mt-4 text-sm opacity-70">{item.title}</p>

                  <h3 className="mt-1 font-semibold text-sm md:text-base">
                    {item.value}
                  </h3>
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-5">
                Car Description
              </h2>

              <p className="text-gray-500 leading-8 text-[15px]">
                {car.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE BOOKING CARD */}
        <div>
          <form
            onSubmit={handleBooking}
            className="sticky top-24 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-7 text-white">
              <h2 className="text-3xl font-bold">Book This Car</h2>

              <p className="mt-2 text-blue-100">
                Secure your ride in just a few steps
              </p>
            </div>

            <div className="p-7">
              {/* PICKUP DATE */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Date
                </label>

                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* RETURN DATE */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Return Date
                </label>

                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={pickupDate || new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PICKUP LOCATION */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pickup Location
                </label>

                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter Pickup Location"
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* MOBILE */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>

                <input
                  type="number"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter Mobile Number"
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PAYMENT */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="COD">Offline Payment</option>

                  <option value="Razorpay">Razorpay</option>
                </select>
              </div>

              {/* SPECIAL REQUEST */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Request
                </label>

                <textarea
                  rows={4}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Any Special Request..."
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* TOTAL CARD */}
              {totalDays > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-100 rounded-3xl p-5 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-500">Total Days</span>

                    <span className="font-bold text-gray-800">
                      {totalDays} Days
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">
                      Total Price
                    </span>

                    <span className="text-3xl font-bold text-blue-600">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 transition-all duration-300 py-4 rounded-2xl text-white font-bold text-lg shadow-xl cursor-pointer disabled:opacity-70"
              >
                {bookingLoading ? "Booking..." : "Book Now"}
              </button>

              <p className="text-center text-sm text-gray-400 mt-5">
                Safe • Secure • Trusted Booking
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cardetail;
