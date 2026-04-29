import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
