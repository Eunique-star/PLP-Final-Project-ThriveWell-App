import React from "react";

function Navbar() {
    return (
        <nav className="bg-white dark:bg-[#023327] dark:text-white p-4  flex items-center justify-between shadow-green-200 dark:shadow-lg">
            <div className="pl-4">
                <h1 className="text-lg font-bold">ThriveWell</h1>
            </div>
            <div>
                <ul className="flex space-x-8 justify-center pr-4">
                    <li>
                        <a href="#" className="text-black-600 dark:text-white hover:underline">Home</a>
                    </li>
                     <li>
                        <a href="#" className="text-black-600 dark:text-white hover:underline">Health Topics</a>
                    </li>
                     <li>
                        <a href="#" className="text-black-600 dark:text-white hover:underline">Ask AI</a>
                    </li>
                    <li>
                        <a href="#" className="text-black-600 dark:text-white hover:underline">About</a>
                    </li>
                    <li>
                        <a href="#" className="text-black-600 dark:text-white hover:underline">Sign Up</a>
                    </li>
                     <li>
                        <a href="#" className="text-black-600 dark:text-white hover:underline">Log in</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;