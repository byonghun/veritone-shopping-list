import AppRoutes from "./routes";
import Header from "./components/Header";

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
