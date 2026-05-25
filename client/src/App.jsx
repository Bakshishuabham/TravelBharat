import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import HomePage       from './pages/HomePage';
import StatesPage     from './pages/StatesPage';
import StatePage      from './pages/StatePage';
import PlacesPage     from './pages/PlacesPage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import AboutPage      from './pages/AboutPage';

// Admin pages
import AdminLoginPage   from './pages/admin/AdminLoginPage';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminPlaces      from './pages/admin/AdminPlaces';
import AdminStates      from './pages/admin/AdminStates';
import AdminCities      from './pages/admin/AdminCities';
import AdminCategories  from './pages/admin/AdminCategories';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#12263A', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
            success: { iconTheme: { primary: '#FF6B35', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/states" element={<PublicLayout><StatesPage /></PublicLayout>} />
          <Route path="/states/:id" element={<PublicLayout><StatePage /></PublicLayout>} />
          <Route path="/places" element={<PublicLayout><PlacesPage /></PublicLayout>} />
          <Route path="/places/:id" element={<PublicLayout><PlaceDetailPage /></PublicLayout>} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin protected */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/places" element={
            <ProtectedRoute adminOnly><AdminPlaces /></ProtectedRoute>
          } />
          <Route path="/admin/states" element={
            <ProtectedRoute adminOnly><AdminStates /></ProtectedRoute>
          } />
          <Route path="/admin/cities" element={
            <ProtectedRoute adminOnly><AdminCities /></ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <PublicLayout>
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <p className="text-8xl mb-6">🗺️</p>
                <h1 className="text-5xl font-poppins font-bold text-white mb-3">404</h1>
                <p className="text-white/50 text-xl mb-8">This destination doesn't exist</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
