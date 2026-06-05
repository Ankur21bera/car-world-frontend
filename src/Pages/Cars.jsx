import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Title from "../Components/Title";
import { assets } from "../assets/assets";
import Carcard from "../Components/Carcard";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  checkAvailabilityOfCar,
} from "../redux/bookingSlice";

import {
  useSearchParams,
} from "react-router-dom";

import { Spinner } from "flowbite-react";

const Cars = () => {

  const dispatch = useDispatch();

  const [searchParams] =
    useSearchParams();

  const [input, setInput] =
    useState("");

 const savedSearch =
  JSON.parse(
    localStorage.getItem("carSearchData")
  ) || {};

const location =
  searchParams.get("location") ||
  savedSearch.location ||
  "";

const pickupDate =
  searchParams.get("pickupDate") ||
  savedSearch.pickupDate ||
  "";

const returnDate =
  searchParams.get("returnDate") ||
  savedSearch.returnDate ||
  "";

  const {
    availableCars = [],
    loading,
  } = useSelector(
    (state) => state.booking
  );

  // FETCH AGAIN AFTER RELOAD
  useEffect(() => {

    const fetchCars = async () => {

      if (
        location &&
        pickupDate &&
        returnDate
      ) {

        dispatch(
          checkAvailabilityOfCar({
            location,
            pickupDate,
            returnDate,
          })
        );
      }
    };

    fetchCars();

  }, [
    dispatch,
    location,
    pickupDate,
    returnDate,
  ]);

  // FILTER SEARCH
  const filteredCars =
    useMemo(() => {

      return availableCars.filter(
        (car) =>
          `${car.brand} ${car.model}`
            .toLowerCase()
            .includes(
              input.toLowerCase()
            )
      );

    }, [availableCars, input]);

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col items-center py-20 bg-gray-200 max-md:px-4">

        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        {/* SEARCH BAR */}
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">

          <img
            className="w-4.5 h-4.5 mr-2"
            src={assets.search_icon}
            alt=""
          />

          <input
            onChange={(e) =>
              setInput(e.target.value)
            }
            value={input}
            className="w-full h-full outline-none text-gray-500"
            type="text"
            placeholder="Search Cars..."
          />

          <img
            className="w-4.5 h-4.5 ml-2"
            src={assets.filter_icon}
            alt=""
          />

        </div>

        {/* SEARCH DETAILS */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">

          <span className="bg-white px-4 py-2 rounded-full shadow">
            📍 {location}
          </span>

          <span className="bg-white px-4 py-2 rounded-full shadow">
            📅 {pickupDate}
          </span>

          <span className="bg-white px-4 py-2 rounded-full shadow">
            🔁 {returnDate}
          </span>

        </div>

      </div>

      {/* CARS */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">

        {loading ? (

          <div className="flex justify-center items-center py-20">
            <Spinner size="xl" />
          </div>

        ) : (
          <>
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredCars.length}
              </span>{" "}
              Cars
            </p>

            {filteredCars.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-20">

                <img
                  src={assets.carIconColored}
                  alt=""
                  className="w-20 opacity-60"
                />

                <h2 className="mt-5 text-2xl font-bold text-gray-700">
                  No Cars Available
                </h2>

                <p className="text-gray-500 mt-2">
                  Try changing location or dates
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">

                {filteredCars.map(
                  (car) => (
                    <div key={car._id}>
                      <Carcard car={car} />
                    </div>
                  )
                )}

              </div>

            )}
          </>
        )}

      </div>

    </div>
  );
};

export default Cars;