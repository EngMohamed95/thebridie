// Deploy test: 2026-06-16
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar  from './components/Navbar';
import Footer  from './components/Footer';
import Home     from './pages/Home';
import Dashboard    from './pages/Dashboard';
import Login        from './pages/Login';
import MyAccount   from './pages/MyAccount';
import Register    from './pages/Register';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { auth } = useApp();
  return auth ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">
      {!isLogin && <Navbar />}
      <main>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-account"    element={<MyAccount />} />
          <Route path="/register"      element={<Register />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLogin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AppProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </AppProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
