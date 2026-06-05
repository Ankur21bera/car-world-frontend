import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  forgotPassword,
  loginUser,
  registerUser,
  resendOtp,
  resetPassword,
  verifyOtp,
} from "../redux/userSlice";
import toast from "react-hot-toast";

const Login = ({ setShowLogin }) => {
  const dispatch = useDispatch();
  const { loading, success, message, error } = useSelector(
    (state) => state.user,
  );
  const [state, setState] = useState("login");
  const [registerData, setRegisterData] = useState({
  name: "",
  email: "",
  password: "",
  mobileNumber: "",
  age: "",
  addressLine1: "",
  addressLine2: "",
  pincode: "",
});
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearMessage());
    }

    if (error) {
      toast.error(error);
      dispatch(clearMessage());
    }
  }, [success, message, error, dispatch]);
  useEffect(() => {
    let interval;
    if (state === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state, timer]);
  const closeModal = () => {
    setShowLogin(false);
    setState("login");
    setErrors({});
  };
  const validateRegister = () => {
    let newErrors = {};
    if (!registerData.name.trim()) {
      newErrors.name = "Name Is Required";
    }
    if (!registerData.email.trim()) {
      newErrors.email = "Email Is Required";
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      newErrors.email = "Please Enter Valid Email";
    }
    if (!registerData.password.trim()) {
      newErrors.password = "Password Is Required";
    } else if (registerData.password.length < 6) {
      newErrors.password = "Minimum 6 Characters Required";
    }
    if (!registerData.mobile.trim()) {
      newErrors.mobile = "Mobile Number Is Required";
    } else if (!/^[0-9]{10}$/.test(registerData.mobile)) {
      newErrors.mobile = "Please Enter Valid 10 Digit Number";
    }
    if (!registerData.address1.trim()) {
      newErrors.address1 = "Address Line 1 Is Required";
    }
    if (!registerData.address2.trim()) {
      newErrors.address2 = "Address Line 2 Is Required";
    }
    if (!registerData.pincode.trim()) {
      newErrors.pincode = "Pincode Is Required";
    } else if (!/^[0-9]{6}$/.test(registerData.pincode)) {
      newErrors.pincode = "Invalid Pincode";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateLogin = () => {
    let newErrors = {};
    if (!loginData.email.trim()) {
      newErrors.email = "Email Is Required";
    } else if (!/^\S+@\S+\.\S+$/.test(loginData.email)) {
      newErrors.email = "Invalid Email";
    }
    if (!loginData.password.trim()) {
      newErrors.password = "Password Is Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateResetPassword = () => {
    let newErrors = {};
    if (!resetData.password.trim()) {
      newErrors.password = "Password Is Required";
    } else if (resetData.password.length < 6) {
      newErrors.password = "Minimum 6 Characters Required";
    }

    if (!resetData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password Is Required";
    } else if (resetData.password !== resetData.confirmPassword) {
      newErrors.confirmPassword = "Passwords Do Not Match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === "register") {
  if (!validateRegister()) return;

  const result = await dispatch(
    registerUser({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      mobileNumber: registerData.mobile,
      age: "18",
      addressLine1: registerData.address1,
      addressLine2: registerData.address2,
      pincode: registerData.pincode,
    })
  );

  if (registerUser.fulfilled.match(result)) {
  setShowLogin(false);
}

  return;
}
    if (state === "login") {
     if (!validateLogin()) return;
      const result = await dispatch(loginUser(loginData));
      if (result.payload?.success) {
        setShowLogin(false);
      }
      return;
    }

    if (state === "forgot") {
      if (!forgotEmail.trim()) {
        setErrors({
          forgotEmail: "Email Is Required",
        });
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(forgotEmail)) {
        setErrors({
          forgotEmail: "Invalid Email",
        });
        return;
      }
      const result = await dispatch(forgotPassword(forgotEmail));
      if (result.payload?.success) {
        setState("otp");
        setTimer(60);
      }
      return;
    }
    if (state === "otp") {
      if (!otp.trim()) {
        setErrors({
          otp: "OTP Is Required",
        });
        return;
      }
      if (otp.length !== 6) {
        setErrors({
          otp: "OTP Must Be 6 Digits",
        });
        return;
      }
      const result = await dispatch(
        verifyOtp({
          email: forgotEmail,
          otp,
        }),
      );
      if (result.payload?.success) {
        setState("reset");
      }
      return;
    }
    if (state === "reset") {
      if (!validateResetPassword()) return;
      const result = await dispatch(
  resetPassword({
    email: forgotEmail,
    newPassword: resetData.password,
    confirmPassword: resetData.confirmPassword,
  }),
);
      if (result.payload?.success) {
        setState("login");
        setResetData({
          password: "",
          confirmPassword: "",
        });
        setForgotEmail("");
        setOtp("");
      }
    }
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center justify-center text-sm text-gray-600 bg-black/50 px-4"
      onClick={() => setShowLogin(false)}
    >
      <form
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative"
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-black transition-all"
          onClick={closeModal}
          type="button"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {state === "login" && "Login"}
            {state === "register" && "Create Account"}
            {state === "forgot" && "Forgot Password"}
            {state === "otp" && "Verify OTP"}
            {state === "reset" && "Reset Password"}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Register To Rent Your Car
          </p>
        </div>

        {/* ================= REGISTER ================= */}
        {state === "register" && (
          <div className="space-y-4">
            {/* NAME */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    name: e.target.value,
                  })
                }
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="email"
                placeholder="Email Address"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value,
                  })
                }
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* MOBILE */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="tel"
                placeholder="Mobile Number"
                value={registerData.mobile}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
              />

              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* ADDRESS 1 */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="text"
                placeholder="Address Line 1"
                value={registerData.address1}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    address1: e.target.value,
                  })
                }
              />

              {errors.address1 && (
                <p className="text-red-500 text-sm mt-1">{errors.address1}</p>
              )}
            </div>

            {/* ADDRESS 2 */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="text"
                placeholder="Address Line 2"
                value={registerData.address2}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    address2: e.target.value,
                  })
                }
              />

              {errors.address2 && (
                <p className="text-red-500 text-sm mt-1">{errors.address2}</p>
              )}
            </div>

            {/* PINCODE */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="tel"
                placeholder="Pincode"
                value={registerData.pincode}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                  })
                }
              />

              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>
          </div>
        )}

        {/* ================= LOGIN ================= */}
        {state === "login" && (
          <div className="space-y-4">
            {/* EMAIL */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="email"
                placeholder="Email Address"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <span
                className="text-sm text-indigo-600 cursor-pointer"
                onClick={() => {
                  setState("forgot");
                  setErrors({});
                }}
              >
                Forgot Password?
              </span>
            </div>
          </div>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {state === "forgot" && (
          <div className="space-y-4">
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="email"
                placeholder="Enter Registered Email Address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              {errors.forgotEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.forgotEmail}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ================= OTP ================= */}
        {state === "otp" && (
          <div className="space-y-4">
            <div>
              <input
                type="tel"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                  setOtp(value);
                }}
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500 text-center tracking-[10px]"
              />

              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500">
                Resend OTP in{" "}
                <span className="font-semibold text-indigo-500">{timer}s</span>
              </p>

              {timer === 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    const result = await dispatch(resendOtp(forgotEmail));

                    if (result.payload?.success) {
                      setTimer(60);
                    }
                  }}
                  className="text-indigo-500 font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= RESET PASSWORD ================= */}
        {state === "reset" && (
          <div className="space-y-4">
            {/* NEW PASSWORD */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="password"
                placeholder="New Password"
                value={resetData.password}
                onChange={(e) =>
                  setResetData({
                    ...resetData,
                    password: e.target.value,
                  })
                }
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <input
                className="w-full border rounded-lg p-3 outline-none focus:border-indigo-500"
                type="password"
                placeholder="Confirm Password"
                value={resetData.confirmPassword}
                onChange={(e) =>
                  setResetData({
                    ...resetData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}

        {/* BUTTON */}
        <button
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all text-white py-3 rounded-lg mt-6 font-medium cursor-pointer"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Please Wait..."
            : state === "login"
              ? "Login"
              : state === "register"
                ? "Create Account"
                : state === "forgot"
                  ? "Send OTP"
                  : state === "otp"
                    ? "Verify OTP"
                    : "Reset Password"}
        </button>

        {/* LOGIN FOOTER */}
        {state === "login" && (
          <p className="text-sm text-center mt-5 text-gray-600">
            Don't Have An Account?{" "}
            <span
              className="text-indigo-500 cursor-pointer font-medium"
              onClick={() => {
                setState("register");
                setErrors({});
              }}
            >
              Sign Up
            </span>
          </p>
        )}

        {/* REGISTER FOOTER */}
        {state === "register" && (
          <p className="text-sm text-center mt-5 text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("login");
                setErrors({});
              }}
              className="text-indigo-500 cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        )}

        {(state === "forgot" || state === "otp" || state === "reset") && (
          <p
            onClick={() => {
              setState("login");
              setErrors({});
            }}
            className="text-center text-indigo-500 cursor-pointer text-sm mt-5"
          >
            ← Back to Login
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
