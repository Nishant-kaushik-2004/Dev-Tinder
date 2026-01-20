import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import api from "../../utils/api";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/authSlice";

const LoginPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // const [theme, setTheme] = useState("dark");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  /**
   * Email validation using RFC 5322 compliant regex
   * Security: Prevents basic XSS and injection attempts
   */
  const validateEmail = (email: string) => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  /**
   * Password validation
   * Security: Enforces minimum security requirements
   */
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  /**
   * Input sanitization
   * Security: Prevents XSS attacks
   */
  const sanitizeInput = (input: string) => {
    return input.trim().replace(/[<>]/g, "");
  };

  /**
   * Handle input changes with real-time validation
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue = type === "checkbox" ? checked : sanitizeInput(value);

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
    const newErrors: { [key: string]: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { user, authChecked } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authChecked && user) {
      navigate("/", { replace: true });
    }
  }, [authChecked, user, navigate]);

  const handleSubmit = async () => {
    if (!validateForm() || isLoading) return;

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      // If using remember me:
      // if (formData.rememberMe) {
      //   localStorage.setItem('rememberMe', 'true');
      // }

      setToast({
        message: res.data.message || "Login successful! Redirecting...",
        type: "success",
      });

      dispatch(setUser(res.data.user));

      // const from = (location.state as any)?.from?.pathname || "/";
      // navigate("/", { replace: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      setToast({
        message: errorMessage,
        type: "error",
      });

      // Security: Implement rate limiting after multiple failures
      // incrementFailedAttempts();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle theme between light and dark
   */
  // const toggleTheme = () => {
  //   const newTheme = theme === "light" ? "dark" : "light";
  //   setTheme(newTheme);

  //   // In real implementation:
  //   // localStorage.setItem('theme', newTheme);
  //   // document.documentElement.setAttribute('data-theme', newTheme);
  // };

  return (
    <div
      className="min-h-screen bg-base-300 flex items-center justify-center p-4"
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") handleSubmit();
      }}
    >
      {/* Theme Toggle
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div> */}

      {/* Login Card */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-base-content">
              Welcome Back
            </h1>
            <p className="text-base-content/70 mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
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
                placeholder="Enter your email"
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <label className="label" id="email-error">
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
                  placeholder="Enter your password"
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  disabled={isLoading}
                  autoComplete="current-password"
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
                <label className="label" id="password-error">
                  <span className="label-text-alt text-error" role="alert">
                    {errors.password}
                  </span>
                </label>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <label className="label cursor-pointer flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary checkbox-sm"
                  disabled={isLoading}
                />
                <span className="label-text">Remember me</span>
              </label>

              <a
                href="#forgot-password"
                className="link link-primary link-hover text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Forgot password clicked");
                  // In real app: navigate to forgot password page
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={"btn w-full btn-primary"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-base-content/70">
              Don't have an account?{" "}
              <Link to={"/signup"} className="link link-primary link-hover">
                Sign up
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

// Toast notification component (replace with your preferred toast library)
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
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
          ×
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
