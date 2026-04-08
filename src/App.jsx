import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProductDetails from './pages/ProductDetails'
import UpdateProfile from './pages/updateProfile'
import UpdatePassword from './pages/updatePassword'
import AdminDashboard from './admin/AdminDashboard'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ManageCategories from './admin/ManageCategories'
import ApplyDoctor from './doctors/ApplyToBeADoctor'
import RegisterPatient from './patients/RegisterPatient'
import ViewAllDoctors from './doctors/ViewAllDoctors'
import ViewAllPatients from './admin/ViewAllPatients'
import ViewAllMedicines from './medicines/ViewAllMedicines'
import PatientProfile from './patients/PatientProfile'
import ViewAllUsers from './admin/ViewAllUsers'
import AdminPatientDetails from './admin/ViewPatientDetails'
import SpecificCategoryDocs from './doctors/SpecificCategoryDocs'
import DoctorDetails from './doctors/DoctorDetails'
import ScrollToTop from './utils/ScrollToTop'
import DoctorDashboard from './doctors/DoctorDashboard'
import UpdateDoctorProfile from './doctors/UpdateDoctorProfile'
import MyPatients from './doctors/MyPatients'
import ManagePatientFile from './doctors/ManagePatientFile'
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000} />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path='/update-profile' element={<UpdateProfile />} />
        <Route path='/update-password' element={<UpdatePassword />} />
        <Route path='/doctor/apply' element={<ApplyDoctor />} />
        <Route path='/patient/register' element={<RegisterPatient />} />
        <Route path='patient-profile' element={<PatientProfile />} />
        <Route path='/view-all-users' element={<ViewAllUsers />} />
        <Route path="/view-all-doctors" element={<ViewAllDoctors />} />
        <Route path="/doctors" element={<SpecificCategoryDocs />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path='/update-doctor' element={<UpdateDoctorProfile />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/my-patients" element={<MyPatients />} />
        <Route path="/doctor/manage-patient/:patientId" element={<ManagePatientFile />} />

        {/* admin routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="view-all-doctors" element={<ViewAllDoctors />} />
          <Route path="view-all-patients" element={<ViewAllPatients />} />
          <Route path="view-all-medicines" element={<ViewAllMedicines />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path='view-all-users' element={<ViewAllUsers />} />
          <Route path='patient-details/:id' element={<AdminPatientDetails />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App