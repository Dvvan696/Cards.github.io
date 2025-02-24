import React, { useState } from "react";
import BASE_URL from "../config";
import SuccessfulDownload from "./SuccessfulDownload";

const UpdatePatientForm = ({ patient, onUpdatePatient, onClose }) => {
  const [updatedPatient, setUpdatedPatient] = useState({
    name: patient.Name,
    surname: patient.Surname,
    age: patient.Age,
    diagnosis: patient.Diagnosis,
    gender: patient.Gender,
    photo: null,
    photoPreview: patient.Photo ? `${BASE_URL}${patient.Photo}` : null,
  });

  // State for managing loader visibility
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false); // State for success message

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedPatient({
      ...updatedPatient,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    });
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);

    try {
      setIsLoading(true); // Show loader
      const formData = new FormData();
      formData.append("PatientID", patient.ID);

      files.forEach((file) => {
        formData.append("Images[]", file);
      });

      await fetch(`${BASE_URL}UploadImages.php`, {
        method: "POST",
        body: formData,
      });

      // Upload is complete
      setIsUploadSuccess(true); // Show success message
    } catch (error) {
      console.error("Ошибка загрузки изображений:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const handleSubmitPatient = async (e) => {
    e.preventDefault();
    try {
      await onUpdatePatient(patient.ID, updatedPatient);
      onClose();
    } catch (error) {
      console.error("Ошибка обновления данных:", error);
    }
  };

  return (
    <>
      {isUploadSuccess ? ( // Check if upload was successful
        <SuccessfulDownload onClose={onClose} /> // Show success message component
      ) : (
        <div className="fixed left-0 top-0 h-full w-full z-50 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white rounded-35 mob:rounded-20 p-7.5 mob:p-4">
            <form onSubmit={handleSubmitPatient}>
              <div className="flex flex-row justify-between items-center p-2.5 mb-7 mob:flex-col mob:mb-4">
                <span className="text-main-accent text-f32 block font-bold mob:order-2 mob:leading-110">
                  Редактирование профиля
                </span>
                <button
                  type="button"
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
                <div className="mob:order-2">
                  <div className="w-80 h-[16rem] relative mb-2.5 mob:w-full mob:h-48">
                    <div className="relative w-full h-full peer transition-all">
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleFileChange}
                        className="w-full h-full cursor-pointer opacity-0 absolute top-0 left-0"
                      />
                      <img
                        className="w-full h-full object-cover rounded-10"
                        src={`${process.env.PUBLIC_URL}/photo-pacient.svg`}
                        alt="фото пациента"
                      />
                    </div>

                    {updatedPatient.photoPreview && (
                      <img
                        src={updatedPatient.photoPreview}
                        alt="Preview"
                        className="object-cover absolute top-0 left-0 w-full h-full rounded-10 pointer-events-none  transition-all"
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col text-f15 gap-5 px-2.5 w-[25.25rem] mob:w-full mob:order-1 mob:pb-4 mob:px-0  mob:gap-3">
                  <input
                    className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
                    type="text"
                    value={updatedPatient.name}
                    onChange={(e) =>
                      setUpdatedPatient({
                        ...updatedPatient,
                        name: e.target.value,
                      })
                    }
                    required
                    placeholder="Имя"
                  />
                  <input
                    className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
                    type="text"
                    value={updatedPatient.surname}
                    onChange={(e) =>
                      setUpdatedPatient({
                        ...updatedPatient,
                        surname: e.target.value,
                      })
                    }
                    required
                    placeholder="Фамилия"
                  />
                  <input
                    className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
                    type="number"
                    value={updatedPatient.age}
                    onChange={(e) =>
                      setUpdatedPatient({
                        ...updatedPatient,
                        age: e.target.value,
                      })
                    }
                    required
                    placeholder="Возраст"
                  />
                  <input
                    className="bg-main-accent/10 rounded-10 p-3 px-6 outline-none"
                    type="text"
                    value={updatedPatient.diagnosis}
                    onChange={(e) =>
                      setUpdatedPatient({
                        ...updatedPatient,
                        diagnosis: e.target.value,
                      })
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
                          checked={updatedPatient.gender === "Male"}
                          onChange={(e) =>
                            setUpdatedPatient({
                              ...updatedPatient,
                              gender: e.target.value,
                            })
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
                          checked={updatedPatient.gender === "Female"}
                          onChange={(e) =>
                            setUpdatedPatient({
                              ...updatedPatient,
                              gender: e.target.value,
                            })
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

            <div className="relative h-full peer transition-all w-80 -mt-12 mob:w-full mob:mt-0">
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .mp4"
                onChange={handleImagesChange}
                multiple
                className="w-full h-full cursor-pointer opacity-0 absolute top-0 left-0"
              />
              <button
                type="submit"
                className="mt-0.5 w-full bg-main-accent/20 text-f15 text-center p-3 rounded-10 flex flex-row gap-4 justify-center items-center"
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex justify-center items-center bg-white/75 z-10">
                    <div className="loader border-t-transparent border-4 border-main-accent rounded-full w-8 h-8 animate-spin"></div>
                  </div>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.17857 1.82143C2.29089 1.82143 1.57143 2.54089 1.57143 3.42857V9.63536L3.87127 7.33555C4.08019 7.12609 4.41981 7.12609 4.62873 7.33555L8.80357 11.5104L11.3713 8.94269C11.5802 8.73323 11.9198 8.73323 12.1287 8.94269L14.4286 11.2425V3.42857C14.4286 2.54089 13.7091 1.82143 12.8214 1.82143H3.17857ZM15.5 3.42857C15.5 1.94946 14.3005 0.75 12.8214 0.75H3.17857C1.69946 0.75 0.5 1.94946 0.5 3.42857V13.0714C0.5 14.5505 1.69946 15.75 3.17857 15.75H12.8214C14.3005 15.75 15.5 14.5505 15.5 13.0714V3.42857ZM14.4286 12.7575L11.75 10.0789L9.56107 12.2679L11.9718 14.6786H12.8214C13.7091 14.6786 14.4286 13.9591 14.4286 13.0714V12.7575ZM10.4568 14.6786L4.25 8.47179L1.57143 11.1504V13.0714C1.57143 13.9591 2.29089 14.6786 3.17857 14.6786H10.4568ZM11.2143 3.96429C10.6223 3.96429 10.1429 4.44375 10.1429 5.03571C10.1429 5.62768 10.6223 6.10714 11.2143 6.10714C11.8062 6.10714 12.2857 5.62768 12.2857 5.03571C12.2857 4.44375 11.8062 3.96429 11.2143 3.96429ZM9.07143 5.03571C9.07143 3.85232 10.0309 2.89286 11.2143 2.89286C12.3977 2.89286 13.3571 3.85232 13.3571 5.03571C13.3571 6.21911 12.3977 7.17857 11.2143 7.17857C10.0309 7.17857 9.07143 6.21911 9.07143 5.03571Z"
                      fill="black"
                    />
                  </svg>
                )}
                Загрузить архив фото
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePatientForm;
