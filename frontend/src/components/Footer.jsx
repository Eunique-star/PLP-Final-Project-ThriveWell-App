import React from "react";

function Footer() {
    return (

        <footer className="bg-white dark:bg-[#023327] text-green-700 dark:text-gray-500 py-6 px-4 space-y-4 flex flex-col justify-between items-center">
            <section className="flex justify-between space-x-15">
                <a href="#health_topics" className="hover:underline">Health Topics</a>
                <a href="#ai" className="hover:underline">Ask AI</a>
                <a href="#about" className="hover:underline">About Us</a>
            </section>
                <p>Follow us on Facebook: <a className="hover:underline" href="https://www.facebook.com/thrivewell" target="_blank" rel="noopener noreferrer">ThriveWell</a></p>
                <p>Follow us on Twitter: <a className="hover:underline" href="https://twitter.com/thrivewell" target="_blank" rel="noopener noreferrer">ThriveWell</a></p>
            <section>
                
            </section>
            <section>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  &copy; {new Date().getFullYear()} ThriveWell - Eunice Ohilebo. All rights reserved.
                </p>
            </section>
        </footer>
        );
}

export default Footer;