import React, { useState } from "react";
import { PiHandWithdrawLight } from "react-icons/pi";
import { MdScreenRotation, MdCategory, MdList, MdTrackChanges, MdOutlineDashboard, MdProductionQuantityLimits } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { RiMenu3Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";


import texleathlogo from "../texleathlogo.svg";
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const commonIconClasses = " mr-[4px] text-[24px]";

    return (
        <nav className="xsx">
            {/* Navbar for larger screens */}

            <div className=" hidden bg-gradient-to-r from-red-900 via-custom-red to-red-950 fixed xsx:flex pl-[25px] xsx:flex-col xsx:justify-between shadow-xl rounded-lg xsx:items-center ml-[-20px] w-[280px] h-screen  p-[10px]">
                <div className="flex text-red-50 flex-col w-[95%]">

                    <div className="pt-[5px] xsx:flex flex-col hidden items-center justify-center pb-[5px] overflow-hidden">
                        <img src={texleathlogo} alt="kasm kjanf" className="w-[75px] h-[75px]" />
                        <div className="text-red-400 ml-[4px] text-[20px] font-bold">TEXLEATH <span className="text-red-100">INDUSTRIES</span></div>
                    </div>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

                    <NavLink to="/student-profile" className={({ isActive }) => `flex mt-[25px] mb-[7px] font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                        <MdOutlineDashboard className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Dashboard</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg h-[2px] bg-red-50 mx-auto my-[5px]"></div>


                    <div className="ml-[6px] text-lg">Ecommerce</div>
                    <NavLink
                        to="/addProduct"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdProductionQuantityLimits className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Product</p>
                    </NavLink>
                    <NavLink
                        to="/productList"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Product List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[2px] bg-red-50 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Categories</div>
                    <NavLink
                        to="/Categoryform"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Category</p>
                    </NavLink>
                    <NavLink
                        to="/categoryList"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Category List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[2px] bg-red-50 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Sub-Categories</div>
                    <NavLink
                        to="/subCategoryform"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Sub-Category</p>
                    </NavLink>
                    <NavLink
                        to="/subCategoryList"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Sub-Category List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Orders</div>
                    <NavLink
                        to="/admin-orders-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Orders List</p>
                    </NavLink>
                    <NavLink
                        to="/order-tracking"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdTrackChanges className={commonIconClasses} /><p className="mt-[2px] font-bold">Order Tracking</p>
                    </NavLink>
                    <NavLink
                        to="/completed-orders"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50  text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <PiHandWithdrawLight className={commonIconClasses} /><p className="mt-[2px] font-bold">Completed Orders</p>
                    </NavLink>
                </div>
            </div>

            



            
            {/* Navbar for small screens */}
            <div className="xsx:hidden bg-red-900 w-full h-[80px] z-35 flex items-center" onClick={toggleNavbar}>
                {!isOpen &&
                    <div className="pt-[5px] flex items-center pb-[5px] overflow-hidden">
                        <img src={texleathlogo} alt="Texleath Industries" className=" ml-[8px] w-[50px] h-[50px]" />
                        <div className="text-red-400 text-[24px] ml-[2px] font-bold">TEXLEATH <span className="text-red-100">INDUSTRIES</span></div>
                    </div>
                }

                <button className="text-red-100 ml-auto mr-[18px]">{isOpen ? <p><RxCross2 size={25} /></p> : <p><RiMenu3Line size={25} /></p>}</button>
            </div>

            {/* Conditionally render the first div for smaller screens */}
            <div className={`fixed top-0 left-0 w-3/5 h-full bg-[red]/10 backdrop-blur-[15px] z-40 transition-transform duration-900 transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full'}`}>
                <div className="flex  flex-col w-[98%]">
                    <NavLink
                        to="/student-profile"
                        className={({ isActive }) => `flex items-center p-2 rounded-md text-md ${isActive ? 'bg-red-50 text-white font-bold my-[6px]' : 'my-[6px] hover:bg-red-50 hover:rounded-2xl font-medium hover:text-white text-red-50'}`}
                    >
                        <MdOutlineDashboard className={commonIconClasses} /><p className="mt-0">Dashboard</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Ecommerce</div>
                    <NavLink
                        to="/add-product"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdScreenRotation className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Product</p>
                    </NavLink>
                    <NavLink
                        to="/product-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Product List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Categories</div>
                    <NavLink
                        to="/add-category"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Category</p>
                    </NavLink>
                    <NavLink
                        to="/category-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Category List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Sub-Categories</div>
                    <NavLink
                        to="/add-csdategory"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Sub-Category</p>
                    </NavLink>
                    <NavLink
                        to="/catsdegory-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Sub-Categories List</p>
                    </NavLink>


                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-50 mx-auto my-[5px]"></div>
                    <div className="ml-[6px] text-lg">Orders</div>
                    <NavLink
                        to="/orders-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Orders List</p>
                    </NavLink>
                    <NavLink
                        to="/order-tracking"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdTrackChanges className={commonIconClasses} /><p className="mt-[2px] font-bold">Order Tracking</p>
                    </NavLink>
                    <NavLink
                        to="/completed-orders"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-50 text-white font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-white text-red-50'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <PiHandWithdrawLight className={commonIconClasses} /><p className="mt-[2px] font-bold">Completed Orders</p>
                    </NavLink>
                </div>
            </div>

        </nav>
    );
};

export default Navbar;
