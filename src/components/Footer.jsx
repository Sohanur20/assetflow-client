import { FaBoxes, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="bg-teal-600 text-white p-2 rounded-lg"><FaBoxes /></span>
          <span className="font-extrabold text-white text-lg">AssetFlow <span className="text-teal-400 text-sm">by XYZ</span></span>
        </div>
        <p className="text-sm mt-4 leading-relaxed">
          AssetFlow helps companies keep a clear record of the laptops, tools and supplies
          their teams use every day — who has what, what is running low, and what needs to
          come back.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-teal-400">Home</Link></li>
          <li><Link to="/join-employee" className="hover:text-teal-400">Join as Employee</Link></li>
          <li><Link to="/join-hr" className="hover:text-teal-400">Join as HR Manager</Link></li>
          <li><Link to="/login" className="hover:text-teal-400">Login</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">XYZ Company</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-teal-400" /> XYZ Headquarters, Business District</li>
          <li className="flex items-center gap-2"><FaEnvelope className="text-teal-400" /> support@xyzcompany.com</li>
          <li className="flex items-center gap-2"><FaPhoneAlt className="text-teal-400" /> +1 (555) 010-2030</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} XYZ Company · AssetFlow Asset Management System. All rights reserved.
    </div>
  </footer>
);

export default Footer;
