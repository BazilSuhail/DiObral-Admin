import { motion } from "framer-motion"

const TableCard = ({ title, icon: Icon, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="p-2 bg-purple-50 rounded-lg mr-3">
            <Icon className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </motion.div>
  )
}

export default TableCard
