// import React, { useEffect, useState } from 'react'
// import { assets, dummyCarData } from '../../assets/assets';
// import Title from '../../Components/owner/Title';

// const Managecar = () => {
//   const [cars,setCars] = useState([]);

//   const fetchOwners = async () => {
//     setCars(dummyCarData);
//   }

//   useEffect(()=>{
//     fetchOwners();
//   },[])
//   return (
//     <div className='px-4 pt-10 md:px-10 w-full'>
//      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform"/>
//      <div className='max-w-3xl w-full  rounded-md overflow-hidden border border-gray-400 mt-6'>
//       <table className='w-full border-collapse text-left text-sm text-gray-600'>
//        <thead className='text-gray-500'>
//         <tr>
//           <th className='p-3 font-medium'>Car</th>
//           <th className='p-3 font-medium max-md:hidden'>Category</th>
//           <th className='p-3 font-medium'>Price</th>
//           <th className='p-3 font-medium max-md:hidden'>Status</th>
//           <th className='p-3 font-medium'>Actions</th>
//         </tr>
//        </thead>
//        <tbody>
//         {cars.map((car,index)=>(
//           <tr className='border-t border-gray-400' key={index}>
//            <td className='p-3 flex items-center gap-3'>
//             <img className='h-12 w-12 aspect-square rounded-md object-cover' src={car.image} alt="" />
//             <div className='max-md:hidden'>
//              <p className='font-medium'>{car.brand} {car.model}</p>
//              <p className='text-xs text-gray-500'>{car.seating_capacity} / {car.transmission}</p>
//             </div>
//            </td>
//            <td className='p-3 max-md:hidden'>{car.category}</td>
//            <td className='p-3'>${car.pricePerDay}/day</td>
//            <td className='p-3 max-md:hidden'>
//             <span className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? "bg-green-100 text-gray-500":"bg-red-100 text-red-500"}`}>
//               {car.isAvailable? "Available":"Unavailable"}
//             </span>
//            </td>
//            <td className='flex items-center p-3'>
//             <img className='cursor-pointer' src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="" />
//             <img className='cursor-pointer' src={assets.delete_icon} alt="" />
//            </td>
//           </tr>
//         ))}
//        </tbody>
//       </table>
//      </div>
//     </div>
//   )
// }

// export default Managecar

import React, { useEffect, useState } from "react";
import Title from "../../Components/owner/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCar,
  getOwnerCars,
  toggleCarAvailability,
  updateCar,
} from "../../redux/ownerSlice";

import toast from "react-hot-toast";

