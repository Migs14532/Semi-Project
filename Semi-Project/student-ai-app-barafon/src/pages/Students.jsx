import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from '../lib/supabase.js';
import toast from "react-hot-toast";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ 
    student_number: "",
    first_name: "", 
    last_name: "",
    course: "", 
    year_level: "" 
  });
  const [loading, setLoading] = useState(false);

  // Fetch students from Supabase on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('student_number', { ascending: true });
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error loading students: ' + error.message)
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (index = null) => {
    setEditingIndex(index);
    if (index !== null) {
      setFormData({
        student_number: students[index].student_number,
        first_name: students[index].first_name,
        last_name: students[index].last_name,
        course: students[index].course,
        year_level: students[index].year_level
      });
    } else {
      setFormData({ 
        student_number: "",
        first_name: "", 
        last_name: "",
        course: "", 
        year_level: "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingIndex !== null) {
        // Update existing student
        const { error } = await supabase
          .from('students')
          .update({
            student_number: formData.student_number,
            first_name: formData.first_name,
            last_name: formData.last_name,
            course: formData.course,
            year_level: parseInt(formData.year_level)
          })
          .eq('id', students[editingIndex].id);

        if (error) throw error;
        toast.success('Student updated successfully!');
      } else {
        // Add new student
        const { error } = await supabase
          .from('students')
          .insert([{
            student_number: formData.student_number,
            first_name: formData.first_name,
            last_name: formData.last_name,
            course: formData.course,
            year_level: parseInt(formData.year_level)
          }]);

        if (error) throw error;
        toast.success('Student added successfully!');
      }

      await fetchStudents(); // Refresh the list
      handleCloseModal();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Error saving student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', students[index].id);

      if (error) throw error;
      
      toast.success('Student deleted successfully!');
      await fetchStudents(); // Refresh the list
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Error deleting student: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black text-white p-8 rounded-t-3xl shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Student Management</h1>
              <p className="text-gray-300 text-sm">Manage and organize student records</p>
            </div>
            <Link
              to="/"
              className="text-white hover:text-gray-300 font-medium transition-colors px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-gray-200">
          <button
            onClick={() => handleOpenModal()}
            className="cursor-pointer mb-6 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 font-medium disabled:opacity-50"
            disabled={loading}
          >
            + Add New Student
          </button>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <p className="text-gray-500 text-lg">No students added yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add New Student" to get started</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-900 to-black text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Student Number</th>
                    <th className="p-4 text-left font-semibold">First Name</th>
                    <th className="p-4 text-left font-semibold">Last Name</th>
                    <th className="p-4 text-left font-semibold">Course</th>
                    <th className="p-4 text-left font-semibold">Year Level</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student, i) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{student.student_number}</td>
                      <td className="p-4 text-gray-700">{student.first_name}</td>
                      <td className="p-4 text-gray-700">{student.last_name}</td>
                      <td className="p-4 text-gray-700">{student.course}</td>
                      <td className="p-4 text-gray-700">{student.year_level}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(i)}
                            className="cursor-pointer px-4 py-2 bg-white text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 font-medium disabled:opacity-50"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(i)}
                            className="cursor-pointer px-4 py-2 bg-black text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-medium disabled:opacity-50"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all">
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="bg-black text-white p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold">
                  {editingIndex !== null ? "Edit Student" : "Add New Student"}
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {editingIndex !== null ? "Update student information" : "Enter student details below"}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-1 space-y-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Number</label>
                  <input
                    type="text"
                    name="student_number"
                    placeholder="e.g., 2023-01454"
                    value={formData.student_number}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="e.g., Miguel Paolo"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="e.g., Barafon"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <input
                    type="text"
                    name="course"
                    placeholder="e.g., BS Information Technology"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
                  <input
                    type="number"
                    name="year_level"
                    placeholder="e.g., 3"
                    value={formData.year_level}
                    onChange={handleChange}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-colors"
                    required
                    disabled={loading}
                    min="1"
                    max="5"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-white text-black border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg font-medium disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingIndex !== null ? "Update" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}