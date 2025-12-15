import { useState } from "react";

const Footer = () => {
    const [toggleMap, setToggleMap] = useState(false);
    return (
        <footer className="bg-black text-white px-4 sm:px-6 lg:px-24 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-20">
                {/* Column 1 */}
                <div>
                    <h5 className="font-semibold mb-3">Company</h5>
                    <ul className="space-y-1 text-base">
                        <li><a href="#" className="hover:underline">Terms of Service</a></li>
                        <li><a href="#" className="hover:underline">Refund Policy</a></li>
                    </ul>
                </div>

                {/* Column 2 */}
                <div>
                    <h5 className="font-semibold mb-3">Support</h5>
                    <ul className="space-y-1 text-base">
                        <li><a href="#" className="hover:underline">Shipping</a></li>
                        <li><a href="#" className="hover:underline">Return Policy</a></li>
                        <li><a href="#" className="hover:underline">Buy Back</a></li>
                        <li><a href="#" className="hover:underline">Size Guide</a></li>
                        <li><a href="#" className="hover:underline">Shoe Care</a></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div>
                    <h5 className="font-semibold mb-3">Resources</h5>
                    <ul className="space-y-1 text-base">
                        <li><a href="#" className="hover:underline">Blog</a></li>
                        <li><a href="#" className="hover:underline">About Us</a></li>
                        <li><a href="#" className="hover:underline">Our Factory</a></li>
                        <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Column 4 - Newsletter */}
                <div>
                    <h5 className="font-semibold mb-3">Sign Up and Get Newsletter</h5>
                    {/* <p className="text-base mb-3">Sign up to our newsletter and get instant $25 coupon for your first order.</p> */}
                    <form className="flex flex-col sm:flex-row items-center gap-2 border border-white px-3 py-2 rounded">
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-transparent text-white placeholder-white text-base outline-none flex-1 w-full"
                        />
                        <button type="submit" className="text-white text-lg">→</button>
                    </form>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-base mb-10">
                {/* Contact Info */}
                <div>
                    <h6 className="font-semibold mb-2">Need Help?</h6>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:underline">+91 4172 272470, 272835</a></li>
                        {/* <li>M-F 9:30 AM - 6 PM (EST)</li> */}
                        <li><a href="mailto:info@tmargroup.in" className="hover:underline">info@tmargroup.in</a></li>
                    </ul>
                    <div className="flex space-x-4 mt-2">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                    </div>
                    <div>
                        <div onClick={() => {
                            setToggleMap(prev => prev == true ? false : true);
                        }} className="bg-white text-black px-2 py-1 rounded w-fit cursor-pointer hover:bg-[#d3d3d3]">
                            {toggleMap ? `Hide Map` : `Show Map`}
                        </div>
                    </div>
                </div>

                {/* Language & Currency */}
                {/* <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                        <p className="font-semibold mb-1">Language:</p>
                        <select className="bg-black border text-white text-base p-1 w-full">
                            <option>English</option>
                        </select>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">Currency:</p>
                        <select className="bg-black border text-white text-base p-1 w-full">
                            <option>United States (USD $)</option>
                        </select>
                    </div>
                </div> */}

                {/* Copyright */}
                <div className="md:text-right">
                    <p>© 2025 TMAR, All rights reserved. <a href="#" className="underline">Powered by Alphabit Technologies IND</a></p>
                </div>
            </div>

            {/* Payment Methods */}
            {/* <div className="flex flex-wrap justify-start md:justify-end gap-2 mt-10">
                {[
                    'AmEx', 'Apple Pay', 'Diners Club', 'Discover', 'GPay',
                    'Mastercard', 'PayPal', 'Shop Pay', 'Venmo', 'Visa',
                ].map((method, i) => (
                    <div key={i} className="bg-white text-black px-2 py-1 rounded text-sm">
                        {method}
                    </div>
                ))}
            </div> */}

            {
                toggleMap &&
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1116.030358661441!2d80.26735770461447!3d13.083750832207635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265fa55555555%3A0x2c62b614e512955e!2sT%20M%20Abdul%20Rahman%20%26%20Sons!5e0!3m2!1sen!2sin!4v1744978985461!5m2!1sen!2sin" width="900" height="450" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

            }   

        </footer>
    );
};

export default Footer;
