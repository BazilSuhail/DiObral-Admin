import { motion } from "framer-motion"

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
      />
    </div>
  )
}

export default LoadingSpinner
