const MobileLogo = ({ width = 100, height = 24, className = "", ...props }) => (
    <svg
      viewBox="0 0 400 91"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={`transition-all duration-300 ${className}`}
      {...props}
    >
      <path
        d="M196.978 27.8931H200.033V34.1872H196.079C192.979 34.1872 190.669 34.9333 189.14 36.4254C187.615 37.9176 186.85 40.3662 186.85 43.7711V64.401H180.606V28.0333H186.85V33.8367C186.85 34.1622 187.014 34.3274 187.337 34.3274C187.52 34.3274 187.659 34.2823 187.754 34.1872C187.848 34.0921 187.938 33.9068 188.032 33.6264C189.234 29.8058 192.219 27.8931 196.983 27.8931H196.978Z"
        className="fill-textMain dark:fill-textMainDark"
      />
      {/* ... the rest of your <path> elements exactly as in your original SVG ... */}
      {/* For brevity, I’ve omitted the remaining paths, but you'd copy them all here */}
    </svg>
  );
  
  export default  MobileLogo;
  