import {
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";

import {
  Trash2,
  Pencil,
  X,
  CarFront,
  EyeOff,
  Eye,
} from "lucide-react";

const Managecar = () => {
  const dispatch = useDispatch();

  const { cars, loading } = useSelector(
    (state) => state.owner
  );

  const [openDeleteModal, setOpenDeleteModal] =
    useState(false);

  const [openUpdateModal, setOpenUpdateModal] =
    useState(false);

  const [selectedCarId, setSelectedCarId] =
    useState("");

  const [updateLoading, setUpdateLoading] =
    useState(false);

  const [image, setImage] = useState(null);

  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    year: "",
    category: "",
    seating_capacity: "",
    fuel_type: "",
    transmission: "",
    pricePerDay: "",
    location: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    description: "",
    mileage: "",
    color: "",
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

  useEffect(() => {
    dispatch(getOwnerCars());
  }, [dispatch]);

  // DELETE CAR
  const handleDeleteCar = async () => {
    try {
      const result = await dispatch(
        deleteCar(selectedCarId)
      );

      if (result.payload?.success) {
        toast.success(result.payload.message);
        setOpenDeleteModal(false);
      } else {
        toast.error(
          result.payload?.message
        );
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  // OPEN UPDATE MODAL
  const openUpdatePopup = (car) => {
    setSelectedCarId(car._id);

    setCarData({
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || "",
      category: car.category || "",
      seating_capacity:
        car.seating_capacity || "",
      fuel_type: car.fuel_type || "",
      transmission:
        car.transmission || "",
      pricePerDay:
        car.pricePerDay || "",
      location: car.location || "",
      addressLine1:
        car.addressLine1 || "",
      addressLine2:
        car.addressLine2 || "",
      pincode: car.pincode || "",
      description:
        car.description || "",
      mileage: car.mileage || "",
      color: car.color || "",
      features: car.features || [],
    });

    setOpenUpdateModal(true);
  };

  // FEATURE SELECT
  const handleFeatureChange = (
    feature
  ) => {
    if (
      carData.features.includes(feature)
    ) {
      setCarData({
        ...carData,
        features:
          carData.features.filter(
            (item) => item !== feature
          ),
      });
    } else {
      setCarData({
        ...carData,
        features: [
          ...carData.features,
          feature,
        ],
      });
    }
  };

  // UPDATE CAR
  const handleUpdateCar = async (
    e
  ) => {
    e.preventDefault();

    try {
      setUpdateLoading(true);

      const formData = new FormData();

      Object.keys(carData).forEach(
        (key) => {
          if (key === "features") {
            formData.append(
              "features",
              JSON.stringify(
                carData.features
              )
            );
          } else {
            formData.append(
              key,
              carData[key]
            );
          }
        }
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      const result = await dispatch(
        updateCar({
          carId: selectedCarId,
          formData,
        })
      );

      if (result.payload?.success) {
        toast.success(
          result.payload.message
        );

        setOpenUpdateModal(false);

        dispatch(getOwnerCars());
      } else {
        toast.error(
          result.payload?.message
        );
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform"
      />

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 mt-8 bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">
                Car
              </th>

              <th className="p-4 font-semibold hidden md:table-cell">
                Category
              </th>

              <th className="p-4 font-semibold">
                Price
              </th>

              <th className="p-4 font-semibold hidden md:table-cell">
                Status
              </th>

              <th className="p-4 font-semibold text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {cars &&
            cars.length > 0 ? (
              cars.map((car) => (
                <tr
                  key={car._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-14 h-14 rounded-xl object-cover"
                        src={car.image}
                        alt=""
                      />

                      <div>
                        <h2 className="font-semibold text-gray-800">
                          {car.brand}{" "}
                          {car.model}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                          {
                            car.seating_capacity
                          }{" "}
                          Seats •{" "}
                          {
                            car.transmission
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 hidden md:table-cell">
                    {car.category}
                  </td>

                  <td className="p-4 font-medium text-blue-600">
                    $
                    {car.pricePerDay}
                    /day
                  </td>

                  <td className="p-4 hidden md:table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        car.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3 p-3">
                      <button onClick={async () => {
                        const result = await dispatch(toggleCarAvailability(car._id));
                        if(result.payload?.success){
                          toast.success(result.payload.message);
                        } else{
                          toast.error(result.payload?.message)
                        }
                      }} className={`p-2 rounded-lg transition-all cursor-pointer ${car.isAvailable ? "bg-red-100 hover:bg-red-200":"bg-green-100 hover:bg-green-200"}`}>
                       {car.isAvailable ? (<EyeOff size={18} className="text-red-600"/>):(<Eye size={18} className="text-green-600"/>)}
                      </button>
                      <button
                        onClick={() =>
                          openUpdatePopup(
                            car
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Pencil
                          size={18}
                          className="text-blue-600"
                        />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => {
                          setSelectedCarId(
                            car._id
                          );

                          setOpenDeleteModal(
                            true
                          );
                        }}
                        className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Trash2
                          size={18}
                          className="text-red-600"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-gray-500"
                >
                  {loading
                    ? "Loading Cars..."
                    : "No Cars Found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() =>
          setOpenDeleteModal(false)
        }
        popup
      >
        <ModalHeader />

        <ModalBody>
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2
                size={35}
                className="text-red-600"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-5">
              Delete Car
            </h3>

            <p className="text-gray-500 mt-2">
              Are you sure you want to
              delete this car?
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={
                  handleDeleteCar
                }
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer"
              >
                Yes Delete
              </button>

              <button
                onClick={() =>
                  setOpenDeleteModal(
                    false
                  )
                }
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        show={openUpdateModal}
        size="7xl"
        onClose={() =>
          setOpenUpdateModal(false)
        }
      >
        <ModalHeader>
          <div className="flex items-center gap-2">
            <CarFront size={22} />

            <span>
              Update Car Details
            </span>
          </div>
        </ModalHeader>

        <ModalBody>
          <form
            onSubmit={
              handleUpdateCar
            }
            className="space-y-6"
          >
            {/* IMAGE */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="image"
                className="cursor-pointer"
              >
                <img
                  className="w-28 h-28 rounded-2xl object-cover border"
                  src={
                    image
                      ? URL.createObjectURL(
                          image
                        )
                      : cars.find(
                          (c) =>
                            c._id ===
                            selectedCarId
                        )?.image
                  }
                  alt=""
                />

                <input
                  hidden
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(
                      e.target.files[0]
                    )
                  }
                />
              </label>

              <p className="text-gray-500">
                Click Image To Update
              </p>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <input
                type="text"
                placeholder="Brand"
                value={carData.brand}
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    brand:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="Model"
                value={carData.model}
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    model:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="number"
                placeholder="Year"
                value={carData.year}
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    year:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="number"
                placeholder="Price Per Day"
                value={
                  carData.pricePerDay
                }
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    pricePerDay:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="Location"
                value={
                  carData.location
                }
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    location:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <input
                type="number"
                placeholder="Pincode"
                value={
                  carData.pincode
                }
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    pincode:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <select
                value={
                  carData.category
                }
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    category:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              >
                <option value="">
                  Category
                </option>

                <option value="SUV">
                  SUV
                </option>

                <option value="SEDAN">
                  Sedan
                </option>

                <option value="HATCHBACK">
                  Hatchback
                </option>
              </select>

              <select
                value={
                  carData.transmission
                }
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    transmission:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              >
                <option value="">
                  Transmission
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

              <select
                value={
                  carData.fuel_type
                }
                onChange={(e) =>
                  setCarData({
                    ...carData,
                    fuel_type:
                      e.target.value,
                  })
                }
                className="border rounded-xl px-4 py-3 outline-none"
              >
                <option value="">
                  Fuel Type
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
              </select>
            </div>

            {/* DESCRIPTION */}
            <textarea
              rows={5}
              placeholder="Description"
              value={
                carData.description
              }
              onChange={(e) =>
                setCarData({
                  ...carData,
                  description:
                    e.target.value,
                })
              }
              className="w-full border rounded-2xl px-4 py-3 outline-none resize-none"
            />

            {/* FEATURES */}
            <div>
              <h2 className="font-semibold text-lg mb-4">
                Features
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featureOptions.map(
                  (feature) => (
                    <label
                      key={feature}
                      className={`border rounded-xl px-4 py-3 flex items-center gap-2 cursor-pointer ${
                        carData.features.includes(
                          feature
                        )
                          ? "bg-blue-50 border-blue-500"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={carData.features.includes(
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
                  )
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() =>
                  setOpenUpdateModal(
                    false
                  )
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  updateLoading
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Pencil size={18} />

                {updateLoading
                  ? "Updating..."
                  : "Update Car"}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Managecar;