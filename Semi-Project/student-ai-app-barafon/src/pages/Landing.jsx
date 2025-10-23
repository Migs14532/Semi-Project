import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-black text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold tracking-wide">
              Miguel Paolo Barafon
            </div>
            <div className="flex gap-8">
              <Link
                to="/"
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Home
              </Link>
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
        <div className="absolute top-1/2 right-0 w-24 h-24 bg-gray-300 opacity-10 rounded-full translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="relative inline-block mb-8">
            <div className="w-48 h-48 rounded-full mx-auto shadow-2xl border-4 border-black bg-gradient-to-br from-gray-200 to-white flex items-center justify-center">
              <div className="text-6xl font-bold text-black">MPB</div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-gray-300 opacity-30 animate-pulse"></div>
          </div>
          
          <h1 className="text-5xl font-bold text-black mb-2 tracking-tight">
            Miguel Paolo Barafon
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-600 mb-8 tracking-wide">
            BS Information Technology Student
          </h2>

          <p className="text-gray-700 leading-relaxed mb-10 max-w-2xl mx-auto text-lg">
            IT PA MORE!!!
          </p>
          </div>
        </div>
      </div>
      
      <p className="text-center mt-8 text-gray-500 text-sm pb-8">© 2025 Miguel Paolo Barafon. All rights reserved.</p>
    </div>
  );
}