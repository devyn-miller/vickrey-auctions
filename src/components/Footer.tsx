import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {currentYear} Vickrey Auction Helper. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/devyn-miller"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/devyn-c-miller/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-400">
          Thank you for your support! Your feedback helps us improve.
        </div>
      </div>
    </footer>
  );
}