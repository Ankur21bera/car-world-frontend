import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../redux/userSlice";
import { changeRoleToOwner } from "../redux/ownerSlice";

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.user);

  const handleDashboard = () => {
    setOpen(false);
    if (!token) {
      toast.error("Please Login First");
      setShowLogin(true);
      return;
    }
    if (user?.role === "owner") {
      navigate("/owner");
      return;
    }
    setOpenModal(true);
  };

  const handleBecomeOwner = async () => {
    const result = await dispatch(changeRoleToOwner());

    if (result.payload?.success) {
      toast.success("Become Owner Successfully");
      navigate("/owner");
      setOpenModal(false);
    } else {
      toast.error(result.payload?.message);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <>
      {/* OWNER MODAL */}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Become Car Owner</ModalHeader>

        <ModalBody>
          <div className="space-y-3">
            <p className="text-gray-600">
              This feature is only for car owners.
            </p>

            <p className="text-gray-600">
              Do you want to become a car owner and list your cars?
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <button
            onClick={handleBecomeOwner}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            Yes Become Owner
          </button>

          <button
            onClick={() => setOpenModal(false)}
            className="px-5 py-2 bg-gray-200 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>

      <div
        className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 relative z-50 transition-all duration-300 ${
          location.pathname === "/" ? "bg-amber-50 shadow-sm" : "bg-white"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <img className="h-8" src={assets.logo} alt="logo" />
        </Link>

        <div
          className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 right-0 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 max-sm:p-6 transition-all duration-300 ${
            location.pathname === "/" ? "bg-amber-50" : "bg-white"
          } ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
        >
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`relative text-sm font-medium transition-all duration-200 hover:text-primary ${
                location.pathname === link.path ? "text-primary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 py-1.5 rounded-full max-w-60 focus-within:ring-2 focus-within:ring-primary">
            <input
              className="w-full bg-transparent outline-none placeholder-gray-400"
              type="text"
              placeholder="Search cars..."
            />

            <img
              src={assets.search_icon}
              alt="search"
              className="w-4 h-4 opacity-70"
            />
          </div>

          <div className="flex max-sm:flex-col items-start sm:items-center gap-4">
            <button
              onClick={handleDashboard}
              className="text-sm font-medium hover:text-primary transition cursor-pointer"
            >
              Dashboard
            </button>

            {token ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 cursor-pointer transition-all text-white rounded-lg text-sm shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  setOpen(false);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-800 cursor-pointer transition-all text-white rounded-lg text-sm shadow-sm hover:shadow-md"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          <img
            src={open ? assets.close_icon : assets.menu_icon}
            alt="menu"
            className="w-5 h-5"
          />
        </button>
      </div>
    </>
  );
};

export default Navbar;