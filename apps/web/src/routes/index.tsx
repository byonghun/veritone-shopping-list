import { Routes, Route, Navigate } from "react-router"; // <-- v7

import HomePage from "../pages/Home";
import ItemsPage from "../pages/Items";
import NotFoundPage from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes