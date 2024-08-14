import React, { useContext, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import axios from "axios";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";
import { Eye, EyeOff } from "lucide-react";
import LoadingScreen from "../Load";
import googleIcon from "/google.png?url";

const errMess = {
  message: "This field is required",
};

const validationSchema = yup.object().shape({
  email: yup.string().required(errMess.message).email("Email is Invalid"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(errMess.message),
});

const Login = () => {
  const {
    user,
    setUser,
    loading: loadingPro,
    getProfile,
  } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!loadingPro && user?.email) {
      navigate("/all/posts");
    }
  }, [loadingPro, user, navigate]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
        { withCredentials: true },
      );

      if (response.status === 200) {
        setUser(response.data.user);
        getProfile();
        toast.success("Logged in successfully");
        navigate("/all/posts");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An error occurred. Please try again.";
    toast.error(errorMessage);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-4">
                <input
                  {...field}
                  type="email"
                  placeholder="Email"
                  className={`w-full p-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:border-blue-500`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="mb-6 relative">
                <input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full p-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:border-blue-500`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
        <div className="mt-4">
          <button
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_API_URL
              }/api/auth/google`;
            }}
            className="w-full flex justify-center items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded transition-colors"
          >
            <img src={googleIcon} alt="Google" className="w-6 h-6 mr-2" />
            Login with Google
          </button>
        </div>
      </div>
      <LoadingScreen isLoading={loading} />
    </div>
  );
};

export default Login;
