"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MdDashboard,
  MdCategory,
  MdTrendingUp,
  MdInventory,
  MdShoppingCart,
  MdSearch,
  MdKeyboardArrowDown,
  MdAdd,
  MdList,
  MdSettings,
  MdLocalShipping,
} from "react-icons/md"

export default function Navbar() {
  const [ecommerceOpen, setEcommerceOpen] = useState(true)
  const [ordersOpen, setOrdersOpen] = useState(true)
  const [activeItem, setActiveItem] = useState("/")

  // Use refs to track previous state to prevent unnecessary animations
  const prevEcommerceOpen = useRef(ecommerceOpen)
  const prevOrdersOpen = useRef(ordersOpen)

  // Update refs when state changes
  useEffect(() => {
    prevEcommerceOpen.current = ecommerceOpen
    prevOrdersOpen.current = ordersOpen
  }, [ecommerceOpen, ordersOpen])

  const mainNavItems = [
    { name: "Dashboard", href: "/", icon: MdDashboard },
    { name: "Categories", href: "/categoryList", icon: MdCategory },
    { name: "Sub-Categories", href: "/subCategoryList", icon: MdTrendingUp },
  ]

  const ecommerceItems = [
    { name: "Add Products", href: "/addProduct", icon: MdAdd },
    { name: "Product List", href: "/productList", icon: MdList },
  ]

  const orderItems = [
    { name: "Manage Orders", href: "/admin-orders-list", icon: MdSettings },
    { name: "Track Orders", href: "/order-tracking", icon: MdLocalShipping },
  ]

  const handleNavClick = (href) => {
    setActiveItem(href)
  }

  const NavButton = ({ item, isSubItem = false }) => {
    const isActive = activeItem === item.href
    const Icon = item.icon

    return (
      <motion.button
        onClick={() => handleNavClick(item.href)}
        className={`
          w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200
          ${isSubItem ? "text-xs" : "text-sm"}
          ${
            isActive
              ? "bg-red-50 text-red-700 border-l-4 border-red-600 shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
          }
        `}
        whileHover={{ x: isActive ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className={`${isSubItem ? "w-3 h-3" : "w-4 h-4"} flex-shrink-0`} />
        <span className="font-medium">{item.name}</span>
      </motion.button>
    )
  }

  const CollapsibleSection = ({ title, icon: Icon, items, isOpen, prevIsOpen, onToggle }) => {
    // Create a stable key that only changes when isOpen changes
    // This prevents AnimatePresence from re-rendering when other state changes
    const animationKey = `${title}-${isOpen}`

    return (
      <div className="space-y-1">
        <motion.button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-all duration-200"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <MdKeyboardArrowDown className="w-3 h-3" />
          </motion.div>
        </motion.button>

        {/* We use a stable key to prevent unnecessary animations */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key={animationKey}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-1 py-2">
                {items.map((item) => (
                  <NavButton key={item.href} item={item} isSubItem />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <MdInventory className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-red-600">TexLeath</h1>
            <p className="text-xs text-red-900 font-medium">Industries</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavButton key={item.href} item={item} />
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* E-Commerce Section */}
        <CollapsibleSection
          title="E Commerce"
          icon={MdInventory}
          items={ecommerceItems}
          isOpen={ecommerceOpen}
          prevIsOpen={prevEcommerceOpen.current}
          onToggle={() => setEcommerceOpen(!ecommerceOpen)}
        />

        {/* Orders Section */}
        <CollapsibleSection
          title="Orders"
          icon={MdShoppingCart}
          items={orderItems}
          isOpen={ordersOpen}
          prevIsOpen={prevOrdersOpen.current}
          onToggle={() => setOrdersOpen(!ordersOpen)}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <motion.button
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <MdSettings className="w-4 h-4" />
          <span className="font-medium">Admin Settings</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

// import { useState } from 'react';

// import { IoMenu, IoClose } from "react-icons/io5";
// import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdList, MdOutlineCategory, MdOutlineFolderShared, MdProductionQuantityLimits, } from 'react-icons/md';
// import { motion, AnimatePresence } from "framer-motion";
// import { NavLink } from "react-router-dom";


// import { IoMdSearch } from "react-icons/io";

// import texleathlogo from "../texleathlogo.svg";
// import { RxDashboard } from "react-icons/rx";
// import { BsGraphUp } from "react-icons/bs";
// import { GoPeople, GoProjectRoadmap } from "react-icons/go";
// import { TbCategory } from 'react-icons/tb';


// const Navbar = () => {


//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const handleMenuToggle = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     const [isArrowOpen, setisArrowOpen] = useState(true);
//     const toggleOpen = () => setisArrowOpen(!isArrowOpen);



//     return (
//         <nav>
//             <div className=" hidden bg-[#3e0000] fixed xsx:flex pl-[25px] xsx:flex-col xsx:justify-between shadow-xl rounded-lg xsx:items-center ml-[-20px] w-[280px] h-screen  p-[10px]">
//                 <div className="flex text-red-50 flex-col w-[95%]">
//                     <div className="flex items-center py-[12px] mt-[8px] shadow-profile-navbar rounded-lg">
//                         <img src={texleathlogo} alt="Profile" className="w-[40px] h-[40px] border-[2px] border-red-900 rounded-full" />
//                         <div className="text-[18px] ml-[10px] font-[700] text-[#f62e2e]">TexLeath <span className='text-red-900'>Industries</span></div>
//                     </div>

//                     <div className="flex items-center px-[8px] py-[5px] mt-[15px] border-[2px] border-[#8c8c8c] rounded-lg">
//                         <IoMdSearch className=" text-[#ffeded] text-[24px]" />
//                         <div className="text-[15px] font-medium text-[#7f7f7f]">Search</div>
//                     </div>


//                     <div className="border-t-2 mt-[20px] pl-[4px] pt-[15px] border-gray-300 ">
//                         <NavLink to="/" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-red-900 text-red-100' : 'hover:bg-red-100 hover:font-[600] hover:text-red-200 text-white'}`}><RxDashboard className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Dashboard</p></NavLink>

//                         <NavLink to="/categoryList" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-red-900 text-red-100' : 'hover:bg-red-950 hover:font-[600] hover:text-red-200 text-white'}`}><MdOutlineFolderShared className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Categories</p></NavLink>

//                         <NavLink to="/subCategoryList" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-red-900 text-red-100' : 'hover:bg-red-950 hover:font-[600] hover:text-red-200 text-white'}`}><BsGraphUp className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Sub-Categories</p></NavLink>



//                         <div className="pl-[8px] mt-[15px] mb-[5px]">
//                             <div className="text-lg text-[#ffc8c8] flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
//                                 <div className="flex items-center">
//                                     <GoProjectRoadmap className="text-[22px] mt-[4px] mr-[12px]" />
//                                     <p className="font-[500] text-[16px]">E Commerce</p>
//                                 </div>
//                                 {isArrowOpen ? (
//                                     <MdKeyboardArrowDown className="ml-2" />
//                                 ) : (
//                                     <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
//                                 )}
//                             </div>

//                             <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 transition={{ duration: 0.3 }}
//                                 className="overflow-hidden"
//                             >
//                                 <div className='flex flex-col pt-[15px] items-start text-white'>
//                                     <NavLink to="/addProduct" className='flex mb-[4px] py-[8px]   px-[4px] w-[calc(100%-28px)] hover:text-red-500 ml-[28px]'>
//                                         <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-300 font-[700] rounded-full'>
//                                             <MdProductionQuantityLimits size={22} />
//                                         </div>
//                                         <button className='ml-[8px] font-[600]'  >
//                                             Add Producs
//                                         </button>
//                                     </NavLink>
//                                     <NavLink to="/productList"  className='flex mb-[4px] py-[8px]   px-[4px] w-[calc(100%-28px)] hover:text-red-500 ml-[28px]'>
//                                         <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-300 font-[700] rounded-full'>
//                                             <MdList size={22} />
//                                         </div>
//                                         <button className='ml-[8px] font-[600]'  >
//                                             Product List
//                                         </button>
//                                     </NavLink>

//                                 </div>
//                             </motion.div>
//                         </div>

//                         <div className="pl-[8px]  my-[5px]">
//                             <div className="text-lg text-[#ffc8c8] flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
//                                 <div className="flex items-center">
//                                     <GoProjectRoadmap className="text-[22px] mt-[4px] mr-[12px]" />
//                                     <p className="font-[500] text-[16px]">Orders</p>
//                                 </div>
//                                 {isArrowOpen ? (
//                                     <MdKeyboardArrowDown className="ml-2" />
//                                 ) : (
//                                     <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
//                                 )}
//                             </div>

//                             <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 transition={{ duration: 0.3 }}
//                                 className="overflow-hidden"
//                             >
//                                 <div className='flex flex-col pt-[15px] items-start text-white'>
//                                     <NavLink to="/admin-orders-list"  className='flex mb-[4px] py-[8px]   px-[4px] w-[calc(100%-28px)] hover:text-red-500 ml-[28px]'>
//                                         <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-300 font-[700] rounded-full'>
//                                             <MdOutlineCategory size={22} />
//                                         </div>
//                                         <button className='ml-[8px] font-[600]'  >
//                                             Manage Orders
//                                         </button>
//                                     </NavLink>
//                                     <NavLink to="/order-tracking"  className='flex mb-[4px] py-[8px]   px-[4px] w-[calc(100%-28px)] hover:text-red-500 ml-[28px]'>
//                                         <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-300 font-[700] rounded-full'>
//                                             <TbCategory size={22} />
//                                         </div>
//                                         <button className='ml-[8px] font-[600]'  >
//                                             Track Orders
//                                         </button>
//                                     </NavLink>

//                                 </div>
//                             </motion.div>
//                         </div>
//                     </div>

//                 </div>
//             </div>

//             <div className="relative text-white xsx:hidden">
//                 <div className="flex items-center h-[70px]  justify-between bg-white border-b-2 border-[#a4a4a4] px-4 py-3 z-50 relative">
//                     <div className="flex items-center">
//                         <motion.div
//                             initial={{ opacity: 1 }}
//                             animate={{ opacity: isMenuOpen ? 0 : 1 }}
//                             transition={{ duration: 0.2 }}
//                         >
//                             <img src={texleathlogo} alt="TL" className="md:w-[45px] w-[33px] h-[33px] md:h-[45px]" />
//                         </motion.div>
//                         <motion.div
//                             className="text-[28px] font-bold"
//                             initial={{ x: 40 }}
//                             animate={{ x: isMenuOpen ? -40 : 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <div className="text-[#575757] ml-[4px] md:text-[25px] text-[22px] font-[700]">Tex<span className='font-[800] text-red-600'>leath</span></div>
//                         </motion.div>
//                     </div>
//                     <motion.div
//                         className="cursor-pointer text-gray-500"
//                         onClick={handleMenuToggle}
//                     >

//                         {isMenuOpen ? (
//                             <IoClose size={35} />
//                         ) : (
//                             <IoMenu size={35} />
//                         )}
//                     </motion.div>
//                 </div>

//                 <AnimatePresence>
//                     {isMenuOpen && (
//                         <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: "100vw", transition: { duration: 0.5 } }}
//                             exit={{ width: 0, transition: { duration: 0.3, delay: 0.1 } }}
//                             className="fixed  px-[15px] inset-0 bg-navbar-color bg-white flex w-screen flex-col h-screen py-3 z-30"
//                         >
//                             <div className='my-[25px]'></div>
//                             <motion.div
//                                 initial={{ x: -100, opacity: 0 }}
//                                 animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
//                                 exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
//                                 className="flex flex-col mt-[25px]"
//                             >
//                                 <div className="flex items-center py-[12px] mt-[8px] shadow-profile-navbar rounded-lg">
//                                     <img src={texleathlogo} alt="Profile" className="w-[40px] h-[40px] border-[2px] border-red-900 rounded-full" />
//                                     <div className="text-[18px] ml-[10px] font-[700] text-[#f62e2e]">TexLeath <span className='text-red-900'>Industries</span></div>
//                                 </div>

//                                 <div className="flex items-center px-[8px] py-[5px] mt-[15px] border-[2px] border-[#8c8c8c] rounded-lg">
//                                     <IoMdSearch className=" text-[#8c8c8c] text-[24px]" />
//                                     <div className="text-[15px] font-medium text-[#7f7f7f]">Search</div>
//                                 </div>


//                                 <button onClick={handleMenuToggle} className="flex items-center px-[8px] py-[5px] my-[15px] border-[2px] border-[#8c8c8c] rounded-lg">
//                                     <IoMdSearch className=" text-[#8c8c8c] text-[24px]" />
//                                     <div className="text-[15px] font-medium text-[#7f7f7f]">Search</div>
//                                 </button>

//                                 <NavLink to="/" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
//                                     <RxDashboard className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Dashboard</p>
//                                 </NavLink>
//                                 <NavLink to="/categoryList" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
//                                     <MdOutlineFolderShared className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Overview</p>
//                                 </NavLink>
//                                 <NavLink to="/subCategoryList" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
//                                     <BsGraphUp className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Workflow</p>
//                                 </NavLink>


//                                 <div className="pl-[8px]  my-[5px]">
//                                     <div className="text-lg text-[#363636] flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
//                                         <div className="flex items-center">
//                                             <GoProjectRoadmap className="text-[22px] mt-[4px] mr-[12px]" />
//                                             <p className="font-[500] text-[16px]">E Commerce</p>
//                                         </div>
//                                         {isArrowOpen ? (
//                                             <MdKeyboardArrowDown className="ml-2" />
//                                         ) : (
//                                             <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
//                                         )}
//                                     </div>

//                                     <motion.div
//                                         initial={{ opacity: 0, height: 0 }}
//                                         animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
//                                         exit={{ opacity: 0, height: 0 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="overflow-hidden"
//                                     >
//                                         <div className='flex flex-col pt-[15px] items-start text-[#363636]'>
//                                             <div className='flex mb-[4px] py-[8px] hover:rounded-xl px-[4px] w-[calc(100%-28px)] border-b-[2px] border-[#cccccc] hover:border-white hover:bg-blue-100 ml-[28px]'>
//                                                 <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-900 font-[700] rounded-full'>
//                                                     <GoPeople size={22} />
//                                                 </div>
//                                                 <button className='ml-[8px] font-[600]'  >
//                                                     Add Producs
//                                                 </button>
//                                             </div>
//                                             <div className='flex mb-[4px] py-[8px] hover:rounded-xl px-[4px] w-[calc(100%-28px)] border-b-[2px] border-[#cccccc] hover:border-white hover:bg-blue-100 ml-[28px]'>
//                                                 <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-900 font-[700] rounded-full'>
//                                                     <GoPeople size={22} />
//                                                 </div>
//                                                 <button className='ml-[8px] font-[600]'  >
//                                                     Product List
//                                                 </button>
//                                             </div>

//                                         </div>
//                                     </motion.div>
//                                 </div>

//                                 <div className="pl-[8px]  my-[5px]">
//                                     <div className="text-lg text-[#363636] flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
//                                         <div className="flex items-center">
//                                             <GoProjectRoadmap className="text-[22px] mt-[4px] mr-[12px]" />
//                                             <p className="font-[500] text-[16px]">Orders</p>
//                                         </div>
//                                         {isArrowOpen ? (
//                                             <MdKeyboardArrowDown className="ml-2" />
//                                         ) : (
//                                             <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
//                                         )}
//                                     </div>

//                                     <motion.div
//                                         initial={{ opacity: 0, height: 0 }}
//                                         animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
//                                         exit={{ opacity: 0, height: 0 }}
//                                         transition={{ duration: 0.3 }}
//                                         className="overflow-hidden"
//                                     >
//                                         <div className='flex flex-col pt-[15px] items-start text-[#363636]'>
//                                             <div className='flex mb-[4px] py-[8px] hover:rounded-xl px-[4px] w-[calc(100%-28px)] border-b-[2px] border-[#cccccc] hover:border-white hover:bg-blue-100 ml-[28px]'>
//                                                 <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-900 font-[700] rounded-full'>
//                                                     <GoPeople size={22} />
//                                                 </div>
//                                                 <button className='ml-[8px] font-[600]'  >
//                                                     Manage Orders
//                                                 </button>
//                                             </div>
//                                             <div className='flex mb-[4px] py-[8px] hover:rounded-xl px-[4px] w-[calc(100%-28px)] border-b-[2px] border-[#cccccc] hover:border-white hover:bg-blue-100 ml-[28px]'>
//                                                 <div className='w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-red-900 font-[700] rounded-full'>
//                                                     <GoPeople size={22} />
//                                                 </div>
//                                                 <button className='ml-[8px] font-[600]'  >
//                                                     Track Orders
//                                                 </button>
//                                             </div>

//                                         </div>
//                                     </motion.div>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </nav>
//     );
// };
// export default Navbar;


// /*import React, { useState } from "react";
// import { IoMenu, IoClose } from "react-icons/io5";
// import { motion, AnimatePresence } from "framer-motion";

// import { MdList, MdProductionQuantityLimits, MdOutlineCategory, MdOutlineSpaceDashboard } from "react-icons/md";
// import { NavLink } from "react-router-dom";
// import { TbCategory } from "react-icons/tb";

// import texleathlogo from "../texleathlogo.svg";

// const Navbar = () => {

//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const handleMenuToggle = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     return (
//         <nav className="xsx">
//             <div className=" hidden bg-[#3e0909] fixed xsx:flex pl-[25px] xsx:flex-col xsx:justify-between shadow-xl rounded-lg xsx:items-center ml-[-20px] w-[280px] h-screen  p-[10px]">
//                 <div className="flex text-red-50 flex-col w-[95%]">

//                     <div className="pt-[5px] xsx:flex flex-col hidden items-center justify-center pb-[5px] overflow-hidden">
//                         <img src={texleathlogo} alt="kasm kjanf" className="w-[75px] h-[75px]" />
//                         <div className="text-red-400 ml-[4px] text-[20px] font-bold">TEXLEATH <span className="text-red-100">INDUSTRIES</span></div>
//                     </div>

//                     <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

//                     <NavLink to="/" className={({ isActive }) => `flex mt-[55px] mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                         <MdOutlineSpaceDashboard className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Dashboard</p>
//                     </NavLink>
//                     <NavLink to="/categoryList" className={({ isActive }) => `flex mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                         <TbCategory className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Categories</p>
//                     </NavLink>
//                     <NavLink to="/subCategoryList" className={({ isActive }) => `flex font-[500] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                         <MdOutlineCategory className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Sub-Categories</p>
//                     </NavLink>

//                     <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

//                     <div className="my-[5px]">
//                         <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
//                             Ecommerce
//                         </h3>
//                         <div className="overflow-hidden mt-[10px]">
//                             <NavLink to="/productList" className={({ isActive }) => `flex mb-[7px]  items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                 <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Products List</p>
//                             </NavLink>
//                             <NavLink to="/addProduct" className={({ isActive }) => `flex mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                 <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Add Products    </p>
//                             </NavLink>
//                         </div>
//                     </div>

//                     <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

//                     <div className="my-[5px]">
//                         <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
//                             Orders
//                         </h3>

//                         <div className="overflow-hidden mt-[10px]">
//                             <NavLink to="/admin-orders-list" className={({ isActive }) => `flex mb-[7px] mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                 <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Manage Orders</p>
//                             </NavLink>
//                             <NavLink to="/order-tracking" className={({ isActive }) => `flex items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                 <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Track Order    </p>
//                             </NavLink>

//                         </div>
//                     </div>

//                 </div>
//             </div>

//             <div className="relative text-white xsx:hidden">
//                 <div className="flex items-center h-[70px] justify-between bg-gradient-to-r from-red-950 to-red-900 px-4 py-3 z-50 relative">
//                     <div className="flex items-center">
//                         <motion.div
//                             initial={{ opacity: 1 }}
//                             animate={{ opacity: isMenuOpen ? 0 : 1 }}
//                             transition={{ duration: 0.2 }}
//                         >
//                             <img src={texleathlogo} alt="TL" className="md:w-[45px] w-[33px] h-[33px] md:h-[45px]" />
//                         </motion.div>
//                         <motion.div
//                             className="text-[28px] font-bold"
//                             initial={{ x: 40 }}
//                             animate={{ x: isMenuOpen ? -40 : 0 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <div className="flex">
//                                 <div className="text-red-700 ml-[4px] md:text-[25px] text-[19px] font-bold">TEXLEATH</div>
//                                 <div className="text-red-100 ml-[5px] md:text-[25px] text-[18px] font-bold">INDUSTRIES</div>
//                             </div>
//                         </motion.div>
//                     </div>
//                     <motion.div
//                         key={isMenuOpen ? 'close' : 'menu'}
//                         initial={{ opacity: 0, rotate: isMenuOpen ? 180 : -180 }}
//                         animate={{ opacity: 1, rotate: 0 }}
//                         exit={{ opacity: 0, rotate: isMenuOpen ? -180 : 180 }}
//                         transition={{ duration: 0.3 }}
//                         className="cursor-pointer text-gray-300"
//                         onClick={handleMenuToggle}
//                     >

//                         {isMenuOpen ? (
//                             <IoClose size={35} />
//                         ) : (
//                             <IoMenu size={35} />
//                         )}
//                     </motion.div>
//                 </div>
 
//                 <AnimatePresence>
//                     {isMenuOpen && (
//                         <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: "70vw", transition: { duration: 0.5 } }}
//                             exit={{ width: 0, transition: { duration: 0.3, delay: 0.1 } }}
//                             className="fixed inset-0 bg-navbar-color bg-gradient-to-r from-red-950 to-red-900 flex w-[70vw] flex-col h-screen px-[5px] py-3 z-30"

//                         >
//                             <motion.div
//                                 initial={{ x: -100, opacity: 0 }}
//                                 animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
//                                 exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
//                                 className="flex flex-col mt-[25px]"
//                             >
//                                 <NavLink to="/" className={({ isActive }) => `flex mt-[55px] mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                     <MdOutlineSpaceDashboard className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Dashboard</p>
//                                 </NavLink>
//                                 <NavLink to="/categoryList" className={({ isActive }) => `flex mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                     <TbCategory className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Categories</p>
//                                 </NavLink>
//                                 <NavLink to="/subCategoryList" className={({ isActive }) => `flex font-[500] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                     <MdOutlineCategory className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Sub-Categories</p>
//                                 </NavLink>

//                                 <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

//                                 <div className="my-[5px]">
//                                     <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
//                                         Ecommerce
//                                     </h3>
//                                     <div className="overflow-hidden mt-[10px]">
//                                         <NavLink to="/productList" className={({ isActive }) => `flex mb-[7px]  items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                             <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Products List</p>
//                                         </NavLink>
//                                         <NavLink to="/addProduct" className={({ isActive }) => `flex mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                             <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Add Products    </p>
//                                         </NavLink>
//                                     </div>
//                                 </div>

//                                 <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

//                                 <div className="my-[5px]">
//                                     <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
//                                         Orders
//                                     </h3>

//                                     <div className="overflow-hidden mt-[10px]">
//                                         <NavLink to="/admin-orders-list" className={({ isActive }) => `flex mb-[7px] mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                             <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Manage Orders</p>
//                                         </NavLink>
//                                         <NavLink to="/order-tracking" className={({ isActive }) => `flex items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
//                                             <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Track Order    </p>
//                                         </NavLink>

//                                     </div>
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>

//         </nav>
//     );
// };

// export default Navbar;
// */