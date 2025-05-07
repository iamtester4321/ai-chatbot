import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginUser } from "../../actions/auth.actions";
import Google from "../../assets/icons/Google";
import useToast from "../../hooks/useToast";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    try {
      LoginSchema.parse({ email, password });
      setEmailError("");
      setPasswordError("");
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
      if (err instanceof z.ZodError) {
        const issues = err.flatten().fieldErrors;
        setEmailError(touched.email ? issues.email?.[0] || "" : "");
        setPasswordError(touched.password ? issues.password?.[0] || "" : "");
      }
    }
  }, [email, password, touched]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      LoginSchema.parse({ email, password });

      const { success, message } = await loginUser(email, password);

      if (!success) {
        showToast.error(message || "Login failed");
        return;
      }

      showToast.success("Login successful!");
      navigate("/");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = err.flatten().fieldErrors;
        setEmailError(issues.email?.[0] || "");
        setPasswordError(issues.password?.[0] || "");
        showToast.error("Please check your input fields");
      } else {
        showToast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handelGoogole = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container">
        <div className="max-w-[350px] w-full flex flex-col items-center mx-auto">
          <h2 className="text-center text-4xl text-[#e8e8e6] font-medium mb-6">
            Log in
          </h2>

          <button
            onClick={handelGoogole}
            className="w-full bg-[#e8e8e6] flex flex-row gap-[5px] justify-center items-center py-4 px-5 cursor-pointer rounded-lg mb-3"
          >
            <Google className="w-[22px] h-6" />
            <a href="#" className="text-base text-[#13343b] font-medium">
              Continue with Google
            </a>
          </button>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <label htmlFor="email" className="text-sm text-[#e8e8e6] mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              className="w-full bg-[#151616] rounded-lg outline-none border-none py-3 px-4 text-base text-gray-400 font-normal mb-1"
            />
            {emailError && (
              <p className="text-red-500 text-sm mb-2">{emailError}</p>
            )}

            <label htmlFor="password" className="text-sm text-[#e8e8e6] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              className="w-full bg-[#151616] rounded-lg outline-none border-none py-3 px-4 text-base text-gray-400 font-normal mb-1"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-2">{passwordError}</p>
            )}

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-3 px-4 rounded-lg cursor-pointer mt-2 flex items-center justify-center ${
                isValid && !isLoading
                  ? "bg-white text-black"
                  : "bg-gray-500 text-gray-300"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Continuing...
                </>
              ) : (
                "Continue with email"
              )}
            </button>
          </form>

          <p className="text-base text-[#ffffffd4] font-medium mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline text-white">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
