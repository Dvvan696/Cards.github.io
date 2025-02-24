import React, { useState } from "react";

const AddPatientForm = ({ onAddPatient, onClose }) => {
  const [newPatient, setNewPatient] = useState({
    name: "",
    surname: "",
    age: "",
    diagnosis: "",
    gender: "",
    photo: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewPatient({
      ...newPatient,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPatient(newPatient);
    setNewPatient({
      name: "",
      surname: "",
      age: "",
      diagnosis: "",
      gender: "",
      photo: null,
    });
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 h-full w-full z-50 backdrop-blur-md flex justify-center items-center">
      <form
        className="bg-white rounded-35 mob:rounded-20 p-7.5 mob:p-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row justify-between items-center p-2.5 mb-7 mob:flex-col mob:mb-4">
          <span className="text-main-accent text-f32 block font-bold  mob:order-2  mob:leading-110">
            Добавить пациента
          </span>
          <button
            onClick={onClose}
            className="flex flex-row justify-between items-center gap-3 text-f15 font-medium p-2.5 mob:order-1 mob:justify-end mob:w-full mob:mb-4 mob:p-0"
          >
            Закрыть
            <svg
              className="w-6 h-6"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.5 12.5C0.5 6.01064 5.76064 0.75 12.25 0.75C18.7394 0.75 24 6.01064 24 12.5C24 18.9877 18.7394 24.25 12.25 24.25C5.76064 24.25 0.5 18.9877 0.5 12.5ZM12.25 2.42857C6.68805 2.42857 2.17857 6.93805 2.17857 12.5C2.17857 18.0645 6.68805 22.5714 12.25 22.5714C17.8119 22.5714 22.3214 18.0645 22.3214 12.5C22.3214 6.93805 17.8119 2.42857 12.25 2.42857ZM16.9977 8.93921C17.3253 8.61162 17.3253 8.07988 16.9977 7.75229C16.6701 7.42469 16.1384 7.42469 15.8108 7.75229L12.25 11.3131L8.68921 7.75229C8.36162 7.42469 7.82988 7.42469 7.50228 7.75229C7.17469 8.07988 7.17469 8.61162 7.50228 8.93921L11.0631 12.5L7.50228 16.0608C7.17588 16.3872 7.17469 16.9201 7.50228 17.2477C7.82988 17.5753 8.36281 17.5741 8.68921 17.2477L12.25 13.6869L15.8108 17.2477C16.1384 17.5753 16.6701 17.5753 16.9977 17.2477C17.3253 16.9201 17.3253 16.3884 16.9977 16.0608L13.4369 12.5L16.9977 8.93921Z"
                fill="black"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-row justify-between gap-2 mob:flex-col">
          <div>
            <div className="w-80 h-[19.5rem] relative mob:w-full mob:h-48">
              <div className="relative w-full h-full peer transition-all">
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleFileChange}
                  className="w-full h-full cursor-pointer opacity-0 absolute top-0 left-0"
                />

                <img
                  className="w-full h-full object-cover  rounded-10"
                  src={`${process.env.PUBLIC_URL}/photo-pacient.svg`}
                  alt="фото пациента"
                />
              </div>

              {newPatient.photoPreview && (
                <img
                  src={newPatient.photoPreview}
                  alt="Preview"
                  className="object-cover absolute top-0 left-0 w-full h-full rounded-10 pointer-events-none transition-all"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col text-f15 gap-5 px-2.5 w-[25.25rem] mob:w-full mob:pb-6 mob:px-0 mob:gap-3">
            <input
              className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
              type="text"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
              required
              placeholder="Имя"
            />
            <input
              className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
              type="text"
              value={newPatient.surname}
              onChange={(e) =>
                setNewPatient({ ...newPatient, surname: e.target.value })
              }
              required
              placeholder="Фамилия"
            />
            <input
              className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
              type="number"
              value={newPatient.age}
              onChange={(e) =>
                setNewPatient({ ...newPatient, age: e.target.value })
              }
              required
              placeholder="Возраст"
            />
            <input
              className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
              type="text"
              value={newPatient.diagnosis}
              onChange={(e) =>
                setNewPatient({ ...newPatient, diagnosis: e.target.value })
              }
              required
              placeholder="Диагноз"
            />
            <div className="grid grid-cols-2 gap-6 justify-between ">
              <div className="w-full rounded-10 bg-main-accent/10 grid grid-cols-2">
                <label>
                  <input
                    className="peer hidden"
                    type="radio"
                    value="Male"
                    checked={newPatient.gender === "Male"}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, gender: e.target.value })
                    }
                    required
                  />
                  <div className="text-f15 text-center p-3 rounded-10 cursor-pointer peer-checked:bg-main-accent/20">
                    Муж.
                  </div>
                </label>
                <label>
                  <input
                    className="peer hidden"
                    type="radio"
                    value="Female"
                    checked={newPatient.gender === "Female"}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, gender: e.target.value })
                    }
                    required
                  />
                  <div className="text-f15 text-center p-3 rounded-10 cursor-pointer peer-checked:bg-main-accent/20">
                    Жен.
                  </div>
                </label>
              </div>

              <button
                className="bg-main-accent text-white text-f15 rounded-10 p-3 w-full"
                type="submit"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPatientForm;
