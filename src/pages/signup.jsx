import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react"; 
import { registerUser } from "../slicers/slice";
import { Link } from "react-router";

const signupSchema = z.object({
  name: z.string().min(3, "Name should be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
});

function SignUp() {
  const dispatch = useDispatch();
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-700 to-purple-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-[400px] backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          LeetCode
        </h1>

        <form
          onSubmit={handleSubmit((data) => dispatch(registerUser(data)))}
          className="flex flex-col space-y-4"
        >
          {/* First Name */}
          <div>
            <input
              {...register("name")}
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
              {...register("email")}
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
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"} // 👈 toggle type
              placeholder="Password"
              onChange={(e) => checkStrength(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {/* Eye Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

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
            disabled={loading}
            className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl py-2 shadow-lg transition"
          >
            Sign Up
          </button>
        </form>
        <div className="flex text-sm text-gray-300 mt-4 gap-2">
          <span>already have an account?</span>
          <Link to="/login" className="hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;
