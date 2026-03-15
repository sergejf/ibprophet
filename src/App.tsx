import { Outlet } from "react-router";
import "./App.css";
import { Header } from "./shared/components/Header";
import { Footer } from "./shared/components/Footer";

export function App() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
}
