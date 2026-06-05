import React, { useEffect } from "react";
import { assets } from "../../assets/assets";
import Title from "../../Components/owner/Title";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../redux/ownerSlice";
import Loader from "../../Components/Loader";

const Dashboard = () => {

  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector(
    (state) => state.owner
  );
  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);
  if (loading && !dashboardData) {
    return <Loader />;
  }
  const data = dashboardData || {
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  };
  const dashboardCards = [
    {
      title: "Total Cars",
      value: data.totalCars,
      icon: assets.carIconColored,
    },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Confirmed",
      value: data.confirmedBookings,
      icon: assets.listIconColored,
    },
  ];

  return (
    <div className="px-4 pt-10 md:px-10 flex-1 min-h-screen bg-gray-50">

      <Title
        title="Owner Dashboard"
        subTitle="Monitor your cars, bookings, revenue, and latest booking activities"
      />

      {/* DASHBOARD CARDS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">

        {dashboardCards.map((card, index) => (

          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <h1 className="text-sm text-gray-500">
                  {card.title}
                </h1>

                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {card.value}
                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                <img
                  className="w-6 h-6"
                  src={card.icon}
                  alt=""
                />

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LOWER SECTION */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* RECENT BOOKINGS */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

          <div className="mb-6">

            <h1 className="text-xl font-semibold text-gray-800">
              Recent Bookings
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Latest customer bookings
            </p>

          </div>

          {data.recentBookings.length > 0 ? (

            <div className="space-y-4">

              {data.recentBookings.map((booking, index) => (

                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-all"
                >

                  <div className="flex items-center gap-4">

                    <div className="hidden md:flex w-12 h-12 rounded-full bg-blue-100 items-center justify-center">

                      <img
                        className="w-5 h-5"
                        src={assets.listIconColored}
                        alt=""
                      />

                    </div>

                    <div>

                      <h2 className="font-semibold text-gray-800">
                        {booking?.car?.brand} {booking?.car?.model}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {booking?.createdAt?.split("T")[0]}
                      </p>

                    </div>
                  </div>

                  <div className="flex items-center gap-3">

                    <p className="font-semibold text-blue-600">
                      ${booking?.totalPrice}
                    </p>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        booking?.status?.toLowerCase() === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : booking?.status?.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking?.status}
                    </span>

                  </div>
                </div>
              ))}
            </div>

          ) : (

            <div className="text-center py-12 text-gray-500">
              No Recent Bookings
            </div>

          )}
        </div>

        {/* REVENUE CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">

          <h1 className="text-xl font-semibold text-gray-800">
            Monthly Revenue
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Revenue from confirmed bookings
          </p>

          <div className="mt-8">

            <h2 className="text-5xl font-bold text-blue-600">
              ${data.monthlyRevenue}
            </h2>

          </div>

          <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-blue-50">

            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

              <img
                className="w-5 h-5"
                src={assets.listIconColored}
                alt=""
              />

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Confirmed Bookings
              </p>

              <h3 className="font-semibold text-gray-800">
                {data.confirmedBookings}
              </h3>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;