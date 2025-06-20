import { Link } from "react-router-dom";
import { googleAuth } from "../actions/auth.actions";
import Google from "../assets/icons/Google";
import RegisterForm from "../components/Auth/RegisterForm";

const Register = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="container">
        <div className="max-w-[350px] w-full flex flex-col items-center mx-auto">
          <h2 className="text-center text-4xl font-medium mb-6">Register</h2>
          {/* Google Register */}
          <button
            onClick={googleAuth}
            className="w-full flex flex-row gap-[5px] justify-center items-center py-4 px-5 rounded-lg mb-3 transition-colors bg-[var(--color-google-bg)] text-[var(--color-text)] hover:bg-[var(--color-google-hover)] cursor-pointer"
          >
            <Google className="w-[22px] h-6" />
            <span className="text-base font-medium">Continue with Google</span>
          </button>
          <RegisterForm />
          <p className="text-base font-medium mt-4">
            Already a user?{" "}
            <Link to="/login" className="underline text-[var(--color-primary)]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
