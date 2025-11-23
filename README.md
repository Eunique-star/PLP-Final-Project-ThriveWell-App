# ThriveWell 🏥💚

![ThriveWell Banner](https://img.shields.io/badge/SDG%203-Good%20Health%20%26%20Well--being-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green)

**Live Demo:** [https://plp-final-project-thrive-well-app-f.vercel.app](https://plp-final-project-thrive-well-app-f.vercel.app)

ThriveWell is a comprehensive health information platform that aligns with **UN Sustainable Development Goal 3: Good Health and Well-being**. The platform provides users with quality health information, AI-powered health assistance, and professional medical consultations - all in one place.

---

## 🌟 Features

### For All Users

- **📚 Health Articles Library**: Browse comprehensive health information across multiple categories
  - Nutrition
  - Mental Health
  - First Aid
  - Child Care
  - Maternal Care
  - Fitness
  - And more...
- **🤖 AI Health Assistant**: Get instant answers to health questions (Coming Soon)
- **👨‍⚕️ Book Professionals**: Schedule consultations with verified healthcare professionals
- **🌓 Dark/Light Mode**: Comfortable reading in any lighting condition
- **📱 Responsive Design**: Seamless experience across all devices
- **🔐 Secure Authentication**: Powered by Clerk for safe and easy sign-in

### For Writers

- **✍️ Create Articles**: Write and publish health articles
- **📝 Article Management**: Edit and delete your own articles
- **📊 Dashboard**: Manage all your content in one place

### For Medical Professionals

- **🗓️ Availability Management**: Set your weekly consultation schedule
- **👥 Appointment Management**: View and manage patient bookings
- **📋 Professional Dashboard**: Track your consultations and availability

### For Admins

- **✅ Application Review**: Approve or reject writer/medical professional applications
- **📂 Category Management**: Create and manage health categories
- **👥 User Management**: Oversee platform users and roles

---

## 🚀 Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Clerk** - Authentication
- **Axios** - HTTP requests
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Clerk** - Authentication & user management
- **Svix** - Webhook verification

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Eunique-star/PLP-Final-Project-ThriveWell-App

# Navigate to project directory
cd PLP_FINAL_PROJECT
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure your `.env` file:**

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Server
PORT=5000
NODE_ENV=development

# CORS
ALLOWED_ORIGIN=http://localhost:5173
```

**Start the backend server:**

```bash
npm start
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

**Configure your `.env.local` file:**

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

**Start the frontend development server:**

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your **Publishable Key** and add it to frontend `.env.local`
4. Copy your **Secret Key** (if needed for backend)
5. Set up the webhook:
   - Go to **Webhooks** in Clerk dashboard
   - Add endpoint: `http://localhost:5000/api/webhooks/clerk` (use ngrok for local development)
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy **Signing Secret** and add to backend `.env`

### 5. Seed the Database (Optional)

Add some initial categories to your MongoDB database:

```javascript
// Using MongoDB Compass or MongoDB Shell
db.categories.insertMany([
  {
    name: "Mental Health",
    description: "Articles and resources for mental well-being.",
    slug: "mental-health",
  },
  {
    name: "Nutrition",
    description:
      "Healthy eating tips, diet plans, and nutritional information.",
    slug: "nutrition",
  },
  {
    name: "First Aid",
    description: "Emergency care procedures and basic first aid techniques.",
    slug: "first-aid",
  },
  // Add more categories as needed
]);
```

---

## 🌐 Deployment

### Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New +** → **Web Service**
4. Connect your repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all from `.env`
6. Click **Create Web Service**

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click **New Project**
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if applicable)
   - **Environment Variables**: Add all from `.env.local`
6. Click **Deploy**

---

## 📁 Project Structure

```
thrivewell/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Article.js
│   │   ├── Application.js
│   │   ├── Booking.js
│   │   └── Availability.js
│   ├── routes/
│   │   ├── webhooks.js
│   │   ├── categories.js
│   │   ├── articles.js
│   │   ├── applications.js
│   │   ├── bookings.js
│   │   └── availability.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roleCheck.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Footer.jsx
    │   │   └── ui/
    │   │       └── ThemeToggle.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Categories.jsx
    │   │   ├── CategoryTopics.jsx
    │   │   ├── ArticleView.jsx
    │   │   ├── SignIn.jsx
    │   │   ├── SignUp.jsx
    │   │   └── ApplyRole.jsx
    │   ├── contexts/
    │   │   └── ThemeContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🔐 User Roles & Permissions

### User (Default)

- Browse health categories and articles
- Use AI health assistant
- Book appointments with professionals
- Apply to become Writer or Medical Professional

### Writer

- All User permissions
- Create, edit, and delete own articles
- Access Writer Dashboard

### Medical Professional

- All User permissions
- Set weekly availability
- View and manage appointment bookings
- Access Professional Dashboard

### Admin

- All permissions
- Approve/reject applications
- Create categories
- Manage all users and content

---

## 🔌 API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `GET /api/categories/:slug/articles` - Get articles in category
- `POST /api/categories` - Create category (Admin only)

### Articles

- `GET /api/articles` - Get all published articles
- `GET /api/articles/:slug` - Get single article
- `POST /api/articles` - Create article (Writer/Admin)
- `GET /api/articles/my-articles` - Get user's articles (Writer/Admin)
- `PUT /api/articles/:id` - Update article (Author only)
- `DELETE /api/articles/:id` - Delete article (Author only)

### Applications

- `POST /api/applications` - Submit application (User)
- `GET /api/applications/my-status` - Check application status
- `GET /api/applications` - Get all applications (Admin)
- `PUT /api/applications/:id/approve` - Approve application (Admin)
- `PUT /api/applications/:id/reject` - Reject application (Admin)

### Availability (Medical Professionals)

- `POST /api/availability` - Set availability slot
- `GET /api/availability/my-availability` - Get own availability
- `DELETE /api/availability/:id` - Delete availability slot
- `GET /api/availability/medical/:clerkId` - Get professional's availability

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/my-schedule` - Get professional's schedule
- `GET /api/bookings/medical/:clerkId` - Get professional's bookings

---

## 🎨 Design Features

- **Color Scheme**:
  - Primary: Teal/Turquoise (#14b8a6)
  - Secondary: Blue (#3b82f6)
  - Accent: Orange (#f97316)
- **Typography**: System font stack for optimal performance
- **Animations**: Smooth transitions powered by Framer Motion
- **Accessibility**: WCAG 2.1 compliant with proper contrast ratios

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@Eunique-star](https://github.com/Eunique-star)
- Email: euniceohilebo05@gmail.com
- LinkedIn: [Eunice Ohilebo](https://www.linkedin.com/in/eunice-ohilebo-005a98313)

---

## 🙏 Acknowledgments

- **UN SDG 3** - Good Health and Well-being initiative
- **Clerk** - For authentication infrastructure
- **MongoDB** - For database services
- **Render & Vercel** - For hosting services
- All contributors and supporters of this project

---

## 📸 Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Categories Page

![Categories](screenshots/categories.png)

### Article View

![Article View](screenshots/article.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

---

## 🔮 Future Enhancements

- [ ] AI Health Assistant integration
- [ ] Real-time chat with medical professionals
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] User health tracking dashboard
- [ ] Integration with wearable devices
- [ ] Telemedicine video consultations
- [ ] Health insurance integration

---

## 📞 Support

For support, email support@thrivewell.com or join our Slack channel.

---

## ⚠️ Disclaimer

ThriveWell provides health information for educational purposes only. This information is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

**Made with ❤️ for SDG 3: Good Health & Well-being**
