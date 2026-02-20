import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Compare from './pages/Compare';

import HotelDetails from './pages/HotelDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Search />} />
                  <Route path="/hotel/:id" element={<HotelDetails />} />
                  <Route path="/compare" element={<Compare />} />
                </Route>
              </Routes>
            </main>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
