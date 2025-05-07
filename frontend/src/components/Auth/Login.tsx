const Login = () => {
  return (
    <section className="pt-[200px]">
      <div className="container">
        <div className="max-w-[350px] w-full flex flex-col items-center mx-auto">
          <h2 className="text-center text-4xl text-[#e8e8e6] font-medium mb-6">
            Log in
          </h2>

          <div className="w-full bg-[#e8e8e6] flex flex-row gap-[5px] justify-center items-center py-4 px-5 cursor-pointer rounded-lg mb-3">
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
          </div>

          <input
            type="text"
            placeholder="Enter your email"
            className="w-full bg-[#151616] rounded-lg outline-none border-none py-3 px-4 text-base text-gray-400 font-normal mb-3"
          />

          <input
            type="text"
            placeholder="Password"
            className="w-full bg-[#151616] rounded-lg outline-none border-none py-3 px-4 text-base text-gray-400 font-normal mb-3"
          />

          <button className="w-full bg-[#3D3D3B] py-3 px-4 rounded-lg cursor-pointer">
            <a href="#" className="text-base text-[#8d9191] font-medium">
              submit
            </a>
          </button>

          <p className="text-base text-[#ffffffd4] font-medium mt-4">
            Don't have an account?{" "}
            <a href="signUp" className="text-base text-[#ffffffd4] font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
