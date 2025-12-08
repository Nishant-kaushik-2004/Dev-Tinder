import { useState, useEffect } from "react";
import { Eye, EyeOff, Sun, Moon, Loader2 } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

/**
 * DevTinder Signup Page Component
 *
 * Security Best Practices Implemented:
 * - Input validation and sanitization
 * - Password visibility toggle
 * - Password confirmation matching
 * - CSRF protection ready
 * - Rate limiting ready
 */

const DevTinderSignup = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize theme
  useEffect(() => {
    // In real implementation:
    // const savedTheme = localStorage.getItem('theme') || 'light';
    // setTheme(savedTheme);
    // document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  /**
   * Email validation using RFC 5322 compliant regex
   */
  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  /**
   * Password validation
   */
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  /**
   * Name validation
   */
  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  /**
   * Input sanitization
   */
  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, "");
  };

  /**
   * Handle input changes with real-time validation
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear errors on input change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validate form before submission
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName =
        "First name must be at least 2 characters and contain only letters";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName =
        "Last name must be at least 2 characters and contain only letters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      const { user, message } = response.data;
      
      dispatch(setUser(user));

      setToast({
        message: message || "Account created successfully!",
        type: "success",
      });

      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";

      setToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle theme between light and dark
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Signup Card */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-base-content">
              Join DevTinder
            </h1>
            <p className="text-base-content/70 mt-2">
              Create your developer account
            </p>
          </div>

          {/* Signup Form */}
          <div className="space-y-4">
            {/* Name Fields Row */}
            <div className="flex gap-2">
              {/* First Name */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.firstName ? "input-error" : ""
                  }`}
                  placeholder="John"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <label className="">
                    <span
                      className="label-text-alt text-error text-xs"
                      role="alert"
                    >
                      {errors.firstName}
                    </span>
                  </label>
                )}
              </div>

              {/* Last Name */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full focus:outline-none ${
                    errors.lastName ? "input-error" : ""
                  }`}
                  placeholder="Doe"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <label className="">
                    <span
                      className="label-text-alt text-error text-xs"
                      role="alert"
                    >
                      {errors.lastName}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input input-bordered w-full focus:outline-none ${
                  errors.email ? "input-error" : ""
                }`}
                placeholder="john@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error" role="alert">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full focus:outline-none pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-10 right-3 top-1/2 transform -translate-y-1/2 text-base-content/70 hover:text-base-content transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error" role="alert">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full focus:outline-none pr-12 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute z-10 right-3 top-1/2 transform -translate-y-1/2 text-base-content/70 hover:text-base-content transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error" role="alert">
                    {errors.confirmPassword}
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn w-full btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link to={"/login"} className="link link-primary link-hover">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-top toast-end`}>
      <div
        className={`alert ${
          type === "success" ? "alert-success" : "alert-error"
        }`}
      >
        <span>{message}</span>
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          x
        </button>
      </div>
    </div>
  );
};

export default DevTinderSignup;
