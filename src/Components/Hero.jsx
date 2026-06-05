import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: "",
    pickupDate: "",
    returnDate: "",
  });

  const onSubmitHandler = (e) => {

    e.preventDefault();

    const { location, pickupDate, returnDate } =
      formData;

    if (
      !location ||
      !pickupDate ||
      !returnDate
    ) {
      return;
    }

    // SAVE SEARCH DATA
    localStorage.setItem(
      "carSearchData",
      JSON.stringify(formData)
    );

    navigate(
      `/cars?location=${location}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      <div className="text-center mb-12">

        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
          Luxury Cars{" "}
          <span className="text-blue-600">
            On Rent
          </span>
        </h1>

        <p className="mt-4 text-gray-500 text-lg">
          Premium cars at affordable prices
        </p>

      </div>

      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6 md:p-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

          {/* LOCATION */}
          <div className="flex flex-col">

            <label className="text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>

            <select
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e.target.value,
                })
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="">
                Select Location
              </option>

              {cityList.map((city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* PICKUP DATE */}
          <div className="flex flex-col">

            <label className="text-sm font-medium text-gray-700 mb-2">
              Pick-up Date
            </label>

            <input
              required
              type="date"
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              value={formData.pickupDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pickupDate: e.target.value,
                })
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* RETURN DATE */}
          <div className="flex flex-col">

            <label className="text-sm font-medium text-gray-700 mb-2">
              Return Date
            </label>

            <input
              required
              type="date"
              min={formData.pickupDate}
              value={formData.returnDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returnDate: e.target.value,
                })
              }
              className="border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <div className="flex h-full items-end">

            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl font-medium cursor-pointer">

              <img
                src={assets.search_icon}
                alt=""
                className="w-5 h-5 brightness-0 invert"
              />

              Search

            </button>
          </div>
        </div>
      </form>

      <img
        className="max-h-74"
        src={assets.main_car}
        alt=""
      />
    </div>
  );
};

export default Hero;