### DiObral (E-Commerce Admin Dashboard)

`DiObral` Admin Dashboard is the e-commerce clothing/ online market place management system for a premier clothing e-commerce platform. It provides a sleek and intuitive interface for managing products, orders, users, and reviews, designed to enhance operational efficiency with advanced features and interactive elements.



[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](#)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat&label=Contributions&colorA=red&colorB=black	)](#)

---

## Project Description:

This project is a e-commerce admin dashboard that streamlines store management with key functionalities like product management (add, edit, delete items), order tracking (view and update statuses). This dashboard also includes an analytics overview with sales, product's stock, and order statistics, providing admins with real-time insights for data-driven decisions. The intuitive interface ensures smooth navigation, making backend operations efficient and hassle-free.

The dashboard is built using the MERN stack—MongoDB for flexible data storage, Express.js and Node.js for a robust backend API, and React for a dynamic, responsive frontend. Charts (likely using libraries like Chart.js and Recharts) visualize sales trends, customer behavior, and order metrics, helping admins quickly interpret data. The integration of JWT-based authentication ensures secure access, while RESTful APIs enable seamless CRUD operations. This full-stack approach ensures scalability, performance, and a smooth admin experience.

---

### 🤖 Tech Stack 

 <a href="#"> 
  <img alt="JavaScript" src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>  
  <img alt="React" src="https://img.shields.io/badge/React-%2361DAFB.svg?&style=for-the-badge&logo=react&logoColor=white"/> 
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-%23ED5A9F.svg?&style=for-the-badge&logo=framer&logoColor=white"/>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-%2306B6D4.svg?&style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img alt="Node js" src="https://img.shields.io/badge/Node.js-%23339933.svg?&style=for-the-badge&logo=node.js&logoColor=white"/> 
<img alt="Express js" src="https://img.shields.io/badge/Express.js-%23000000.svg?&style=for-the-badge&logo=express&logoColor=white"/>   
<img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/> 
 </a>

 ---

- Check out the latest demo of Project [DiObral](https://diobral.netlify.app/). 
- Find the Client Side Repository of this Project Here [DiObral-Client](https://github.com/BazilSuhail/DiObral-Online-Marketplace). 
- Find the Server's Repository of this Project Here [DiObral-Backend-Server](https://github.com/BazilSuhail/DiObral-Backend-Server). 

---


## Run Locally

 Clone the project using following command
```bash
  git clone https://github.com/BazilSuhail/DiObral-Admin-Dashboard.git
```
Go to the project directory
```bash
cd DiObral-Admin-Dashboard
```
Then **Run** this command in your terminal to install all required dependancies:
```bash
  npm install
```
In the project directory, you can run:
```bash
  npm start
``` 
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## Features

#### Dashboard Overview
- **Admin Interface**: Sleek and user-friendly design for efficient management of the e-commerce platform.
- **Dashboard Statistics**: Displays product inventory metrics (total products, stock levels, categories), financial data (total stock value, revenue, average/highest prices), and business performance indicators.

- **Analytics**: Overview of key metrics including sales, user activity, and order statistics.

#### Category Management
- **Add Category**: Create new product categories with name, description, and thumbnail image
- **Edit Category**: Modify category details including SEO metadata and display order
- **Delete Category**: Remove categories with confirmation and optional product reassignment
- **Search Filtering**: View and modify subcategories by searching 
- **Category Hierarchy**: Automatic interface for organizing parent/child relationships of sub-category while creating a product 

#### Subcategory Management
- **Add Subcategory**: Create nested subcategories with parent category association
- **Edit Subcategory**: Update subcategory attributes and visibility settings
- **Delete Subcategory**: Remove subcategories with cascade or orphan product handling
- **Search Filtering**: View and modify subcategories by searching 

#### Product Management
- **Add Products**: Add new products with comprehensive details including images, descriptions, and pricing.
- **Update Products**: Edit existing product information, update stock levels, and manage product attributes.
- **Delete Products**: Remove products from the catalog as needed.

#### Order Management
- **View Orders**: Detailed view of orders, including items, quantities, total amounts, and order status.
- **Update Order Status**: Manage and update the status of orders to reflect their current state.

 