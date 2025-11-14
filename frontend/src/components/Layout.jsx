import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-white dark:bg-[#054233] text-black dark:text-gray-100">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;