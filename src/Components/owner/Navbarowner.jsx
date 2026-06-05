import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbarowner = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border border-gray-200 relative transition-all">
      <Link to="/">
        <img className="h-7" src={assets.logo} alt="" />
      </Link>
      <div className="flex items-center gap-3">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user?.image || assets.user_profile}
          alt=""
        />
        <p>
          Welcome, {user?.name || "Owner"}
       </p>

      </div>
    </div>
  );
};

export default Navbarowner;