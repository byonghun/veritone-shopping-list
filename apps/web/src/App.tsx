import { useMemo } from "react";
import { useLocation } from "react-router";

import Header from "./components/Header";
import AppRoutes from "./routes";
import { cn } from "./utils";
import Footer from "./components/Footer";

export default function App() {
  const location = useLocation();
  const isHome = useMemo(() => location.pathname === "/", [location.pathname]);

  return (
    <div id="app-shell">
      <div className="h-[100vh]">
        <Header />
        <main className={cn("p-4", isHome && "p-0")}>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}
