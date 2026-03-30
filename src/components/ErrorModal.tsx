import React from "react";

type ErrorModalProps = {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/30" // ← light dim
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // optional: close on outside click
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-80 sm:w-96">
        <div className="flex justify-between items-center border-b px-4 py-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="px-4 py-4">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex justify-end border-t px-4 py-2">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
