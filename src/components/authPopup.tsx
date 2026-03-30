import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCompanyRegistration } from "../services/companyApi";
import { useSendOTP, useVerifyOTP } from "../services/otpApi";
import { motion } from "framer-motion";
import {setLoginSuccessToast} from '../store/slices/toastSlice';
import { useAppDispatch } from "../store/hooks";
interface AuthPopupProps {
    show: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
    AuthMode?: "register" | "login";
}

const AuthPopup: React.FC<AuthPopupProps> = ({ show, onClose, onLoginSuccess, AuthMode = "register" }) => {
    const [authMode, setAuthMode] = useState<"register" | "login">(AuthMode);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otpValue, setOTPValue] = useState("");
    const [validationErrors, setValidationErrors] = useState<{ companyEmail?: string; companyContact?: string }>({});

    const dispatch = useAppDispatch();

    const [registerForm, setRegisterForm] = useState({
        companyName: "",
        companyEmail: "",
        companyLocation: "",
        companyContact: "",
        companyAddress: "",
        platform: 0,
    });

    const [loginForm, setLoginForm] = useState({ emailOrPhone: "" });

    const fadeInUp = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.5 },
    };


    const companyRegistration = useCompanyRegistration({
        onSuccess: (response) => {
            console.log("Registration successful:", response.data);
            setAuthMode("login");
          
            setRegisterForm({
                companyName: "",
                companyEmail: "",
                companyLocation: "",
                companyContact: "",
                companyAddress: "",
                platform: 0,
            });
            setValidationErrors({});
        },
        onError: (error) => console.error("Registration failed:", error),
    });

    const sendOTP = useSendOTP({
        onSuccess: (response) => {
            if (response?.data?.success) {
                console.log("OTP sent successfully:", response.data);

                setShowOTPInput(true);
            } else if ('Company not found' === response?.data?.message) {
                throw new Error("Company not found, please register first.");
            }
        },
        onError: (error) => console.error("OTP send failed:", error),
    });

    const verifyOTP = useVerifyOTP({
        onSuccess: (response) => {
            if (response?.data?.success) {

                console.log("OTP verified successfully:", response.data);


                const { company, accessToken } = response.data;
                localStorage.setItem("authToken", accessToken);
                localStorage.setItem(
                    "userSession",
                    JSON.stringify({
                        id: company?.id,
                        companyName: company?.companyName,
                        companyEmail: company?.companyEmail,
                        companyContact: company?.companyContact,
                        loginTime: new Date().toISOString(),
                    })
                );
                setShowOTPInput(false);
                setOTPValue("");
                onClose();
                window.location.reload();


            } else if ("Invalid OTP" === response?.data?.message) {
                throw new Error(response?.data?.message);
            }

        },
        onError: (error) => console.error("OTP verification failed:", error),
    });

    const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isBusinessEmail = (email: string): boolean => {
        const freeEmailDomains = [
            "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
            "icloud.com", "protonmail.com", "zoho.com", "yandex.com", "mail.com", "gmx.com",
        ];
        const domain = email.split("@")[1]?.toLowerCase();
        return !freeEmailDomains.includes(domain || "");
    };

    const isValidPhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[^\d+]/g, "");
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
    };

    const validateRegistrationForm = (): boolean => {
        const errors: { companyEmail?: string; companyContact?: string } = {};

        if (!isValidEmail(registerForm.companyEmail)) {
            errors.companyEmail = "Please enter a valid email address";
        } else if (!isBusinessEmail(registerForm.companyEmail)) {
            errors.companyEmail = "Please use a business email (no Gmail, Yahoo, etc.)";
        }

        if (!isValidPhoneNumber(registerForm.companyContact)) {
            errors.companyContact = "Please enter a valid phone number (10-15 digits)";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        if (!show) {
            setValidationErrors({});
            setOTPValue("");
            setShowOTPInput(false);
        }
    }, [show]);


    const handleRegisterChange = (field: string, value: string) => {
        setRegisterForm((prev) => ({ ...prev, [field]: value }));
        if (validationErrors[field as keyof typeof validationErrors]) {
            setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleLoginChange = (field: string, value: string) =>
        setLoginForm((prev) => ({ ...prev, [field]: value }));

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !registerForm.companyName ||
            !registerForm.companyEmail ||
            !registerForm.companyContact ||
            !registerForm.companyLocation
        ) {
            alert("Please fill in all required fields");
            return;
        }

        if (!validateRegistrationForm()) return;

        companyRegistration.mutate(registerForm);
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!showOTPInput) {
            if (!loginForm.emailOrPhone.trim()) {
                alert("Please enter your email");
                return;
            }
            sendOTP.mutate({
                email: loginForm.emailOrPhone,
                purpose: "login",
            });
        } else {
            if (!otpValue.trim()) {
                alert("Please enter the OTP");
                return;
            }
            verifyOTP.mutate({
                otp: otpValue,
            });
        }
    };

    if (!show) return null;


    return (
        <motion.div {...fadeInUp} className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">

            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#1F4B73]">
                        {authMode === "register"
                            ? "Register"
                            : "Login to Continue"}
                    </h3>
                    <button
                        onClick={() => {
                            onClose();
                            setRegistrationSuccess(false);
                            setShowOTPInput(false);
                            setOTPValue("");
                        }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Mode Toggle */}
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => {
                            setAuthMode("register");
                            setRegistrationSuccess(false);
                            setShowOTPInput(false);
                            setOTPValue("");
                        }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${authMode === "register"
                            ? "bg-[#1F4B73] text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Register
                    </button>
                    <button
                        onClick={() => {
                            setAuthMode("login");
                            setRegistrationSuccess(false);
                            setShowOTPInput(false);
                            setOTPValue("");
                        }}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${authMode === "login"
                            ? "bg-[#1F4B73] text-white"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Login
                    </button>
                </div>

                {/* Registration Form */}
                {authMode === "register" && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        
                        {companyRegistration.isError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                <p className="text-sm">
                                    Registration failed:{" "}
                                    {companyRegistration.error?.message ||
                                        "Please try again"}
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={registerForm.companyName}
                                onChange={(e) =>
                                    handleRegisterChange("companyName", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter company name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={registerForm.companyEmail}
                                onChange={(e) =>
                                    handleRegisterChange("companyEmail", e.target.value)
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${validationErrors.companyEmail
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                placeholder="Enter company email"
                            />
                            {validationErrors.companyEmail && (
                                <p className="text-red-500 text-xs mt-1">
                                    {validationErrors.companyEmail}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Contact <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                value={registerForm.companyContact}
                                onChange={(e) =>
                                    handleRegisterChange("companyContact", e.target.value)
                                }
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${validationErrors.companyContact
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                                placeholder="Enter company contact number"
                            />
                            {validationErrors.companyContact && (
                                <p className="text-red-500 text-xs mt-1">
                                    {validationErrors.companyContact}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={registerForm.companyLocation}
                                onChange={(e) =>
                                    handleRegisterChange(
                                        "companyLocation",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter company location"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Address
                            </label>
                            <textarea
                                value={registerForm.companyAddress}
                                onChange={(e) =>
                                    handleRegisterChange("companyAddress", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                placeholder="Enter company address"
                                rows={4}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={companyRegistration.isPending}
                            className={`w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors ${companyRegistration.isPending
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#1F4B73] hover:bg-gray-800"
                                }`}
                        >
                            {companyRegistration.isPending ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>
                )}

                {/* Login Form */}
                {authMode === "login" && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        {/* Success message from registration */}
                        {registrationSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                                <p className="text-sm">
                                    Registration successful! Please login to continue.
                                </p>
                            </div>
                        )}

                        {/* Error message for OTP send */}
                        {sendOTP.isError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                <p className="text-sm">
                                    Failed to send OTP:{" "}
                                    {sendOTP.error?.message || "Please try again"}
                                </p>
                            </div>
                        )}

                        {/* Error message for OTP verification */}
                        {verifyOTP.isError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                <p className="text-sm">
                                    OTP verification failed:{" "}
                                    {verifyOTP.error?.message || "Please try again"}
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email or Phone Number{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={showOTPInput}
                                value={loginForm.emailOrPhone}
                                onChange={(e) =>
                                    handleLoginChange("emailOrPhone", e.target.value)
                                }
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${showOTPInput ? "bg-gray-100 cursor-not-allowed" : ""
                                    }`}
                                placeholder="Enter email or phone number"
                            />
                        </div>

                        {/* OTP Input - shown after OTP is sent */}
                        {showOTPInput && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter OTP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={otpValue}
                                    onChange={(e) => setOTPValue(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    OTP sent to {loginForm.emailOrPhone}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {showOTPInput && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowOTPInput(false);
                                        setOTPValue("");
                                    }}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={sendOTP.isPending || verifyOTP.isPending}
                                className={`${showOTPInput ? "flex-1" : "w-full"
                                    } py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors ${sendOTP.isPending || verifyOTP.isPending
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#1F4B73] hover:bg-gray-800"
                                    }`}
                            >
                                {sendOTP.isPending ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : verifyOTP.isPending ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : showOTPInput ? (
                                    "Verify OTP"
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </motion.div>
    );
};

export default AuthPopup;
