import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });

        // Basic validation
        switch (name) {
            case "name":
                setErrors({ ...errors, name: value ? "" : "Name is required" });
                break;
            case "email":
                setErrors({
                    ...errors,
                    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email",
                });
                break;
            case "mobile":
                setErrors({
                    ...errors,
                    mobile: /^\d{10}$/.test(value) ? "" : "Enter 10-digit number",
                });
                break;
        }
    };

    const isFormValid = () => {
        return (
            formData.name &&
            formData.email &&
            formData.mobile &&
            !errors.name &&
            !errors.email &&
            !errors.mobile
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid()) {
            alert("Registration Successful ✅");
            // Submit logic here
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-center mb-6">
                    <div className="text-2xl tracking-widest font-lato py-2">
                        <Link to="/" className="">
                            TMAR
                        </Link>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    TMAR Registration
                </h2>
                <p className="text-center text-lg text-gray-500 mb-6">
                    Please register with us to get our promotional offers
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="tel"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 text-white rounded ${isFormValid() ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-300 cursor-not-allowed"
                            }`}
                        disabled={!isFormValid()}
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">Privacy Policy</p>
            </div>
        </div>
    );
};

export default Register;