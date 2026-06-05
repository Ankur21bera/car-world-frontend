import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserImage } from "../../redux/ownerSlice";
import { getUserData } from "../../redux/userSlice";
import toast from "react-hot-toast";

const Sidebar = () => {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateImage = async () => {

    if (!image) {
      return toast.error("Please Select Image");
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("image", image);

      const result = await dispatch(updateUserImage(formData));

      if (result.payload?.success) {

        toast.success(result.payload.message);

        await dispatch(getUserData());

        setImage("");

      } else {

        toast.error(result.payload?.message);

      }

    } catch (error) {

      toast.error("Something Went Wrong");

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">

        <div className="flex items-center gap-3">

          <img
            className="w-10 h-10 rounded-full object-cover"
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image || assets.user_profile
            }
            alt=""
          />

          <div>
            <h2 className="font-semibold text-gray-800 text-sm">
              {user?.name || "Owner"}
            </h2>

            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "user"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
        >
          <img
            className="w-5 h-5"
            src={open ? assets.close_icon : assets.menu_icon}
            alt=""
          />
        </button>
      </div>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-300 md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-auto bg-white border-r border-gray-200 flex flex-col w-[280px] md:w-[260px] transition-all duration-300 shadow-xl md:shadow-sm ${
          open
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >

        {/* PROFILE SECTION */}
        <div className="flex flex-col items-center py-8 border-b border-gray-100 px-5 mt-14 md:mt-0">

          <div className="relative group">

            <label htmlFor="image" className="cursor-pointer">

              <img
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                src={
                  image
                    ? URL.createObjectURL(image)
                    : user?.image || assets.user_profile
                }
                alt=""
              />

              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <img
                  className="w-5 h-5"
                  src={assets.edit_icon}
                  alt=""
                />
              </div>

              <input
                hidden
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />

            </label>

            {image && (
              <button
                onClick={updateImage}
                disabled={loading}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 hover:bg-blue-700 transition-all"
              >
                {loading ? "Saving..." : "Save"}

                {!loading && (
                  <img
                    className="w-3 h-3"
                    src={assets.check_icon}
                    alt=""
                  />
                )}
              </button>
            )}

          </div>

          <div className="text-center mt-5">

            <h2 className="text-lg font-semibold text-gray-800">
              {user?.name || "Owner"}
            </h2>

            <p className="text-sm text-gray-500 mt-1 break-all">
              {user?.email}
            </p>

            <span className="inline-block mt-3 px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium capitalize">
              {user?.role || "user"}
            </span>

          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-6">

          <div className="space-y-3">

            {ownerMenuLinks.map((link, index) => (

              <NavLink
                key={index}
                to={link.path}
                end={link.path === "/owner"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-600"
                  }`
                }
              >

                {({ isActive }) => (
                  <>
                    <div
                      className={`flex items-center justify-center min-w-[45px] h-[45px] rounded-xl transition-all ${
                        isActive
                          ? "bg-white/20"
                          : "bg-gray-100 group-hover:bg-white"
                      }`}
                    >
                      <img
                        className="w-5 h-5"
                        src={
                          isActive
                            ? link.coloredIcon
                            : link.icon
                        }
                        alt=""
                      />
                    </div>

                    <span className="font-medium text-sm">
                      {link.name}
                    </span>
                  </>
                )}

              </NavLink>

            ))}

          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;