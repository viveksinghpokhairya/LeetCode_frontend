import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import {registerUser} from "../slicers/slice"

const signupSchema = z.object({
  firstName: z.string().min(3, "Name should be at least 3 characters long"),
  emailId: z.string().email("Invalid email"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
});

function SignUp() {
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  const {isAuthenticated, loading, error} = useSelector((state) => state.auth);

  useEffect(() => {
    if(isAuthenticated){
      navigate("/")
    }
  }, [isAuthenticated])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const checkStrength = (password) => {
    if (!password) return setPasswordStrength("");
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
    );
    const mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$");

    if (strongRegex.test(password)) setPasswordStrength("strong");
    else if (mediumRegex.test(password)) setPasswordStrength("medium");
    else setPasswordStrength("weak");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[380px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          LeetCode
        </h1>

        <form
          onSubmit={handleSubmit((data) => registerUser(data))}
          className="flex flex-col space-y-4"
        >
          {/* First Name */}
          <div>
            <input
              {...register("firstName")}
              placeholder="First Name"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("emailId")}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.emailId && (
              <p className="text-red-400 text-sm mt-1">
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              onChange={(e) => checkStrength(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            {passwordStrength && (
              <p
                className={`mt-1 text-sm font-semibold ${
                  passwordStrength === "strong"
                    ? "text-green-400"
                    : passwordStrength === "medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                Password strength: {passwordStrength}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl py-2 shadow-lg transition"
          >
            Sign Up
          </button>
        </form>
        <div className="flex justify-between text-sm text-gray-300 mt-4">
          <a href="/login" className="hover:underline">
            Sign In
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;
