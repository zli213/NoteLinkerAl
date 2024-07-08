import { useState, useRef, useEffect, ReactNode } from "react";

interface CustomModalProps {
  name: string;
  children: ReactNode;
}

const CustomModal = ({ name, children }: CustomModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="btn w-full bg-blue-500 text-white py-2 px-4 rounded hover:text-gray-900 transition-colors duration-150 ease-in-out hover:bg-blue-600"
        onClick={openModal}
      >
        {name}
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomModal;
