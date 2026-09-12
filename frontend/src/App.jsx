import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Book from './pages/Book';
import Author from './pages/Author';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Reader from './pages/Reader';

function AppContent() {
  const location = useLocation();
  const isReaderPage = location.pathname === '/reader';

  return (
    <div className={`app-wrapper ${isReaderPage ? 'in-reader-view' : ''}`} dir="rtl">
      {!isReaderPage && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Book />} />
          <Route path="/author" element={<Author />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="*" element={<Book />} />
        </Routes>
      </main>
      {!isReaderPage && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
