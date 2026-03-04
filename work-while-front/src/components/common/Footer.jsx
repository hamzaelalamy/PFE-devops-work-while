// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  // Color that complements the yellow background (#EDC418) of the CTA section
  const footerBgColor = "#2A2D3E"; // A deep blue-gray that complements yellow

  return (
    <footer
      className="text-gray-300 py-12 px-4"
      style={{ backgroundColor: footerBgColor }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-white mb-3">WorkWhile</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-yellow-200 transition">About</Link></li>
            <li><Link to="/mission" className="hover:text-yellow-200 transition">Our Mission</Link></li>
            <li><Link to="/careers" className="hover:text-yellow-200 transition">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-200 transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-3">For Job Seekers</h3>
          <ul className="space-y-2">
            <li><Link to="/jobs" className="hover:text-yellow-200 transition">Browse Jobs</Link></li>
            <li><Link to="/assessment" className="hover:text-yellow-200 transition">Career Assessment</Link></li>
            <li><Link to="/mentors" className="hover:text-yellow-200 transition">Find Mentors</Link></li>
            <li><Link to="/resources" className="hover:text-yellow-200 transition">Learning Resources</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-3">For Employers</h3>
          <ul className="space-y-2">
            <li><Link to="/post-job" className="hover:text-yellow-200 transition">Post a Job</Link></li>
            <li><Link to="/talent-solutions" className="hover:text-yellow-200 transition">Talent Solutions</Link></li>
            <li><Link to="/become-mentor" className="hover:text-yellow-200 transition">Become a Mentor</Link></li>
            <li><Link to="/partnerships" className="hover:text-yellow-200 transition">Partnerships</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-3">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="hover:text-yellow-200 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-yellow-200 transition">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-yellow-200 transition">Cookie Policy</Link></li>
            <li><Link to="/accessibility" className="hover:text-yellow-200 transition">Accessibility</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400">© 2025 WorkWhile. All rights reserved.</p>
      </div>
    </footer>
  );
}