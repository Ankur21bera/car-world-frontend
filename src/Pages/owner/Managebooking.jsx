import React, { useEffect } from "react";
import Title from "../../Components/owner/Title";
import { useDispatch, useSelector } from "react-redux";
import { approveOfflinePayment, getOwnerBookings } from "../../redux/bookingSlice";

import {
  Card,
  Badge,
  Spinner,
} from "flowbite-react";

import {
  CalendarDays,
  Car,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

const Managebooking = () => {
  const dispatch = useDispatch();

  const {
    ownerBookings = [],
    loading,
  } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getOwnerBookings());
  }, [dispatch]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const handleApproveOfflinePayment = async (bookingId) => {
    const confirm = window.confirm("Aprrove This Offline Payment?");
    if(!confirm) return;
    const result = await dispatch(approveOfflinePayment({bookingId}))
    if(result.payload?.success){
      toast.success(result.payload.message)
      dispatch(getOwnerBookings());
    } else{
      toast.error(result.payload?.message || "Failed To Approve Payment")
    }
  }

  return (
    <div className="px-4 pt-10 md:px-10 w-full">

      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, payment details, and booking statuses"
      />

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <Spinner size="xl" />
        </div>
      ) : ownerBookings?.length === 0 ? (

        /* EMPTY */
        <div className="mt-16 flex flex-col items-center justify-center text-center">

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <CalendarDays
              size={35}
              className="text-blue-500"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-800">
            No Bookings Found
          </h2>

          <p className="text-gray-500 mt-2 max-w-md">
            You don’t have any customer bookings yet.
          </p>
        </div>

      ) : (

        /* BOOKINGS */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          {ownerBookings?.map((booking) => (

            <Card
              key={booking._id}
              className="rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
            >

              {/* TOP SECTION */}
              <div className="flex flex-col lg:flex-row gap-5">

                {/* IMAGE */}
                <img
                  src={booking?.car?.image}
                  alt=""
                  className="w-full lg:w-44 h-52 lg:h-44 rounded-2xl object-cover"
                />

                {/* DETAILS */}
                <div className="flex-1">

                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 capitalize">
                        {booking?.car?.brand}{" "}
                        {booking?.car?.model}
                      </h2>

                      <p className="text-gray-500 mt-1 text-sm">
                        {booking?.car?.category} •{" "}
                        {booking?.car?.transmission} •{" "}
                        {booking?.car?.fuel_type}
                      </p>
                    </div>

                    {/* STATUS */}
                    <Badge
                      color={
                        booking?.status === "confirmed"
                          ? "success"
                          : booking?.status === "pending"
                          ? "warning"
                          : "failure"
                      }
                      className="capitalize"
                    >
                      {booking?.status}
                    </Badge>
                  </div>

                  {/* DATE */}
                  <div className="flex items-center gap-2 mt-5 text-gray-600 text-sm">

                    <CalendarDays size={18} />

                    <span>
                      {formatDate(
                        booking?.pickupDate
                      )}{" "}
                      to{" "}
                      {formatDate(
                        booking?.returnDate
                      )}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div className="flex items-center gap-2 mt-4">

                    <CreditCard
                      size={18}
                      className="text-blue-500"
                    />

                    <p className="text-lg font-semibold text-gray-800">
                      ₹{booking?.totalPrice}
                    </p>
                  </div>

                  {/* PAYMENT */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      {booking?.paymentMethod}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking?.paymentStatus ===
                        "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {booking?.paymentStatus}
                    </span>

                  </div>
                  {booking?.paymentMethod === "COD" &&
  booking?.paymentStatus === "pending" &&
  booking?.status !== "cancelled" && (
    <button
      onClick={() =>
        handleApproveOfflinePayment(booking._id)
      }
      className="mt-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 cursor-pointer"
    >
      Approve Offline Payment
    </button>
)}
                </div>
              </div>

              {/* CUSTOMER DETAILS */}
              <div className="mt-7 border-t border-gray-200 pt-6">

                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                  Customer Details
                </h3>

                <div className="grid sm:grid-cols-2 gap-5">

                  {/* NAME */}
                  <div className="flex gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User
                        size={18}
                        className="text-blue-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Customer Name
                      </p>

                      <p className="font-medium text-gray-800">
                        {booking?.user?.name}
                      </p>
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="flex gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail
                        size={18}
                        className="text-blue-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <p className="font-medium text-gray-800 break-all">
                        {booking?.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="flex gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Phone
                        size={18}
                        className="text-blue-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Phone Number
                      </p>

                      <p className="font-medium text-gray-800">
                        {booking?.user?.mobileNumber}
                      </p>
                    </div>
                  </div>

                  {/* PICKUP */}
                  <div className="flex gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Car
                        size={18}
                        className="text-blue-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Pickup Location
                      </p>

                      <p className="font-medium text-gray-800">
                        {booking?.pickupLocation}
                      </p>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="flex gap-3 sm:col-span-2">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin
                        size={18}
                        className="text-blue-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Address
                      </p>

                      <p className="font-medium text-gray-800">
                        {booking?.user?.addressLine1},{" "}
                        {
                          booking?.user
                            ?.addressLine2
                        }
                        , {booking?.user?.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SPECIAL REQUEST */}
                {booking?.specialRequest && (

                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-4">

                    <p className="text-sm text-gray-500 mb-1">
                      Special Request
                    </p>

                    <p className="text-sm text-gray-700">
                      {booking?.specialRequest}
                    </p>

                  </div>
                )}

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Managebooking;