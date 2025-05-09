
const PlusIcon = ({ width = 20, height = 20, stroke = "white", ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:stroke-[#838383] transition duration-300"
      {...props}
    >
      <path d="M12 5l0 14" />
      <path d="M5 12l14 0" />
    </svg>
  );
  
  export default PlusIcon;
  