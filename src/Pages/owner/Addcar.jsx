import React, { useState } from "react";
import Title from "../../Components/owner/Title";
import { assets } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { addCar } from "../../redux/ownerSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Addcar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.owner);
  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    mileage: "",
    color: "",
    description: "",
    features: [],
  });
  const featureOptions = [
    "360 Camera",
    "Bluetooth",
    "GPS Navigation",
    "Heated Seats",
    "Rear View Mirror",
    "USB Charging",
    "Sunroof",
    "Airbags",
  ];
  const handleFeatureChange = (feature) => {
    if (car.features.includes(feature)) {
      setCar({
        ...car,
        features: car.features.filter((item) => item !== feature),
      });
    } else {
      setCar({
        ...car,
        features: [...car.features, feature],
      });
    }
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      return toast.error("Please Upload Car Image");
    }
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("brand", car.brand);
      formData.append("model", car.model);
      formData.append("year", car.year);
      formData.append("pricePerDay", car.pricePerDay);
      formData.append("category", car.category);
      formData.append("transmission", car.transmission);
      formData.append("fuel_type", car.fuel_type);
      formData.append("seating_capacity",car.seating_capacity);
      formData.append("location", car.location);
      formData.append("addressLine1",car.addressLine1);
      formData.append("addressLine2",car.addressLine2);
      formData.append("pincode", car.pincode);
      formData.append("mileage", car.mileage);
      formData.append("color", car.color);
      formData.append("description", car.description);
      formData.append("features",JSON.stringify(car.features));
      const result = await dispatch(addCar(formData));
      if (result.payload?.success) {
        toast.success(result.payload.message);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          location: "",
          addressLine1: "",
          addressLine2: "",
          pincode: "",
          mileage: "",
          color: "",
          description: "",
          features: [],
        });
        setImage(null);
        navigate("/owner/manage-cars");
      } else {
        toast.error(
          result.payload?.message ||
            "Failed To Add Car"
        );
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1 bg-gray-50 min-h-screen">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-white shadow-lg rounded-3xl p-6 md:p-8 mt-8 max-w-6xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <label
            htmlFor="car-image"
            className="cursor-pointer"
          >
            <img
              className="w-28 h-28 rounded-2xl object-cover border-2 border-dashed border-gray-300 p-2"
              src={
                image
                  ? URL.createObjectURL(image)
                  : assets.upload_icon
              }
              alt=""
            />
            <input
              type="file"
              id="car-image"
              hidden
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />
          </label>
          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              Upload Car Image
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG or WEBP supported
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium">
              Brand
            </label>
            <input
              type="text"
              placeholder="Enter Car Brand"
              value={car.brand}
              onChange={(e) =>
                setCar({
                  ...car,
                  brand: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Model
            </label>
            <input
              type="text"
              placeholder="Enter Car Model"
              value={car.model}
              onChange={(e) =>
                setCar({
                  ...car,
                  model: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="flex flex-col">
            <label className="font-medium">
              Year
            </label>
            <input
              type="number"
              placeholder="2025"
              value={car.year}
              onChange={(e) =>
                setCar({
                  ...car,
                  year: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Price Per Day
            </label>
            <input
              type="number"
              placeholder="500"
              value={car.pricePerDay}
              onChange={(e) =>
                setCar({
                  ...car,
                  pricePerDay: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Mileage
            </label>
            <input
              type="number"
              placeholder="20"
              value={car.mileage}
              onChange={(e) =>
                setCar({
                  ...car,
                  mileage: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Color
            </label>
            <input
              type="text"
              placeholder="Black"
              value={car.color}
              onChange={(e) =>
                setCar({
                  ...car,
                  color: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="flex flex-col">
            <label className="font-medium">
              Category
            </label>
            <select
              value={car.category}
              onChange={(e) =>
                setCar({
                  ...car,
                  category: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            >
              <option value="">
                Select Category
              </option>
              <option value="Sedan">
                Sedan
              </option>
              <option value="SUV">
                SUV
              </option>
              <option value="Hatchback">
                Hatchback
              </option>
              <option value="Luxury">
                Luxury
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Transmission
            </label>
            <select
              value={car.transmission}
              onChange={(e) =>
                setCar({
                  ...car,
                  transmission: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            >
              <option value="">
                Select Transmission
              </option>
              <option value="Automatic">
                Automatic
              </option>
              <option value="Manual">
                Manual
              </option>
              <option value="Semi-Automatic">
                Semi-Automatic
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Fuel Type
            </label>
            <select
              value={car.fuel_type}
              onChange={(e) =>
                setCar({
                  ...car,
                  fuel_type: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            >
              <option value="">
                Select Fuel Type
              </option>
              <option value="Petrol">
                Petrol
              </option>
              <option value="Diesel">
                Diesel
              </option>
              <option value="Electric">
                Electric
              </option>
              <option value="Hybrid">
                Hybrid
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Seating Capacity
            </label>
            <input
              type="number"
              placeholder="5"
              value={car.seating_capacity}
              onChange={(e) =>
                setCar({
                  ...car,
                  seating_capacity:
                    e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <label className="font-medium">
              Location
            </label>
            <select
              value={car.location}
              onChange={(e) =>
                setCar({
                  ...car,
                  location: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            >
              <option value="">
                Select Location
              </option>
              <option value="Delhi">
                Delhi
              </option>
              <option value="Noida">
                Noida
              </option>
              <option value="Ghaziabad">
                Ghaziabad
              </option>
              <option value="Gurgaon">
                Gurgaon
              </option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Pincode
            </label>
            <input
              type="number"
              placeholder="Enter Pincode"
              value={car.pincode}
              onChange={(e) =>
                setCar({
                  ...car,
                  pincode: e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <label className="font-medium">
              Address Line 1
            </label>
            <input
              type="text"
              placeholder="Street Address"
              value={car.addressLine1}
              onChange={(e) =>
                setCar({
                  ...car,
                  addressLine1:
                    e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              Address Line 2
            </label>
            <input
              type="text"
              placeholder="Apartment, Area"
              value={car.addressLine2}
              onChange={(e) =>
                setCar({
                  ...car,
                  addressLine2:
                    e.target.value,
                })
              }
              className="px-4 py-3 mt-2 border border-gray-300 rounded-xl outline-none"
            />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold text-lg text-gray-800 mb-4">
            Car Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featureOptions.map((feature) => (
              <label
                key={feature}
                className={`flex items-center gap-2 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                  car.features.includes(
                    feature
                  )
                    ? "bg-blue-50 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={car.features.includes(
                    feature
                  )}
                  onChange={() =>
                    handleFeatureChange(
                      feature
                    )
                  }
                />
                <span className="text-sm">
                  {feature}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col mt-8">
          <label className="font-medium">
            Description
          </label>
          <textarea
            rows={5}
            placeholder="Enter Car Description"
            value={car.description}
            onChange={(e) =>
              setCar({
                ...car,
                description: e.target.value,
              })
            }
            className="px-4 py-3 mt-2 border border-gray-300 rounded-2xl outline-none resize-none"
            required
          />
        </div>
        <button
          disabled={loading}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-8 py-4 rounded-2xl mt-8 font-semibold shadow-lg cursor-pointer"
        >
          <img
            className="w-5"
            src={assets.tick_icon}
            alt=""
          />
          {loading
            ? "Adding Car..."
            : "List Your Car"}
        </button>
      </form>
    </div>
  );
};

export default Addcar;