# 📇 ContactNexus UI

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Latest-646cff?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764abc?style=for-the-badge&logo=redux" alt="Redux Toolkit" />
</div>

<br />

<div align="center">
  <h3>🚀 A Modern Contact Management Application</h3>
  <p>Built with React, featuring an elegant dark theme and comprehensive contact management capabilities</p>
</div>

---

## ✨ Features

### 🎨 **Modern UI/UX Design**
- **Elegant Dark Theme** with cyan-blue gradient accents
- **Glassmorphism Effects** with backdrop blur and transparency
- **Responsive Design** optimized for all screen sizes
- **Smooth Animations** and interactive hover effects
- **Professional Typography** using Orbitron font for brand headings

### 🔐 **Authentication System**
- **Secure Sign In/Sign Up** with comprehensive form validation
- **Complete User Registration** with profile customization
- **Image Upload** with real-time preview functionality
- **Password Security** with confirmation and strength validation
- **Terms & Conditions** integration

### 👥 **Contact Management**
- **Advanced Contact Cards** with detailed profile information
- **Search & Filter** functionality for easy contact discovery
- **CRUD Operations** (Create, Read, Update, Delete contacts)
- **Profile Image Management** with upload and preview
- **Pagination** for efficient large contact list handling

### 🌐 **Social & Professional Integration**
- **Social Media Links** (GitHub, LinkedIn, Instagram)
- **Professional Profiles** with work and bio information
- **Complete Address Management** with location details
- **Interest & Hobby Tracking** for better networking
- **Bio Sections** with heading and description

## 🚀 Quick Start

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sachin-gupta99/ContactNexus-UI.git
   cd ContactNexus-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

### Available Scripts

```bash
npm start      # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
npm run preview # Preview production build
```

## 🛠️ Tech Stack

### **Core Technologies**
- **React 18.2.0** - Modern UI library with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation
- **Redux Toolkit** - State management with modern Redux patterns

### **UI & Styling**
- **Tailwind CSS** - Utility-first CSS framework
- **Flowbite React** - Modern component library
- **PostCSS** - CSS processing with autoprefixer
- **Google Fonts (Orbitron)** - Custom typography

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **React Icons** - Comprehensive icon library
- **Axios** - HTTP client for API requests
- **JWT Decode** - JSON Web Token handling

## 📁 Project Structure

```
ContactNexus-UI/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/               # API integration layer
│   │   ├── authApi.js     # Authentication endpoints
│   │   ├── contactApi.js  # Contact management endpoints
│   │   ├── userApi.js     # User profile endpoints
│   │   └── axiosInstance.js
│   ├── assets/            # Static assets
│   │   ├── images/        # Application images
│   │   └── logos/         # Brand assets
│   ├── components/        # Reusable UI components
│   │   ├── ContactCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── SignInForm.jsx
│   │   ├── SimpleSignUpForm.jsx
│   │   ├── ImagePicker.jsx
│   │   └── ...
│   ├── layouts/           # Layout components
│   │   └── RootLayout.jsx
│   ├── pages/             # Page components
│   │   ├── Auth.jsx
│   │   ├── Home.jsx
│   │   ├── Contacts.jsx
│   │   └── Profile.jsx
│   ├── store/             # Redux store
│   │   ├── index.js
│   │   ├── contact.js
│   │   ├── user.js
│   │   └── toast.js
│   ├── util/              # Utility functions
│   │   └── helper.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Cyan (#06b6d4) to Blue (#2563eb) gradients
- **Background**: Slate variants (#0f172a, #1e293b, #334155)
- **Text**: Zinc and slate variants for optimal contrast
- **Accents**: Purple highlights for special elements

### **Typography**
- **Headings**: Orbitron font family for modern, futuristic look
- **Body**: Default system fonts for optimal readability
- **Sizes**: Responsive typography scale

### **Components**
- **Glass morphism**: Backdrop blur effects with transparency
- **Rounded corners**: Consistent border radius scale
- **Shadows**: Layered shadow system for depth
- **Hover states**: Smooth transitions and interactions

## 🔧 Configuration

### **Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=your_api_base_url
VITE_APP_NAME=ContactNexus
```

### **Tailwind Configuration**
The project uses a custom Tailwind configuration with:
- Custom font families (Orbitron)
- Extended color palette
- Custom spacing and sizing
- Responsive breakpoints

## 📱 Responsive Design

ContactNexus UI is fully responsive and optimized for:
- **Desktop** (1024px+) - Full feature layout with centered navigation
- **Tablet** (768px - 1023px) - Adapted grid layouts
- **Mobile** (320px - 767px) - Stacked layouts with hamburger menu

## 🚀 Production Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, optimized and ready for deployment.

## 🤝 Contributing

We welcome contributions to ContactNexus UI! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style and structure
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation when necessary

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sachin Gupta**
- GitHub: [@sachin-gupta99](https://github.com/sachin-gupta99)
- Project: [ContactNexus-UI](https://github.com/sachin-gupta99/ContactNexus-UI)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Flowbite** for beautiful React components
- **Vite** for the lightning-fast development experience

---

<div align="center">
  <p>Made with ❤️ for modern contact management</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
