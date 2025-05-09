
const CustomLogo = ({ width = 32, height = 36, stroke = "white", ...props }) => (
    <svg
      viewBox="0 0 101 116"
      stroke={stroke}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      {...props}
    >
      <path
        className="stroke-textMain dark:stroke-textMainDark group-hover:stroke-superDuper transition-colors duration-300"
        d="M86.4325 6.53418L50.4634 36.9696H86.4325V6.53418Z"
        strokeWidth="5.53371"
        strokeMiterlimit="10"
      />
      <path
        d="M50.4625 36.9696L17.2603 6.53418V36.9696H50.4625Z"
        className="stroke-textMain dark:stroke-textMainDark group-hover:stroke-superDuper transition-colors duration-300"
        strokeWidth="5.53371"
        strokeMiterlimit="10"
      />
      <path
        d="M50.4634 1L50.4634 114.441"
        className="stroke-textMain dark:stroke-textMainDark group-hover:stroke-superDuper transition-colors duration-300"
        strokeWidth="5.53371"
        strokeMiterlimit="10"
      />
      <path
        d="M83.6656 70.172L50.4634 36.9697V79.3026L83.6656 108.908V70.172Z"
        className="stroke-textMain dark:stroke-textMainDark group-hover:stroke-superDuper transition-colors duration-300"
        strokeWidth="5.53371"
        strokeMiterlimit="10"
      />
      <path
        d="M17.2603 70.172L50.4625 36.9697V78.4497L17.2603 108.908V70.172Z"
        className="stroke-textMain dark:stroke-textMainDark group-hover:stroke-superDuper transition-colors duration-300"
        strokeWidth="5.53371"
        strokeMiterlimit="10"
      />
      <path
        d="M3.42627 36.9697V81.2394H17.2605V70.172L50.4628 36.9697H3.42627Z"
        className="stroke-textMain dark:stroke-textMainDark group-hover:stroke-superDuper transition-colors duration-300"
        strokeWidth="5.53371"
        strokeMiterlimit="10"
      />
      <path
        d="M50.4634 36.9697L83.6656 70.172V81.2394H97.4999V36.9697L50.4634 36.9697Z"
        className="stroke-textMain dark:stroke-textMainDark group-hover:stroke-superDuper transition-colors duration-300"
        strokeWidth="5.53371"
        strokeMiterlimit="10"
      />
    </svg>
  );
  
  export default CustomLogo;
  