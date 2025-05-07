import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [apiError, setApiError] = useState("");

  // Validate inputs on every change
  useEffect(() => {
    let valid = true;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    // Password match validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      valid = false;
    } else {
      setPasswordError("");
    }

    // Ensure non-empty fields
    if (!email || !password || !confirmPassword) {
      valid = false;
    }

    setIsValid(valid);
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setApiError("");

      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const { data } = res;
      if (res.status !== 201) {
        throw new Error(data.message || "Registration failed");
      }
      console.log("Registration successful", data);
    } catch (err) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("An unknown error occurred");
      }
    }
  };

  const handelGoogole = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <section className="pt-[200px]">
      <div className="container">
        <div className="max-w-[350px] w-full flex flex-col items-center mx-auto">
          <h2 className="text-center text-4xl text-[#e8e8e6] font-medium mb-6">
            Register
          </h2>

          <button
            onClick={handelGoogole}
            className="w-full bg-[#e8e8e6] flex flex-row gap-[5px] justify-center items-center py-4 px-5 cursor-pointer rounded-lg mb-3"
          >
            {/* Google OAuth placeholder */}
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              className="w-[22px] h-6"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            <a href="#" className="text-base text-[#13343b] font-medium">
              Continue with Google
            </a>
          </button>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#151616] rounded-lg outline-none border-none py-3 px-4 text-base text-gray-400 font-normal mb-1"
            />
            {emailError && (
              <p className="text-red-500 text-sm mb-2">{emailError}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#151616] rounded-lg outline-none border-none py-3 px-4 text-base text-gray-400 font-normal mb-1"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#151616] rounded-lg outline-none border-none py-3 px-4 text-base text-gray-400 font-normal mb-1"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-2">{passwordError}</p>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 px-4 rounded-lg cursor-pointer mt-2 ${
                isValid ? "bg-white text-black" : "bg-gray-500 text-gray-300"
              }`}
            >
              Submit
            </button>
            {apiError && (
              <p className="text-red-500 text-sm mt-2">{apiError}</p>
            )}
          </form>

          <p className="text-base text-[#ffffffd4] font-medium mt-4">
            Already a user?{" "}
            <Link to="/login" className="underline text-white">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
