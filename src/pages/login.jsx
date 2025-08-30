import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {loginUser} from "../slicers/slice"
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const {isAuthenticated, loading, error} = useSelector((state) => state.auth);
  useEffect(() => {
    if(isAuthenticated){
      navigate("/");
    }
  }, [isAuthenticated])

  const onSubmit = (data) => {
    loginUser(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[360px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl py-2 shadow-lg transition"
          >
            Sign In
          </button>
        </form>
        <div className="flex justify-between text-sm text-gray-300 mt-4">
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
          <a href="/signup" className="hover:underline">
            Create Account
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
