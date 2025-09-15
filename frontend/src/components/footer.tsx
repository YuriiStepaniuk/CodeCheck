'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <span className="text-sm">
          &copy; 2025 Code Helper. All rights reserved.
        </span>

        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-blue-500 transition-colors text-sm">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors text-sm">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
