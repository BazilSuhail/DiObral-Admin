import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "../../store/globalStore";
import { useApiMutation } from "../../api/adapter";
import {
  FiMail, FiLock, FiUser, FiPhone, FiFileText,
  FiCheck, FiArrowRight, FiArrowLeft, FiEye, FiEyeOff,
  FiPackage, FiShoppingCart, FiBarChart2, FiDollarSign, FiTrendingUp, FiMinus,
  FiChevronDown,
} from "react-icons/fi";

function useLoopingTypewriter(phrases, typeSpeed = 50, deleteSpeed = 25, pause = 2500) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState("type");

  useEffect(() => {
    const phrase = phrases[i % phrases.length];
    let t;
    if (phase === "type") {
      if (text.length < phrase.length) {
        t = setTimeout(() => setText(text + phrase[text.length]), typeSpeed);
      } else {
        t = setTimeout(() => setPhase("delete"), pause);
      }
    } else if (text.length > 0) {
      t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
    } else {
      setI((p) => p + 1);
      setPhase("type");
      return;
    }
    return () => clearTimeout(t);
  }, [text, phase, i, phrases, typeSpeed, deleteSpeed, pause]);

  return text;
}

const steps = [
  { field: "email", icon: FiMail, label: "What's your email?", placeholder: "store@example.com", type: "email" },
  { field: "password", icon: FiLock, label: "Create a password", placeholder: "••••••••", type: "password" },
  { field: "fullName", icon: FiUser, label: "What's your store name?", placeholder: "John's Store", type: "text" },
  { field: "contact", icon: FiPhone, label: "Contact number", placeholder: "Phone number", type: "phone", optional: true },
  { field: "bio", icon: FiFileText, label: "Tell us about your store", placeholder: "We sell awesome products...", type: "textarea", optional: true },
];

const perks = [
  { icon: FiPackage, text: "Unlimited products", desc: "Add as many as you need" },
  { icon: FiShoppingCart, text: "Order management", desc: "Track every sale" },
  { icon: FiBarChart2, text: "Sales analytics", desc: "Data-driven insights" },
  { icon: FiDollarSign, text: "Revenue tracking", desc: "Know your earnings" },
];

