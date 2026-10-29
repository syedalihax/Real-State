
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { Spinner } from "./components/Skeleton.jsx";

// Code-split: every page loads on demand (better Core Web Vitals)
const Home = lazy(() => import("./pages/Home.jsx"));
const Listings = lazy(() => import("./pages/Listings.jsx"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Favourites = lazy(() => import("./pages/Favourites.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties.jsx"));
const PropertyForm = lazy(() => import("./pages/admin/PropertyForm.jsx"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries.jsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.jsx"));

export default function App() {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/new" element={<PropertyForm />} />
              <Route path="properties/edit/:id" element={<PropertyForm />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
    </>
  );
}
