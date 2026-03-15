import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApiQuery, useApiMutation } from "../../api/adapter";
import {
  FiSave, FiUser, FiShoppingBag, FiMail, FiPhone,
  FiFileText, FiGlobe, FiMapPin
} from "react-icons/fi";

export default function StorePage() {
  const [tab, setTab] = useState("store");
  const { data: store, isLoading } = useApiQuery("/retailer/store");
  const { data: profile } = useApiQuery("/auth/profile");

  const { mutate: updateStore, isPending: storePending } = useApiMutation("/retailer/store", "PUT", {
    onSuccess: () => window.location.reload(),
  });
  const { mutate: updateProfile, isPending: profilePending } = useApiMutation("/auth/profile", "PUT", {
    onSuccess: () => window.location.reload(),
  });

  const [storeForm, setStoreForm] = useState({});
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    if (store) {
      setStoreForm({
        storeName: store.storeName || "",
        description: store.description || "",
        contactEmail: store.contactEmail || "",
        contactPhone: store.contactPhone || "",
        returnPolicy: store.returnPolicy || "",
        shippingInfo: store.shippingInfo || "",
      });
    }
  }, [store]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        contact: profile.contact || "",
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-5">
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const tabs = [
    { id: "store", label: "Store", icon: FiShoppingBag },
    { id: "profile", label: "Profile", icon: FiUser },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store and profile</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl w-fit shadow-sm shadow-black/5"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={16} />
            {label}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === "store" ? (
          <motion.form
            key="store"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            onSubmit={(e) => { e.preventDefault(); updateStore(storeForm); }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5 space-y-5"
          >
            <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <FiShoppingBag size={18} className="text-red-600" />
              Store Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField icon={FiGlobe} label="Store Name" value={storeForm.storeName} onChange={(v) => setStoreForm((p) => ({ ...p, storeName: v }))} span />
              <InputField icon={FiFileText} label="Description" value={storeForm.description} onChange={(v) => setStoreForm((p) => ({ ...p, description: v }))} textarea span />
              <InputField icon={FiMail} label="Contact Email" value={storeForm.contactEmail} onChange={(v) => setStoreForm((p) => ({ ...p, contactEmail: v }))} />
              <InputField icon={FiPhone} label="Contact Phone" value={storeForm.contactPhone} onChange={(v) => setStoreForm((p) => ({ ...p, contactPhone: v }))} />
              <InputField icon={FiFileText} label="Return Policy" value={storeForm.returnPolicy} onChange={(v) => setStoreForm((p) => ({ ...p, returnPolicy: v }))} textarea />
              <InputField icon={FiMapPin} label="Shipping Info" value={storeForm.shippingInfo} onChange={(v) => setStoreForm((p) => ({ ...p, shippingInfo: v }))} textarea />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20"
              disabled={storePending}
            >
              <FiSave size={16} />
              {storePending ? "Saving..." : "Update Store"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            key="profile"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            onSubmit={(e) => { e.preventDefault(); updateProfile(profileForm); }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-black/5 space-y-5"
          >
            <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <FiUser size={18} className="text-red-600" />
              Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField icon={FiUser} label="Full Name" value={profileForm.fullName} onChange={(v) => setProfileForm((p) => ({ ...p, fullName: v }))} span />
              <InputField icon={FiFileText} label="Bio" value={profileForm.bio} onChange={(v) => setProfileForm((p) => ({ ...p, bio: v }))} textarea span />
              <InputField icon={FiPhone} label="Contact" value={profileForm.contact} onChange={(v) => setProfileForm((p) => ({ ...p, contact: v }))} />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-2xl font-medium text-sm hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20"
              disabled={profilePending}
            >
              <FiSave size={16} />
              {profilePending ? "Saving..." : "Update Profile"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ icon: Icon, label, value, onChange, textarea, span }) {
  const Component = textarea ? "textarea" : "input";
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <Component
          className={`w-full ${textarea ? "" : "pl-10"} px-4 py-2.5 rounded-2xl text-sm bg-gray-50/50 shadow-sm shadow-black/5 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-gray-400 ${textarea ? "resize-none pl-4" : ""}`}
          value={value}
          onChange={(e) => onChange(textarea ? e.target.value : e.target.value)}
          rows={textarea ? 2 : undefined}
        />
      </div>
    </div>
  );
}
