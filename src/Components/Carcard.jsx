import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Carcard = ({ car }) => {
    const navigate = useNavigate();
  return (
    <div onClick={()=>{navigate(`/car-details/${car._id}`)}} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-100">
      <div className="relative h-56 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={car.image}
          alt={car.model}
        />
        {car.isAvailable && (
          <p className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
            Available Now
          </p>
        )}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg">
          <span className="text-lg font-semibold">
            ${car.pricePerDay}
          </span>
          <span className="text-sm text-gray-300 ml-1">
            /day
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 truncate">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {car.category} • {car.year}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <img
              className="w-4 h-4 object-contain"
              src={assets.users_icon}
              alt=""
            />
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-4 h-4 object-contain"
              src={assets.fuel_icon}
              alt=""
            />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-4 h-4 object-contain"
              src={assets.car_icon}
              alt=""
            />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              className="w-4 h-4 object-contain"
              src={assets.location_icon}
              alt=""
            />
            <span className="truncate">{car.location}</span>
          </div>
        </div>
        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-3 rounded-xl font-medium cursor-pointer">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Carcard;