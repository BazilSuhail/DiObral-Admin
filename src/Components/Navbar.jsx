import React, { useState } from "react";


import { IoMenu, IoClose } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, } from 'react-icons/md';
import { motion, AnimatePresence } from "framer-motion";

import { MdList, MdOutlineDashboard, MdProductionQuantityLimits } from "react-icons/md";
import { NavLink } from "react-router-dom";

import { MdOutlineCategory } from "react-icons/md";
import { TbCategory } from "react-icons/tb";

import texleathlogo from "../texleathlogo.svg";

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    const [isArrowOpen, setisArrowOpen] = useState(true);
    const toggleOpen = () => setisArrowOpen(!isArrowOpen);


    const [isOrderArrowOpen, setisOrderArrowOpen] = useState(true);
    const toogleOrderOpen = () => setisOrderArrowOpen(!isOrderArrowOpen);

    return (
        <nav className="xsx">
            <div className=" hidden bg-[#3e0909] fixed xsx:flex pl-[25px] xsx:flex-col xsx:justify-between shadow-xl rounded-lg xsx:items-center ml-[-20px] w-[280px] h-screen  p-[10px]">
                <div className="flex text-red-50 flex-col w-[95%]">

                    <div className="pt-[5px] xsx:flex flex-col hidden items-center justify-center pb-[5px] overflow-hidden">
                        <img src={texleathlogo} alt="kasm kjanf" className="w-[75px] h-[75px]" />
                        <div className="text-red-400 ml-[4px] text-[20px] font-bold">TEXLEATH <span className="text-red-100">INDUSTRIES</span></div>
                    </div>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

                    <NavLink to="/student-profile" className={({ isActive }) => `flex mt-[55px] mb-[7px] font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                        <MdOutlineDashboard className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Dashboard</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mb-[15px] h-[2px] bg-red-50 mx-auto my-[5px]"></div>

                    <div className="my-[5px]">
                        <div className="ml-[6px] text-lg flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
                            <span className="font-semibold">Ecommerce</span>
                            {isArrowOpen ? (
                                <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                            ) : (
                                <MdKeyboardArrowDown className="ml-2" />
                            )}
                        </div>
                        {isArrowOpen &&
                            <div className="w-[95%] rounded-lg h-[1px] bg-red-50 mx-auto my-[5px]"></div>
                        }
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <NavLink to="/productList" className={({ isActive }) => `ml-[15px] py-[6px] mt-[8px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                <MdList className="text-[26px] mr-[4px]" /><p className="text-[16px] mb-[1px] font-medium">Products</p>
                            </NavLink>
                            <NavLink to="/addProduct" className={({ isActive }) => `ml-[15px] py-[6px] my-[12px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                <MdProductionQuantityLimits className="text-[26px] mr-[6px]" /><p className="text-[16px] mb-[1px] font-medium">Add Products</p>
                            </NavLink>
                        </motion.div>
                    </div>


                    <div className="my-[5px]">
                        <div className="ml-[6px] text-lg flex items-center justify-between cursor-pointer" onClick={toogleOrderOpen}>
                            <span className="font-semibold">Orders</span>
                            {isOrderArrowOpen ? (
                                <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                            ) : (
                                <MdKeyboardArrowDown className="ml-2" />
                            )}
                        </div>
                        {isOrderArrowOpen &&
                            <div className="w-[95%] rounded-lg h-[1px] bg-red-50 mx-auto my-[5px]"></div>
                        }
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: isOrderArrowOpen ? 1 : 0, height: isOrderArrowOpen ? 'auto' : 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <NavLink to="/order-tracking" className={({ isActive }) => `ml-[15px] py-[6px] mt-[8px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                <MdList className="text-[26px] mr-[4px]" /><p className="text-[16px] mb-[1px] font-medium">Order Tracking</p>
                            </NavLink>
                            <NavLink to="/admin-orders-list" className={({ isActive }) => `ml-[15px] py-[6px] my-[12px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                <MdProductionQuantityLimits className="text-[26px] mr-[6px]" /><p className="text-[16px] mb-[1px] font-medium">Orders List</p>
                            </NavLink>
                        </motion.div>
                    </div>


                    <div className="w-[95%] rounded-lg mt-[15px] h-[1.5px] bg-red-50 mx-auto my-[5px]"></div>
                    <NavLink to="/categoryList" className={({ isActive }) => `flex mt-[10px] mb-[7px] font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                        <TbCategory className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Categories</p>
                    </NavLink>
                    <NavLink to="/subCategoryList" className={({ isActive }) => `flex font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                        <MdOutlineCategory className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Sub-Categories</p>
                    </NavLink>

                </div>
            </div>

            <div className="relative text-white xsx:hidden">
                <div className="flex items-center h-[70px] justify-between bg-gradient-to-r from-red-950 to-red-900 px-4 py-3 z-50 relative">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: isMenuOpen ? 0 : 1 }}
                            transition={{ duration: 0.2 }} // Adjust duration as needed
                        >
                            <img src={texleathlogo} alt="TL" className="md:w-[45px] w-[33px] h-[33px] md:h-[45px]" />
                        </motion.div>
                        <motion.div
                            className="text-[28px] font-bold"
                            initial={{ x: 40 }}
                            animate={{ x: isMenuOpen ? -40 : 0 }}
                            transition={{ duration: 0.5 }} // Adjust duration as needed
                        >
                            <div className="flex">
                                <div className="text-red-700 ml-[4px] md:text-[25px] text-[19px] font-bold">TEXLEATH</div>
                                <div className="text-red-100 ml-[5px] md:text-[25px] text-[18px] font-bold">INDUSTRIES</div>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div
                        key={isMenuOpen ? 'close' : 'menu'} // Unique key to trigger animation on change
                        initial={{ opacity: 0, rotate: isMenuOpen ? 180 : -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: isMenuOpen ? -180 : 180 }} // Animate out with reverse rotation
                        transition={{ duration: 0.3 }} // Duration for the animation
                        className="cursor-pointer text-gray-300"
                        onClick={handleMenuToggle}
                    >

                        {isMenuOpen ? (
                            <IoClose size={35} />
                        ) : (
                            <IoMenu size={35} />
                        )}
                    </motion.div>
                </div>

                {/* Full navbar for smaller screens */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "70vw", transition: { duration: 0.5 } }}
                            exit={{ width: 0, transition: { duration: 0.3, delay: 0.1 } }}
                            className="fixed inset-0 bg-navbar-color bg-gradient-to-r from-red-950 to-red-900 flex w-[70vw] flex-col h-screen px-[5px] py-3 z-30"

                        >
                            <div className='my-[25px]'></div>
                            {/* Menu items */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
                                exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                                className="flex flex-col mt-[25px]"
                            >
                                <NavLink to="/student-profile" className={({ isActive }) => `flex mt-[5px] mb-[7px] font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <MdOutlineDashboard onClick={handleMenuToggle} className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Dashboard</p>
                                </NavLink>

                                <div className="w-[95%] rounded-lg mb-[15px] h-[2px] bg-red-50 mx-auto my-[5px]"></div>

                                <div className="my-[5px]">
                                    <div className="ml-[6px] text-lg flex items-center justify-between cursor-pointer"  onClick={toggleOpen}>
                                        <span className="font-semibold">Ecommerce</span>
                                        {isArrowOpen ? (
                                            <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                                        ) : (
                                            <MdKeyboardArrowDown className="ml-2" />
                                        )}
                                    </div>
                                    {isArrowOpen &&
                                        <div className="w-[95%] rounded-lg h-[1px] bg-red-50 mx-auto my-[5px]"></div>
                                    }
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <NavLink onClick={handleMenuToggle} to="/productList" className={({ isActive }) => `ml-[15px] py-[6px] mt-[8px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdList className="text-[26px] mr-[4px]" /><p className="text-[16px] mb-[1px] font-medium">Products</p>
                                        </NavLink>
                                        <NavLink onClick={handleMenuToggle} to="/addProduct" className={({ isActive }) => `ml-[15px] py-[6px] my-[12px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdProductionQuantityLimits className="text-[26px] mr-[6px]" /><p className="text-[16px] mb-[1px] font-medium">Add Products</p>
                                        </NavLink>
                                    </motion.div>
                                </div>


                                <div className="my-[5px]">
                                    <div className="ml-[6px] text-lg flex items-center justify-between cursor-pointer" onClick={toogleOrderOpen}>
                                        <span className="font-semibold">Orders</span>
                                        {isOrderArrowOpen ? (
                                            <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                                        ) : (
                                            <MdKeyboardArrowDown className="ml-2" />
                                        )}
                                    </div>
                                    {isOrderArrowOpen &&
                                        <div className="w-[95%] rounded-lg h-[1px] bg-red-50 mx-auto my-[5px]"></div>
                                    }
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: isOrderArrowOpen ? 1 : 0, height: isOrderArrowOpen ? 'auto' : 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <NavLink onClick={handleMenuToggle} to="/order-tracking" className={({ isActive }) => `ml-[15px] py-[6px] mt-[8px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdList className="text-[26px] mr-[4px]" /><p className="text-[16px] mb-[1px] font-medium">Order Tracking</p>
                                        </NavLink>
                                        <NavLink onClick={handleMenuToggle} to="/admin-orders-list" className={({ isActive }) => `ml-[15px] py-[6px] my-[12px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdProductionQuantityLimits className="text-[26px] mr-[6px]" /><p className="text-[16px] mb-[1px] font-medium">Orders List</p>
                                        </NavLink>
                                    </motion.div>
                                </div>

                                <div className="w-[95%] rounded-lg mt-[15px] h-[1.5px] bg-red-50 mx-auto my-[5px]"></div>
                                <NavLink onClick={handleMenuToggle} to="/categoryList" className={({ isActive }) => `flex mt-[10px] mb-[7px] font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <TbCategory className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Categories</p>
                                </NavLink>
                                <NavLink onClick={handleMenuToggle} to="/subCategoryList" className={({ isActive }) => `flex font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <MdOutlineCategory className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Sub-Categories</p>
                                </NavLink>
                            </motion.div>


                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </nav>
    );
};

export default Navbar;
