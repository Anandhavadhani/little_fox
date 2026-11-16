import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
