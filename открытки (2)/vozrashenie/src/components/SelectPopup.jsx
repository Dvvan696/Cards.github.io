import React from "react";

const SelectPopup = ({ cancelSelect, confirmSelect }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-full z-50 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-35 mob:rounded-20 p-8 px-16 w-[32.5rem]">
        <h3 className="text-main-accent text-f32 block font-bold text-center mb-8">
          Запуск сеанса
        </h3>
        <p className="mb-8 text-f20 text-center m-auto leading-130">
          Вы точно хотите запустить сеанс для данного пользователя?
        </p>
        <div className="grid grid-cols-2 gap-6">
          <button
            className="bg-main-accent/20 text-f15 rounded-10 p-3.5 w-full"
            onClick={cancelSelect}
          >
            Отменить
          </button>
          <button
            className="bg-main-accent text-white text-f15 rounded-10 p-3.5 w-full"
            onClick={confirmSelect}
          >
            Запустить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPopup;