const countries = [
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States", length: 10, format: [3, 3, 4] },
  { code: "IN", dial: "+91", flag: "🇮🇳", name: "India", length: 10, format: [5, 5] },
  { code: "PK", dial: "+92", flag: "🇵🇰", name: "Pakistan", length: 10, format: [3, 3, 4] },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom", length: 10, format: [4, 3, 3] },
  { code: "CA", dial: "+1", flag: "🇨🇦", name: "Canada", length: 10, format: [3, 3, 4] },
  { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia", length: 9, format: [4, 3, 3] },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany", length: 10, format: [2, 3, 5] },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France", length: 9, format: [1, 2, 2, 2, 2] },
  { code: "BR", dial: "+55", flag: "🇧🇷", name: "Brazil", length: 11, format: [2, 4, 5] },
  { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE", length: 9, format: [2, 3, 4] },
  { code: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia", length: 9, format: [2, 3, 4] },
  { code: "BD", dial: "+880", flag: "🇧🇩", name: "Bangladesh", length: 10, format: [3, 3, 4] },
  { code: "CN", dial: "+86", flag: "🇨🇳", name: "China", length: 11, format: [3, 4, 4] },
  { code: "JP", dial: "+81", flag: "🇯🇵", name: "Japan", length: 10, format: [3, 4, 4] },
  { code: "KR", dial: "+82", flag: "🇰🇷", name: "South Korea", length: 10, format: [3, 4, 4] },
  { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore", length: 8, format: [4, 4] },
  { code: "MY", dial: "+60", flag: "🇲🇾", name: "Malaysia", length: 10, format: [3, 3, 4] },
  { code: "LK", dial: "+94", flag: "🇱🇰", name: "Sri Lanka", length: 10, format: [3, 3, 4] },
  { code: "NG", dial: "+234", flag: "🇳🇬", name: "Nigeria", length: 10, format: [3, 3, 4] },
  { code: "KE", dial: "+254", flag: "🇰🇪", name: "Kenya", length: 10, format: [3, 3, 4] },
  { code: "EG", dial: "+20", flag: "🇪🇬", name: "Egypt", length: 10, format: [3, 3, 4] },
  { code: "ZA", dial: "+27", flag: "🇿🇦", name: "South Africa", length: 10, format: [3, 3, 4] },
  { code: "RU", dial: "+7", flag: "🇷🇺", name: "Russia", length: 10, format: [3, 3, 4] },
  { code: "TR", dial: "+90", flag: "🇹🇷", name: "Turkey", length: 10, format: [3, 3, 4] },
  { code: "ID", dial: "+62", flag: "🇮🇩", name: "Indonesia", length: 10, format: [3, 4, 4] },
  { code: "PH", dial: "+63", flag: "🇵🇭", name: "Philippines", length: 10, format: [3, 3, 4] },
  { code: "VN", dial: "+84", flag: "🇻🇳", name: "Vietnam", length: 10, format: [3, 4, 4] },
  { code: "TH", dial: "+66", flag: "🇹🇭", name: "Thailand", length: 10, format: [3, 3, 4] },
  { code: "NP", dial: "+977", flag: "🇳🇵", name: "Nepal", length: 10, format: [3, 3, 4] },
];

function formatPhone(digits, fmt) {
  const parts = [];
  let idx = 0;
  for (const len of fmt) {
    if (idx >= digits.length) break;
    parts.push(digits.slice(idx, idx + len));
    idx += len;
  }
  return parts.join(" ");
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemAnim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useGlobalStore((s) => s.login);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", bio: "", contact: "" });
  const [showPw, setShowPw] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const { mutate, isPending, error } = useApiMutation("/auth/register", "POST", {
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate("/");
    },
  });

  const current = steps[step];
  const value = form[current.field];
  const isLast = step === steps.length - 1;

  const isContactStep = current.field === "contact";
  const phoneFormatted = phoneDigits ? formatPhone(phoneDigits, selectedCountry.format) : "";
  const phoneError = phoneDigits.length > 0 && phoneDigits.length < selectedCountry.length;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length <= selectedCountry.length) {
      setPhoneDigits(raw);
    }
  };

  const handleCountrySelect = (c) => {
    setSelectedCountry(c);
    setPhoneDigits("");
    setShowDropdown(false);
  };

  const canProceed = current.optional || (typeof value === "string" && value.trim().length > 0);

  const handleNext = () => {
    if (!canProceed) return;
    if (isLast) {
      const contactValue = phoneDigits
        ? `${selectedCountry.dial} ${phoneFormatted}`
        : "";
      mutate({ ...form, contact: contactValue, role: "retailer" });
      return;
    }
    if (isContactStep) {
      setForm((prev) => ({
        ...prev,
        contact: phoneDigits ? `${selectedCountry.dial} ${phoneFormatted}` : "",
      }));
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  useEffect(() => {
    if (isContactStep && form.contact) {
      const country = countries.find((c) => form.contact.startsWith(c.dial));
      if (country) {
        setSelectedCountry(country);
        const raw = form.contact.replace(/[^0-9]/g, "").slice(country.dial.replace(/[^0-9]/g, "").length);
        setPhoneDigits(raw);
      }
    }
  }, [step]);

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && current.type !== "textarea") {
      e.preventDefault();
      handleNext();
    }
  };

  const continuousText = useLoopingTypewriter([
    "Join thousands of modern digital retailers handling businesses scaling globally.",
    "No complex setup rules — just spin up your secure account and manage features directly.",
    "Deploy items smoothly with lightning fast revenue performance metrics.",
  ], 30, 15, 2500);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-4/5 bg-gradient-to-b from-transparent via-red-200 to-transparent origin-center z-10"
      >
        <motion.div
          animate={{ y: [-12, 12, -12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-red-200 shadow-sm flex items-center justify-center"
        >
          <FiMinus size={12} className="text-red-500" />
        </motion.div>
      </motion.div>

      <div className="hidden lg:flex px-16 xl:px-24 py-16 flex-col justify-between bg-gray-50/40 relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <img src="/diobral.webp" alt="DiObral" className="w-9 h-9 object-contain" />
          <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            DiObral
          </span>
        </motion.div>

        <div className="my-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
              Start selling
              <br />
              in minutes.
            </h1>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed min-h-[48px] max-w-md">
              {continuousText}
              <span className="inline-block w-[2px] h-3.5 bg-red-500 ml-1 animate-pulse" />
            </p>
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="show" className="mt-10 space-y-3">
            {perks.map(({ icon: Icon, text, desc }) => (
              <motion.div
                key={text}
                variants={itemAnim}
                whileHover={{ y: -3, x: 4, transition: { duration: 0.2 } }}
                className="flex items-start gap-4 bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                  <Icon size={18} className="text-red-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-5 text-xs text-gray-400"
        >
          <span>&copy; 2026 DiObral</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1">
            <FiTrendingUp size={12} /> Free to start
          </span>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-8 relative bg-white">

        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-80 h-80 bg-red-100/40 rounded-full blur-3xl"
          />
        </div>

        <div className="w-full max-w-lg px-4 z-10">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <img src="/diobral.webp" alt="DiObral" className="w-8 h-8" />
            <span className="font-bold text-gray-800 text-lg">DiObral</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create your store</h2>
            <p className="text-gray-400 text-sm mt-1.5">Set up your digital storefront parameters</p>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.field} className="flex items-center gap-2 flex-1">
                <motion.div
                  animate={{
                    backgroundColor: i <= step ? "#FEF2F2" : "#F9FAFB",
                    borderColor: i <= step ? "#FCA5A5" : "#F3F4F6",
                  }}
                  className="w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all shadow-sm"
                >
                  {i < step ? (
                    <FiCheck size={18} className="text-red-600 font-bold" />
                  ) : (
                    <s.icon size={18} className={i === step ? "text-red-600" : "text-gray-400"} />
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ backgroundColor: i < step ? "#FCA5A5" : "#E5E7EB" }}
                    className="h-0.5 flex-1 rounded transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">
              Step {step + 1} of {steps.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error.response?.data?.message || "Registration failed"}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="min-h-[160px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">{current.label}</h2>
                <p className="text-sm text-gray-400 mb-5">
                  {current.optional ? "Optional — you can skip this field safely" : "This field is required"}
                </p>

                {isContactStep ? (
                  <div>
                    <div className="flex items-stretch gap-0">
                      <div className="relative" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowDropdown((p) => !p)}
                          className="flex items-center gap-1.5 px-3 py-3 rounded-l-xl bg-gray-50/50 border border-r-0 border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-all min-w-[90px] justify-between shadow-sm"
                        >
                          <span className="text-base leading-none">{selectedCountry.flag}</span>
                          <span className="font-medium text-xs">{selectedCountry.dial}</span>
                          <FiChevronDown
                            size={12}
                            className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                          />
                        </button>

                        {showDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-[220px] max-h-[260px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                            {countries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => handleCountrySelect(c)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-red-50 transition-all text-left ${
                                  selectedCountry.code === c.code
                                    ? "bg-red-50 text-red-700 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                <span className="text-base leading-none">{c.flag}</span>
                                <span className="flex-1 truncate">{c.name}</span>
                                <span className="text-xs text-gray-400">{c.dial}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative flex-1">
                        <input
                          name="contact"
                          type="tel"
                          placeholder="Phone number"
                          value={phoneFormatted}
                          onChange={handlePhoneChange}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="w-full px-3 py-3 rounded-r-xl bg-gray-50/50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    {phoneError && (
                      <p className="text-xs text-red-500 mt-1.5 ml-1">
                        {selectedCountry.length - phoneDigits.length} more digit
                        {selectedCountry.length - phoneDigits.length > 1 ? "s" : ""} required
                      </p>
                    )}
                    {!phoneError && phoneDigits.length === selectedCountry.length && (
                      <p className="text-xs text-green-600 mt-1.5 ml-1">
                        Valid {selectedCountry.name} number
                      </p>
                    )}
                  </div>
                ) : current.type === "textarea" ? (
                  <div className="relative group">
                    <textarea
                      name={current.field}
                      placeholder={current.placeholder}
                      value={value}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all shadow-sm resize-none h-28"
                      rows={4}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="relative group">
                    <current.icon
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"
                    />
                    <input
                      name={current.field}
                      type={current.type === "password" && !showPw ? "password" : "text"}
                      placeholder={current.placeholder}
                      value={value}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-50/50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white transition-all shadow-sm"
                    />
                    {current.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 mt-3">
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <FiArrowLeft size={15} />
                <span>Back</span>
              </motion.button>
            )}

            <motion.button
              whileHover={canProceed ? { scale: 1.01 } : {}}
              whileTap={canProceed ? { scale: 0.99 } : {}}
              onClick={handleNext}
              disabled={!canProceed && !current.optional}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-600/15 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : isLast ? (
                "Create Store"
              ) : (
                <>
                  <span className="pl-1">Next step</span>
                  <FiArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-gray-400 mt-8"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
              Sign in
            </Link>
          </motion.p>
        </div>
      </div>

    </div>
  );
}
