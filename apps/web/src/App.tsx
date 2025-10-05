import Header from "./components/Header";
import AppRoutes from "./routes";

export default function App() {
  return (
    <div id="app-shell">
      <Header />
      <main className="p-4">
        <AppRoutes />
      </main>
    </div>
  );
}
