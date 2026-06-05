import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Title from "../Components/Title";
import {
  cancelBooking,
  getUserBookings,
  requestOfflinePayment,
} from "../redux/bookingSlice";
import toast from "react-hot-toast";

const Mybooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userBookings, loading } = useSelector((state) => state.booking);

  const bookings = userBookings || [];

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

 const totalSpent = bookings.reduce(
  (acc, booking) => acc + (booking?.totalPrice || 0),
  0
);

 const confirmedBookings = bookings.filter(
  (booking) => booking?.status === "confirmed"
);

const pendingPayments = bookings.filter(
  (booking) => booking?.paymentStatus === "pending"
);
  const handleCancelBooking = async (bookingId) => {
    const confirm = window.confirm("Are You Sure You Want To Cancel");
    if (!confirm) return;
    const result = await dispatch(
      cancelBooking({ bookingId, reason: "Cancelled By User" }),
    );
    if (result.payload?.success) {
      toast.success(result.payload.message);
      dispatch(getUserBookings());
    } else {
      toast.error(result.payload?.message || "Failed To Cancel Booking");
    }
  };

  const handleOfflinePayment = async (bookingId) => {
    const result = await dispatch(requestOfflinePayment({ bookingId }));
    if (result.payload?.success) {
      toast.success(result.payload.message);
      dispatch(getUserBookings());
    } else {
      toast.error(
        result.payload?.message || "Failed To Sent Offline Payment Request",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="h-14 w-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-32 py-10 bg-gradient-to-b from-gray-50 via-white to-blue-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
        <Title
          title="My Bookings"
          subTitle="Manage all your car bookings and payments"
          align="left"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total</p>

            <h2 className="text-3xl font-bold mt-2">{bookings.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Confirmed</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {confirmedBookings.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Pending</p>

            <h2 className="text-3xl font-bold text-yellow-500 mt-2">
              {pendingPayments.length}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Spent</p>

            <h2 className="text-2xl font-bold text-blue-600 mt-2">
              ₹{totalSpent}
            </h2>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center py-24">
          <img src={assets.carIconColored} alt="" className="w-24 opacity-60" />

          <h2 className="text-3xl font-bold mt-6">No Bookings Found</h2>

          <p className="text-gray-500 mt-3">Book your first car today.</p>

          <button
            onClick={() => navigate("/cars")}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-800"
          >
            Explore Cars
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <div className="grid lg:grid-cols-4 gap-6 p-6">
                {/* IMAGE */}
                <div>
                  <img
                    src={booking.car?.image}
                    alt=""
                    className="w-full h-56 object-cover rounded-2xl"
                  />

                  <div className="mt-4">
                    <h2 className="text-2xl font-bold capitalize">
                      {booking.car?.brand} {booking.car?.model}
                    </h2>

                    <p className="text-gray-500">
                      {booking.car?.year} • {booking.car?.category}
                    </p>

                    <p className="text-gray-500 mt-2">
                      📍 {booking.car?.location}
                    </p>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="lg:col-span-2">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold
                      ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.status}
                    </span>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold
                      ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-gray-500 text-sm">Pickup Date</p>

                      <h3 className="font-semibold mt-1">
                        {booking.pickupDate?.split("T")[0]}
                      </h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-gray-500 text-sm">Return Date</p>

                      <h3 className="font-semibold mt-1">
                        {booking.returnDate?.split("T")[0]}
                      </h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-gray-500 text-sm">Pickup Location</p>

                      <h3 className="font-semibold mt-1">
                        {booking.pickupLocation}
                      </h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-gray-500 text-sm">Mobile Number</p>

                      <h3 className="font-semibold mt-1">
                        {booking.mobileNumber}
                      </h3>
                    </div>
                  </div>

                  {/* OWNER */}
                  <div className="bg-blue-50 rounded-2xl p-5 mt-5">
                    <h3 className="font-semibold mb-2">Owner Details</h3>

                    <p>{booking.owner?.name}</p>
                    <p>{booking.owner?.email}</p>
                    <p>{booking.owner?.mobileNumber}</p>
                  </div>

                  {booking.specialRequest && (
                    <div className="mt-5 bg-yellow-50 p-4 rounded-2xl">
                      <p className="text-sm text-gray-500">Special Request</p>

                      <p className="mt-1">{booking.specialRequest}</p>
                    </div>
                  )}
                  <div className="mt-4 flex flex-col gap-3">
                    {booking.paymentMethod !== "COD" &&
 booking.paymentStatus !== "paid" &&
 booking.status !== "cancelled" && (
  <button
    onClick={() => handleOfflinePayment(booking._id)}
    className="w-full bg-green-500 hover:bg-green-700 text-white py-3 rounded-xl"
  >
    Request Offline Payment
  </button>
)}

{booking.paymentMethod === "COD" &&
 booking.paymentStatus === "pending" && (
  <div className="w-full bg-yellow-100 text-yellow-700 py-3 rounded-xl text-center font-medium">
    Offline Payment Requested
  </div>
)}
                    {booking.status !== "cancelled" && (
                      <button
                        className="w-full bg-red-500 hover:bg-red-800 text-white py-3 rounded-xl transition-all duration-300 cursor-pointer"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>

                {/* PRICE CARD */}
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-6 h-full">
                    <h4 className="text-gray-500">Total Price</h4>

                    <h2 className="text-5xl font-bold text-blue-600 mt-3">
                      ₹{booking.totalPrice}
                    </h2>

                    <hr className="my-6" />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Days</span>

                        <span>{booking.totalDays}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Per Day</span>

                        <span>₹{booking.pricePerDay}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment</span>

                        <span>{booking.paymentMethod}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Booked On</span>

                        <span>{booking.createdAt?.split("T")[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mybooking;
