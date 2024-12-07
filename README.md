# **Wanderlust** - A Modern MERN-Powered Travel Stay Marketplace

**Wanderlust** is an e-commerce website built with the complete MERN stack (MongoDB, Express, React, Node.js). It functions as a platform similar to Airbnb, allowing users to list properties, browse, and interact with listings. The website has several features aimed at improving the user experience and data security.

### **Live Link**

[Wanderlust - Live on Render](https://wanderlust-jlx2.onrender.com/)

### **Features Implemented:**

- **User Authentication & Authorization:** Ensures only authorized users can create and edit listings, with complete restrictions on accessing other users' data.
- **Image Upload & URL Generation:** Implemented image upload functionality with URL generation using Cloudinary.
- **Map Integration:** Each listing has a map showing its location using the Mapbox platform.
- **Responsive Design:** The website is fully responsive and adapts to different screen sizes.
- **MVC Architecture:** The project is structured using the Model-View-Controller (MVC) design pattern for better maintainability and scalability.
- **User Profile Section:** Integrated a user profile view and edit section to allow users to update their information.
- **Search & Filters:** The homepage includes a search box and filters to find listings more easily.
- **Error Handling:** Implemented global error handling to handle issues smoothly across the website.

### **Technologies Used:**

- **Frontend:**
  - HTML, CSS, JavaScript, React.js, BootStrap
  - NPM Packages: Axios, React Router DOM, EJS
- **Backend:**
  - Node.js, Express.js, MongoDB, Mongoose
  - NPM Packages: bcryptjs, express-session, passport.js
- **Cloud Services:**
  - Image Upload: Cloudinary
  - Map Integration: Mapbox
- **Others:**
  - Git, GitHub for version control
  - Deployed on Render for hosting

### **Future Improvements:**

1. Enhance the features on the User Page (such as reviews, ratings, etc.).
2. Improve the responsiveness of the website across more device sizes.
3. Implement a payment gateway for seamless transactions.
4. Add real-time chat functionality for users to communicate with property owners.

### **Installation and Setup:**

To run this project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YashPandey1405/wanderlust.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd wanderlust
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file for environment variables:**

   - Add the necessary variables (e.g., database URI, Cloudinary credentials, etc.).

5. **Run the project:**
   ```bash
   npm start
   ```

### **Contributing:**

Feel free to fork the repository, create a branch, and submit a pull request with any improvements, fixes, or features you’d like to contribute to this project.

### **License:**

MIT License.
