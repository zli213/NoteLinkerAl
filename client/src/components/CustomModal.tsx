import { useState, useRef, useEffect } from "react";

const CustomModal = ({ name }: { name: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleEscape = (event: { key: string }) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleClickOutside = (event: { target: any }) => {
      if (
        (modalRef.current as unknown as HTMLElement) &&
        !(modalRef.current as unknown as HTMLElement).contains(event.target)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="btn w-full bg-blue-500 text-white py-2 px-4 rounded hover:text-gray-900 p-2 transition-colors duration-150 ease-in-out hover:bg-blue-600"
        onClick={openModal}
      >
        {name}
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
