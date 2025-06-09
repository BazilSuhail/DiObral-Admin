import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import CategoryForm from "./Components/categories/Addcategories";
import CategoriesList from "./Components/categories/CategoryList";
//import SubcategoryCreationForm from "./Components/subcategories/AddsubCategories";
import SubcategoryList from "./Components/subcategories/SubcategoryList";
import AddProductForm from "./Components/products/Addproduct";
import ProductList from "./Components/products/ProductList";
import UsersOrders from "./Components/orders/UserOrders";
import ShowOrders from "./Components/orders/ShowOrders";
import OrderDetails from "./Components/orders/OrderDetails";
import OrderTracking from "./Components/orders/OrderTracking";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>

        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/Categoryform" element={<CategoryForm />} />
        <Route exact path="/categoryList" element={<CategoriesList />} /> 
        <Route exact path="/subCategoryList" element={<SubcategoryList />} />
        <Route exact path="/addProduct" element={<AddProductForm />} />
        <Route exact path="/productList" element={<ProductList />} />
        <Route exact path="/admin-orders-list" element={<UsersOrders />} />
        <Route exact path="/admin-orders-list/:userId/:documentId" element={<ShowOrders />} />
        <Route exact path="/:userId/order-details" element={<OrderDetails />} />
        <Route exact path="/order-tracking" element={<OrderTracking />} />

      </Routes>
    </Router>
  );
};

export default App;