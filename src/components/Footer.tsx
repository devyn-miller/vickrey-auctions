import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a 
              href="https://devyn-miller.github.io/profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Devyn Miller
            </a>
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/devyn-miller"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/devyn-miller-b2b5a5204/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}