import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-xs"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-600 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
