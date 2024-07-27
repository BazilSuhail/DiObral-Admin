import React, { useState } from "react";
import { PiHandWithdrawLight } from "react-icons/pi";
import { MdScreenRotation, MdCategory, MdList, MdTrackChanges, MdOutlineDashboard, MdProductionQuantityLimits } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { RiMenu3Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const commonIconClasses = " mr-[4px] text-[24px]";

    return (
        <nav>
            {/* Navbar for larger screens */}
            <div className=" hidden xsx:flex pl-[35px] pt-[55px] xsx:flex-col xsx:justify-between shadow-xl rounded-2xl xsx:items-center ml-[-20px] w-[280px] h-screen bg-red-100  p-[10px]">
                <div className="flex text-red-900 font-extrabold flex-col w-[98%]">
                    <NavLink
                        to="/student-profile"
                        className={({ isActive }) => `flex items-center p-2 rounded-md text-md ${isActive ? 'bg-red-800 text-white font-bold my-[6px]' : 'my-[6px] hover:bg-red-800 hover:rounded-2xl font-medium hover:text-white text-red-900'}`}
                    >
                        <MdOutlineDashboard className="text-[29px] mt-[-2px] mr-[4px]" /><p className="mb-[4px] text-[21px]">Dashboard</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[-10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Ecommerce</div>
                    <NavLink
                        to="/addProduct"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdProductionQuantityLimits className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Product</p>
                    </NavLink>
                    <NavLink
                        to="/productList"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Product List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Categories</div>
                    <NavLink
                        to="/Categoryform"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Category</p>
                    </NavLink>
                    <NavLink
                        to="/categoryList"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Category List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Sub-Categories</div>
                    <NavLink
                        to="/subCategoryform"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Sub-Category</p>
                    </NavLink>
                    <NavLink
                        to="/subCategoryList"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Sub-Category List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Orders</div>
                    <NavLink
                        to="/admin-orders-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Orders List</p>
                    </NavLink>
                    <NavLink
                        to="/order-tracking"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdTrackChanges className={commonIconClasses} /><p className="mt-[2px] font-bold">Order Tracking</p>
                    </NavLink>
                    <NavLink
                        to="/completed-orders"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <PiHandWithdrawLight className={commonIconClasses} /><p className="mt-[2px] font-bold">Completed Orders</p>
                    </NavLink>
                </div>
            </div>

            {/* Navbar for small screens */}
            <div className="xsx:hidden bg-red-950 w-full h-[80px] z-35 flex items-center" onClick={toggleNavbar}>
                <div className="w-[50px] ml-[14px] h-[50px] "></div>
                <button className="text-red-100 ml-auto mr-[18px]">{isOpen ? <p><RxCross2 size={25} /></p> : <p><RiMenu3Line size={25} /></p>}</button>
            </div>

            {/* Conditionally render the first div for smaller screens */}
            <div className={`fixed top-0 left-0 w-3/5 h-full bg-[red]/10 backdrop-blur-[15px] z-40 transition-transform duration-900 transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full'}`}>
                <div className="flex text-red-900  flex-col w-[98%]">
                    <NavLink
                        to="/student-profile"
                        className={({ isActive }) => `flex items-center p-2 rounded-md text-md ${isActive ? 'bg-red-800 text-white font-bold my-[6px]' : 'my-[6px] hover:bg-red-800 hover:rounded-2xl font-medium hover:text-white text-red-900'}`}
                    >
                        <MdOutlineDashboard className={commonIconClasses} /><p className="mt-0">Dashboard</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Ecommerce</div>
                    <NavLink
                        to="/add-product"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdScreenRotation className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Product</p>
                    </NavLink>
                    <NavLink
                        to="/product-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Product List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Categories</div>
                    <NavLink
                        to="/add-category"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Category</p>
                    </NavLink>
                    <NavLink
                        to="/category-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Category List</p>
                    </NavLink>

                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>

                    <div className="ml-[6px] text-lg">Sub-Categories</div>
                    <NavLink
                        to="/add-csdategory"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdCategory className={commonIconClasses} /><p className="mt-[2px] font-bold">Add Sub-Category</p>
                    </NavLink>
                    <NavLink
                        to="/catsdegory-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Sub-Categories List</p>
                    </NavLink>


                    <div className="w-[95%] rounded-lg mt-[10px] h-[3px] bg-red-900 mx-auto my-[5px]"></div>
                    <div className="ml-[6px] text-lg">Orders</div>
                    <NavLink
                        to="/orders-list"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdList className={commonIconClasses} /><p className="mt-[2px] font-bold">Orders List</p>
                    </NavLink>
                    <NavLink
                        to="/order-tracking"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <MdTrackChanges className={commonIconClasses} /><p className="mt-[2px] font-bold">Order Tracking</p>
                    </NavLink>
                    <NavLink
                        to="/completed-orders"
                        className={({ isActive }) => `ml-[15px] mt-[6px] ${isActive ? 'bg-red-800 text-white font-bold' : 'hover:bg-red-800 hover:rounded-xl font-medium hover:text-white text-red-900'} text-sm rounded-md p-[8px] w-[90%] flex flex-row`}
                    >
                        <PiHandWithdrawLight className={commonIconClasses} /><p className="mt-[2px] font-bold">Completed Orders</p>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
