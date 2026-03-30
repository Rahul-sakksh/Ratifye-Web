// src/components/SeoEnhancedCaptchaForm.tsx
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";

const SeoEnhancedCaptchaForm: React.FC = () => {
  const [verified, setVerified] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleCaptchaChange = (value: string | null) => {
    if (value) setVerified(true);
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) {
      alert("Please verify that you are human!");
      return;
    }
    // Here you can handle your form submission (API call)
    alert(`Form submitted successfully!\nName: ${form.name}\nEmail: ${form.email}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-500 to-blue-400 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Contact Us</h1>
        <p className="text-gray-600 text-center mt-2">
          Fill in your details below. CAPTCHA ensures security and prevents spam.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Invisible reCAPTCHA */}
          <ReCAPTCHA
            sitekey="YOUR_RECAPTCHA_SITE_KEY" // Replace with your actual site key
            size="invisible"
            onChange={handleCaptchaChange}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SeoEnhancedCaptchaForm;
