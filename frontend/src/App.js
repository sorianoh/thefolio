// App.js
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import PostDetailPage from './pages/PostDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './styles/global.css';

function App() {
  return (
    <Routes>
      {/* Splash screen */}
      <Route path="/" element={<SplashScreen />} />
      
      {/* Public routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/posts" element={<PostPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />

      {/* Protected routes - need to be logged in */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/create-post" element={
        <ProtectedRoute>
          <CreatePostPage />
        </ProtectedRoute>
      } />
      <Route path="/edit-post/:id" element={
        <ProtectedRoute>
          <EditPostPage />
        </ProtectedRoute>
      } />

      {/* Admin only */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;