import React from "react";
import AiBlock from "./AiBlock";

const Search = ({
  searchQuery,
  handleSearchChange,
  filteredPatients,
  setSelectedPatient,
  openSelectPopup,
  doctorId,
}) => {
  const getGenderText = (gender) => {
    if (gender === "Male") return "Мужчина";
    if (gender === "Female") return "Женщина";
    return gender;
  };
  return (
    <div className="w-[37%] mob:w-full mob:order-1">
      <div className="w-full mb-3 bg-white flex flex-row justify-between items-center rounded-35 mob:rounded-20 p-7">
        <input
          className="w-full outline-none text-f20"
          type="text"
          placeholder="Поиск пациента..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <svg
          className="w-7 h-7"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.5 2.00006C6.701 2.00006 2 6.70106 2 12.5001C2 18.2991 6.701 23.0001 12.5 23.0001C15.397 23.0001 18.018 21.8281 19.919 19.9301C21.824 18.0281 23 15.4021 23 12.5001C23 6.70106 18.299 2.00006 12.5 2.00006ZM0 12.5001C0 5.59606 5.596 6.10352e-05 12.5 6.10352e-05C19.404 6.10352e-05 25 5.59606 25 12.5001C25 15.5941 23.875 18.4271 22.013 20.6091L27.706 26.2921C28.097 26.6821 28.098 27.3161 27.708 27.7061C27.318 28.0971 26.684 28.0981 26.294 27.7081L20.598 22.0231C18.417 23.8791 15.589 25.0001 12.5 25.0001C5.596 25.0001 0 19.4041 0 12.5001Z"
            fill="#171717"
          />
        </svg>
      </div>

      {filteredPatients.length > 0 ? (
        <ul className="bg-white rounded-35 mob:rounded-20  mb-3">
          {searchQuery &&
            filteredPatients.map((patient) => (
              <li className="flex flex-row justify-between items-center">
                <div
                  onClick={() => setSelectedPatient(patient)}
                  className="flex flex-row gap-8 w-full cursor-pointer p-5 px-8 mob:p-3 mob:pe-0"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/union.svg`}
                    alt="union"
                  />
                  <div>
                    <span className="block text-f20 font-medium leading-110">
                      {patient.Name} {patient.Surname}
                    </span>
                    <span className="text-f16 font-light flex flex-row gap-2">
                      {getGenderText(patient.Gender)} <span>|</span>{" "}
                      {patient.Age} лет <span>|</span> {patient.Diagnosis}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openSelectPopup(patient)}
                  className="bg-main-accent flex justify-center items-center rounded-full min-w-[2.8125rem] w-[2.8125rem] h-[2.8125rem]  m-5 me-7  mob:m-3"
                >
                  <svg
                    className="w-[1.6875rem] h-[1.6875rem]"
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 13.25C0 5.93221 5.93411 0 13.25 0C20.5659 0 26.5 5.93221 26.5 13.25C26.5 20.5678 20.5659 26.5 13.25 26.5C5.93411 26.5 0 20.5678 0 13.25ZM13.25 1.89286C6.97518 1.89286 1.89286 6.97802 1.89286 13.25C1.89286 19.522 6.97518 24.6071 13.25 24.6071C19.5248 24.6071 24.6071 19.522 24.6071 13.25C24.6071 6.97802 19.5248 1.89286 13.25 1.89286ZM17.5373 15.5062L13.4297 18.6465C11.5558 20.0747 8.85864 18.7421 8.85864 16.3912V10.1088C8.85864 7.75789 11.5558 6.42526 13.4297 7.85343L17.5373 10.9937C19.0232 12.1304 19.0232 14.3696 17.5373 15.5062ZM16.3827 14.0024C16.8843 13.6229 16.8843 12.8771 16.3827 12.4976L12.2751 9.35735C11.6505 8.88129 10.7515 9.32518 10.7515 10.1088V16.3912C10.7515 17.1748 11.6505 17.6187 12.2751 17.1426L16.3827 14.0024Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </li>
            ))}
        </ul>
      ) : (
        <div className="bg-white rounded-35 mob:rounded-20  mb-3">
          <div className="flex flex-row justify-between items-center p-5 px-8 mob:p-3 mob:pe-0">
            Нет пациентов
          </div>
        </div>
      )}

      <AiBlock doctorId={doctorId} />
    </div>
  );
};

export default Search;
