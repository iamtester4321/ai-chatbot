import React, { useState, useRef } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:block fixed top-4 left-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50 cursor-pointer"
      >
        Open Chat
      </button>
      <button
        onClick={() => setIsOpen(true)}
        className='block md:hidden fixed top-4 left-4  p-2 rounded shadow z-50 cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" fill='white' viewBox="0 0 50 50">
          <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-black shadow-lg transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">ChatGPT</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          <div className="bg-gray-100 p-3 rounded text-black">Hello! How can I help you?</div>
        </div>


      </div>
    </>
  );
};

export default Sidebar;
