import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-800">
      <div className="container mx-auto px-6 py-10 text-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">EventWave</h3>
            <p className="text-slate-400">
              Your community's central hub for creating, discovering, and managing local events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/#about" className="text-slate-400 hover:text-indigo-400">About Us</a></li>
              <li><a href="/#contact" className="text-slate-400 hover:text-indigo-400">Contact</a></li>
              
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <p className="text-slate-400">123 Event Lane, Cityville</p>
            <p className="text-slate-400">Email: contact@eventwave.com</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-700 text-center text-slate-500">
          © {new Date().getFullYear()} EventWave. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;