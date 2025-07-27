import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, X, Mail, AlertCircle } from "lucide-react";
import { sendOTP, verifyOTP } from "@/services/authSerives";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Handle email input change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError("");

    // Validate email
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    setLoading(true);
    const data = { email: email.trim().toLowerCase() };

    try {
      const response = await sendOTP(data);

      if (response.status) {
        setOtpSent(true);
        setShowOTPModal(true);
        setResendCooldown(60); // 60 second cooldown
        toast({
          title: "OTP Sent Successfully",
          description: `Verification code sent to ${email}`,
          variant: "success",
          duration: 3000,
        });
      } else {
        // Handle backend error response
        const errorMessage =
          response.message || "Failed to send OTP. Please try again.";
        setEmailError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network error. Please check your connection and try again.";
      setEmailError(errorMessage);
      toast({
        title: "Network Error",
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);

      // Clear OTP error when user starts typing
      if (otpError) {
        setOtpError("");
      }

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setOtpError("");

    const otpCode = otp.join("");

    // Validate OTP
    if (otpCode.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError("OTP must contain only numbers");
      return;
    }

    setVerifyingOTP(true);

    try {
      const data = {
        email: email.trim().toLowerCase(),
        otp: otpCode,
      };

      const response = await verifyOTP(data);

      if (response.status) {
        toast({
          title: "Login Successful",
          description: "Welcome to WocHerbal!",
          variant: "success",
          duration: 3000,
        });

        // Store auth token if provided
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }

        navigate("/");
        setShowOTPModal(false);
      } else {
        // Handle backend validation errors
        const errorMessage =
          response.message || "Invalid OTP. Please try again.";
        setOtpError(errorMessage);

        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 4000,
        });

        // Clear OTP inputs and focus first input
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network error. Please try again.";

      setOtpError(errorMessage);

      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setOtpError("");

    try {
      const data = { email: email.trim().toLowerCase() };
      const response = await sendOTP(data);

      if (response.status) {
        setResendCooldown(60);
        toast({
          title: "OTP Resent",
          description: "New verification code sent to your email",
          variant: "success",
          duration: 3000,
        });

        // Clear current OTP
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        const errorMessage = response.message || "Failed to resend OTP";
        setOtpError(errorMessage);
        toast({
          title: "Resend Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Network error. Please try again.";
      setOtpError(errorMessage);
      toast({
        title: "Network Error",
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowOTPModal(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpSent(false);
    setOtpError("");
    setResendCooldown(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Wocherbal
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-50 transition-all duration-200 ${
                    emailError
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-indigo-500"
                  }`}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
                {emailError && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {emailError && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email || !!emailError}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending OTP...</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Secure login with OTP verification
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Protected by advanced security measures
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Verify Your Email
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the 6-digit code
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm">
                  We've sent a verification code to
                </p>
                <p className="font-semibold text-gray-900 mt-1">{email}</p>
              </div>

              <form onSubmit={handleOTPSubmit} className="space-y-6">
                {/* OTP Input */}
                <div className="space-y-3">
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-12 text-center text-xl font-bold bg-white/70 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          otpError
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                        disabled={verifyingOTP}
                      />
                    ))}
                  </div>
                  {otpError && (
                    <p className="text-red-500 text-sm flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {otpError}
                    </p>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={verifyingOTP || otp.some((digit) => !digit)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  {verifyingOTP ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </form>

              {/* Resend Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOTP}
                  disabled={loading || resendCooldown > 0}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {resendCooldown > 0
                    ? `Resend Code (${resendCooldown}s)`
                    : "Resend Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
