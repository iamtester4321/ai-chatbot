// components/SunIcon.jsx

const SunIcon = ({ width = 24, height = 24, fill = "#838383", ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      {...props}
    >
      <path d="M2.8 13.7c4.1 0 7.5 3.4 7.5 7.5 0 .5-.4.8-.8.8s-.8-.4-.8-.8c0-3.2-2.6-5.8-5.8-5.8-.5 0-.8-.4-.8-.8s.4-.9.8-.9Zm18.4 0c.5 0 .8.4.8.8s-.4.8-.8.8c-3.2 0-5.8 2.6-5.8 5.8 0 .5-.4.8-.8.8s-.8-.4-.8-.8c.1-4.1 3.5-7.5 7.5-7.5ZM12 9.5c1.4 0 2.5 1.1 2.5 2.5S13.4 14.5 12 14.5 9.5 13.4 9.5 12s1.1-2.5 2.5-2.5ZM9.5 2c.5 0 .8.4.8.8 0 4.1-3.4 7.5-7.5 7.5-.5 0-.8-.4-.8-.8s.4-.8.8-.8c3.2 0 5.8-2.6 5.8-5.8 0-.4.4-.8.8-.8Zm5 0c.4 0 .8.4.8.8 0 3.1 2.4 5.7 5.4 5.9.5.1.9.5.8 1s-.5.8-1 .8c-4-.1-7.3-3.4-7.3-7.5 0-.5.3-.8.8-.8Z" />
    </svg>
  );
  
  export default SunIcon;
  