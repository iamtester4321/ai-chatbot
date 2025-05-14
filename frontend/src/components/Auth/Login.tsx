import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { googleAuth, loginUser } from "../../actions/auth.actions";
import Google from "../../assets/icons/Google";
import useToast from "../../hooks/useToast";
import { LoginSchema } from "../../validations/auth.schema";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    try {
      LoginSchema.parse(form);
      setErrors({ email: "", password: "" });
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
      if (err instanceof z.ZodError) {
        const issues = err.flatten().fieldErrors;
        setErrors({
          email: touched.email ? issues.email?.[0] || "" : "",
          password: touched.password ? issues.password?.[0] || "" : "",
        });
      }
    }
  }, [form, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      LoginSchema.parse(form);

      const { success, message } = await loginUser(form.email, form.password);
      if (!success) {
        showToast.error(message || "Login failed");
        return;
      }

      showToast.success("Login successful!");
      navigate("/");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issues = err.flatten().fieldErrors;
        setErrors({
          email: issues.email?.[0] || "",
          password: issues.password?.[0] || "",
        });
      } else {
        showToast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    googleAuth();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="container">
        <div className="max-w-[350px] w-full flex flex-col items-center mx-auto">
          <h2 className="text-center text-4xl font-medium mb-6">Log in</h2>

          <button
            onClick={handleGoogleAuth}
            className="w-full flex flex-row gap-[5px] justify-center items-center py-4 px-5 rounded-lg mb-3 transition-colors bg-[var(--color-google-bg)] text-[var(--color-text)] hover:bg-[var(--color-google-hover)]"
          >
            <Google className="w-[22px] h-6" />
            <span className="text-base font-medium">Continue with Google</span>
          </button>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            <label htmlFor="email" className="text-sm mb-1">Email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              className="w-full rounded-lg outline-none py-3 px-4 text-base font-normal mb-1 bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]"
            />
            {errors.email && (
              <p className="text-[var(--color-error)] text-sm mb-2">{errors.email}</p>
            )}

            <label htmlFor="password" className="text-sm mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              className="w-full rounded-lg outline-none py-3 px-4 text-base font-normal mb-1 bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]"
            />
            {errors.password && (
              <p className="text-[var(--color-error)] text-sm mb-2">{errors.password}</p>
            )}

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={`w-full py-3 px-4 rounded-lg mt-2 flex items-center justify-center transition-colors ${
                isValid && !isLoading
                  ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                  : "bg-[var(--color-disabled-bg)] text-[var(--color-disabled-text)] cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-base font-medium mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="underline text-[var(--color-primary)]">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
