import React, { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

import { MdList, MdProductionQuantityLimits, MdOutlineCategory, MdOutlineSpaceDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { TbCategory } from "react-icons/tb";

import texleathlogo from "../texleathlogo.svg";

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="xsx">
            <div className=" hidden bg-[#3e0909] fixed xsx:flex pl-[25px] xsx:flex-col xsx:justify-between shadow-xl rounded-lg xsx:items-center ml-[-20px] w-[280px] h-screen  p-[10px]">
                <div className="flex text-red-50 flex-col w-[95%]">

                    <div className="pt-[5px] xsx:flex flex-col hidden items-center justify-center pb-[5px] overflow-hidden">
                        <img src={texleathlogo} alt="kasm kjanf" className="w-[75px] h-[75px]" />
                        <div className="text-red-400 ml-[4px] text-[20px] font-bold">TEXLEATH <span className="text-red-100">INDUSTRIES</span></div>
                    </div>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

                    <NavLink to="/student-profile" className={({ isActive }) => `flex mt-[55px] mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                        <MdOutlineSpaceDashboard className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Dashboard</p>
                    </NavLink>
                    <NavLink to="/categoryList" className={({ isActive }) => `flex mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                        <TbCategory className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Categories</p>
                    </NavLink>
                    <NavLink to="/subCategoryList" className={({ isActive }) => `flex font-[500] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                        <MdOutlineCategory className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Sub-Categories</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

                    <div className="my-[5px]">
                        <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
                            Ecommerce
                        </h3>
                        <div className="overflow-hidden mt-[10px]">
                            <NavLink to="/productList" className={({ isActive }) => `flex mb-[7px]  items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Products List</p>
                            </NavLink>
                            <NavLink to="/addProduct" className={({ isActive }) => `flex mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Add Products    </p>
                            </NavLink>
                        </div>
                    </div>

                    <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

                    <div className="my-[5px]">
                        <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
                            Orders
                        </h3>

                        <div className="overflow-hidden mt-[10px]">
                            <NavLink to="/admin-orders-list" className={({ isActive }) => `flex mb-[7px] mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Manage Orders</p>
                            </NavLink>
                            <NavLink to="/order-tracking" className={({ isActive }) => `flex items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Track Order    </p>
                            </NavLink>

                        </div>
                    </div>

                </div>
            </div>

            <div className="relative text-white xsx:hidden">
                <div className="flex items-center h-[70px] justify-between bg-gradient-to-r from-red-950 to-red-900 px-4 py-3 z-50 relative">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: isMenuOpen ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <img src={texleathlogo} alt="TL" className="md:w-[45px] w-[33px] h-[33px] md:h-[45px]" />
                        </motion.div>
                        <motion.div
                            className="text-[28px] font-bold"
                            initial={{ x: 40 }}
                            animate={{ x: isMenuOpen ? -40 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex">
                                <div className="text-red-700 ml-[4px] md:text-[25px] text-[19px] font-bold">TEXLEATH</div>
                                <div className="text-red-100 ml-[5px] md:text-[25px] text-[18px] font-bold">INDUSTRIES</div>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div
                        key={isMenuOpen ? 'close' : 'menu'}
                        initial={{ opacity: 0, rotate: isMenuOpen ? 180 : -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: isMenuOpen ? -180 : 180 }}
                        transition={{ duration: 0.3 }}
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
                            <div className=''></div> 
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
                                exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                                className="flex flex-col mt-[25px]"
                            >
                                <NavLink to="/student-profile" className={({ isActive }) => `flex mt-[55px] mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <MdOutlineSpaceDashboard className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Dashboard</p>
                                </NavLink>
                                <NavLink to="/categoryList" className={({ isActive }) => `flex mb-[7px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <TbCategory className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Categories</p>
                                </NavLink>
                                <NavLink to="/subCategoryList" className={({ isActive }) => `flex font-[500] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <MdOutlineCategory className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Sub-Categories</p>
                                </NavLink>

                                <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

                                <div className="my-[5px]">
                                    <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
                                        Ecommerce
                                    </h3>
                                    <div className="overflow-hidden mt-[10px]">
                                        <NavLink to="/productList" className={({ isActive }) => `flex mb-[7px]  items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                            <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Products List</p>
                                        </NavLink>
                                        <NavLink to="/addProduct" className={({ isActive }) => `flex mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                            <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Add Products    </p>
                                        </NavLink>
                                    </div>
                                </div>

                                <div className="w-[95%] rounded-lg h-[1px] bg-red-200 mx-auto mt-[15px] mb-[5px]"></div>

                                <div className="my-[5px]">
                                    <h3 className="ml-[6px] text-lg flex items-center font-semibold justify-between cursor-pointer" >
                                        Orders
                                    </h3>

                                    <div className="overflow-hidden mt-[10px]">
                                        <NavLink to="/admin-orders-list" className={({ isActive }) => `flex mb-[7px] mt-[8px] items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                            <MdList className="text-[20px] mb-[2px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Manage Orders</p>
                                        </NavLink>
                                        <NavLink to="/order-tracking" className={({ isActive }) => `flex items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                            <MdProductionQuantityLimits className="text-[20px] mb-[3px] mr-[12px]" /><p className="mb-[2px] font-[500] text-[18px]">Track Order    </p>
                                        </NavLink>

                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </nav>
    );
};

export default Navbar;
