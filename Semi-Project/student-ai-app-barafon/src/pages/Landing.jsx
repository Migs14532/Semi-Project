import { Link } from "react-router-dom";
import profilePic from '../assets/profile.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-black text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold tracking-wide">
              Student Grade Management System
            </div>
            <div className="flex gap-8">
              <Link
                to="/students"
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                Students
              </Link>
              <Link
                to="/subjects"
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                Subjects
              </Link>
              <Link
                to="/grades"
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                Grades
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-8">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-3xl w-full text-center border-2 border-black relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-black opacity-5 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-black opacity-5 rounded-full translate-x-20 translate-y-20"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-black opacity-5 rounded-full translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="relative inline-block mb-8">
              <img
                src={profilePic}
                alt="Miguel Paolo Barafon"
                className="w-48 h-48 rounded-full mx-auto shadow-2xl border-4 border-black object-cover"
              />
              <div className="absolute inset-0 rounded-full border-4 border-black opacity-20 animate-pulse"></div>
            </div>
            
            <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
              Miguel Paolo Barafon
            </h1>
            <div className="w-24 h-1 bg-black mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700 mb-8 tracking-wide">
              BS Information Technology Student
            </h2>

            <p className="text-gray-800 leading-relaxed mb-6 max-w-2xl mx-auto text-lg"> 
              My IT journey was hard because I didn't have any background in coding before college but I really wanted to learn and explore about it because it is my passion and, actually this is my dream course as well.
            </p>
            <p className="text-black leading-relaxed mb-10 max-w-2xl mx-auto text-2xl font-bold">
              IT NGANI!
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-center py-6 text-gray-600 text-sm">© 2025 Miguel Paolo Barafon. All rights reserved.</p>
    </div>
  );
}