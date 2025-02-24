import React from "react";

const SuccessfulDownload = ({ onClose }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-full z-50 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-35 mob:rounded-20 p-8 px-16 w-[32.5rem]">
        <h3 className="text-main-accent text-f32 block font-bold text-center mb-8">
          Архив загружен
        </h3>

        <button
          className="bg-main-accent text-white text-f15 rounded-10 p-3.5 w-full"
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default SuccessfulDownload;
