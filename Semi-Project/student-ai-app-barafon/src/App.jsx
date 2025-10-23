import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Grades from "./pages/Grades";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/students" element={<Students />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/grades" element={<Grades />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
