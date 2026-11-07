import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
