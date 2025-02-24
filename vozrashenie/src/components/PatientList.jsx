import React, { useState } from "react";
import UpdatePatientForm from "./UpdatePatientForm";
import SelectPopup from "./SelectPopup";
import DeletePopup from "./DeletePopup";
import Search from "./Search";
import BASE_URL from "../config";
const PatientList = ({
  patients,
  onDeletePatient,
  onUpdatePatient,
  handleSelectPatient,

  doctorId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSelectPopup, setShowSelectPopup] = useState(false);
  const [selectedPatientForSelection, setSelectedPatientForSelection] =
    useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      (typeof patient.Name === "string" &&
        patient.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof patient.Surname === "string" &&
        patient.Surname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof patient.Diagnosis === "string" &&
        patient.Diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openDeletePopup = (patient) => {
    setPatientToDelete(patient);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (patientToDelete) {
      onDeletePatient(patientToDelete.ID);
      setShowDeletePopup(false);
      setPatientToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setPatientToDelete(null);
  };

  const openSelectPopup = (patient) => {
    setSelectedPatientForSelection(patient);
    setShowSelectPopup(true);
  };

  const confirmSelect = () => {
    if (selectedPatientForSelection) {
      handleSelectPatient(selectedPatientForSelection.ID);
      setShowSelectPopup(false);
      setSelectedPatientForSelection(null);
    }
  };

  const cancelSelect = () => {
    setShowSelectPopup(false);
    setSelectedPatientForSelection(null);
  };

  return (
    <div className="flex flex-row gap-[2.5%] pb-11 mob:flex-col">
      <div className="w-[60.5%] mob:w-full mob:order-2">
        <span className="text-f32 font-bold py-4 pb-11 block">
          Список пациентов
        </span>
        {patients.length > 0 ? (
          <ul className="grid grid-cols-3 gap-14 gap-y-8 mob:grid-cols-1 mob:gap-5">
            {patients.map((patient) => (
              <li className="rounded-10 bg-white relative" key={patient.ID}>
                {patient.Photo ? (
                  <img
                    className="w-full object-cover h-[13.9375rem] rounded-t-10"
                    src={`${BASE_URL}${patient.Photo}`}
                    alt={`${patient.Name} ${patient.Surname}`}
                  />
                ) : (
                  <img
                    className="w-full object-cover h-[13.9375rem] rounded-t-10"
                    src={`${process.env.PUBLIC_URL}/photo-pacient.svg`}
                    alt="фото пациента"
                  />
                )}
                <div className="p-2 py-2.5">
                  <div className="p-2.5 mb-3">
                    <span className="text-f13 flex flex-row gap-2 items-center leading-normal mb-2">
                      {patient.Age} лет <span>|</span> {patient.Diagnosis}
                    </span>
                    <span className="block text-f24 font-bold leading-normal">
                      {patient.Name}
                    </span>
                    <span className="block text-f20 font-medium leading-normal">
                      {patient.Surname}
                    </span>
                  </div>

                  <button
                    onClick={() => openSelectPopup(patient)}
                    className="bg-main-accent text-white text-f15 rounded-10 p-3 w-full"
                  >
                    Выбрать
                  </button>
                </div>

                <div className="flex flex-col gap-3.5 absolute top-2 right-2 z-10">
                  <button
                    className="w-[2.5625rem] h-[2.5625rem] flex justify-center items-center bg-white rounded-full"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <svg
                      className="w-6 h-6"
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.6103 1.46974C16.5152 -0.435938 19.6049 -0.435938 21.5097 1.46974C23.4154 3.3746 23.4154 6.46354 21.5097 8.36922L8.5595 21.3195H22.16C22.6127 21.3195 22.98 21.686 22.98 22.1395C22.98 22.5921 22.6127 22.9595 22.16 22.9595H0.84002C0.38738 22.9595 0.0200195 22.5921 0.0200195 22.1395V16.3995C0.0200195 16.1822 0.106144 15.9731 0.260304 15.8197L14.6103 1.46974ZM6.24054 21.3195L17.3105 10.2495L12.73 5.66899L1.66002 16.739V21.3195H6.24054ZM13.8895 4.50951L18.47 9.09003L20.3503 7.20974C21.6147 5.94448 21.6147 3.89366 20.3503 2.62922C19.085 1.36396 17.035 1.36396 15.7697 2.62922L13.8895 4.50951Z"
                        fill="#171717"
                      />
                    </svg>
                  </button>
                  <button
                    className="w-[2.5625rem] h-[2.5625rem] flex justify-center items-center bg-white rounded-full"
                    onClick={() => openDeletePopup(patient)}
                  >
                    <svg
                      className="w-6 h-6"
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.58002 2.47999C6.58002 1.12125 7.68128 0.019989 9.04002 0.019989H13.96C15.3188 0.019989 16.42 1.12125 16.42 2.47999V3.29999H22.16C22.6127 3.29999 22.98 3.66735 22.98 4.11999C22.98 4.57263 22.6127 4.93999 22.16 4.93999H20.52V18.88C20.52 21.144 18.684 22.98 16.42 22.98H6.58002C4.316 22.98 2.48002 21.144 2.48002 18.88V4.93999H0.84002C0.38738 4.93999 0.0200195 4.57263 0.0200195 4.11999C0.0200195 3.66735 0.38738 3.29999 0.84002 3.29999H6.58002V2.47999ZM8.22002 3.29999H14.78V2.47999C14.78 2.02735 14.4127 1.65999 13.96 1.65999H9.04002C8.58738 1.65999 8.22002 2.02735 8.22002 2.47999V3.29999ZM4.12002 4.93999V18.88C4.12002 20.2387 5.22128 21.34 6.58002 21.34H16.42C17.7788 21.34 18.88 20.2387 18.88 18.88V4.93999H4.12002ZM11.5 7.39999C11.9527 7.39999 12.32 7.76735 12.32 8.21999V18.06C12.32 18.5126 11.9527 18.88 11.5 18.88C11.0474 18.88 10.68 18.5126 10.68 18.06V8.21999C10.68 7.76735 11.0474 7.39999 11.5 7.39999Z"
                        fill="#171717"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет пациентов</p>
        )}
      </div>

      <Search
        doctorId={doctorId}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        filteredPatients={filteredPatients}
        setSelectedPatient={setSelectedPatient}
        openSelectPopup={openSelectPopup}
      />

      {showDeletePopup && (
        <DeletePopup
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
        />
      )}

      {showSelectPopup && (
        <SelectPopup
          cancelSelect={cancelSelect}
          confirmSelect={confirmSelect}
        />
      )}

      {selectedPatient && (
        <UpdatePatientForm
          patient={selectedPatient}
          onUpdatePatient={onUpdatePatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default PatientList;
