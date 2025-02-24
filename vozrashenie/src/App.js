import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import PatientList from "./components/PatientList";
import AddPatientForm from "./components/AddPatientForm";
import BASE_URL from "./config";

const App = () => {
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const storedIpAddress = localStorage.getItem("ipAddress");
    if (storedIpAddress) {
      setIpAddress(storedIpAddress);
    }

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      fetchPatients(parsedUserData.ID);
    }
  }, []);

  const saveIpAddress = (newIpAddress) => {
    localStorage.setItem("ipAddress", newIpAddress);
  };

  const handleIpChange = (event) => {
    const newIpAddress = event.target.value;
    if (/^[0-9.]*$/.test(newIpAddress)) {
      setIpAddress(newIpAddress);
      saveIpAddress(newIpAddress);
    }
  };

  const fetchPatients = async (doctorId) => {
    try {
      const [patientsResponse] = await Promise.all([
        axios.get(`${BASE_URL}GetPatients.php`, {
          params: { DoctorID: doctorId },
        }),
      ]);

      if (patientsResponse.data.success) {
        setPatients(patientsResponse.data.patients);
        setError("");
      } else {
        setError("Failed to fetch patients");
        setPatients([]);
      }
    } catch (error) {
      console.error("Fetching patients error:", error);
      setError("Error occurred while fetching patients");
      setPatients([]);
    }
  };

  const handleLogin = async (login, password) => {
    try {
      const response = await axios.get(`${BASE_URL}Login.php`, {
        params: { Login: login, Password: password },
      });

      if (response.data.err) {
        if (response.data.err === "wrong login") {
          setError("Введен неверный логин");
        } else if (response.data.err === "wrong password") {
          setError("Введен неверный пароль");
        } else {
          setError(response.data.err);
        }
        setUserData(null);
        localStorage.removeItem("userData");
      } else {
        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
        fetchPatients(response.data.ID);
        setError("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Произошла ошибка при входе в систему");
      setUserData(null);
      localStorage.removeItem("userData");
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      const response = await axios.get(`${BASE_URL}DeletePatient.php`, {
        params: { DoctorID: userData.ID, PatientID: patientId },
      });

      if (response.data.success) {
        setError("");
      } else {
        setError("Failed to delete patient");
      }
    } catch (error) {
      console.error("Delete patient error:", error);
      setError("Error occurred while deleting patient");
    } finally {
      fetchPatients(userData.ID);
    }
  };

  const handleAddPatient = async (newPatient) => {
    const formData = new FormData();
    formData.append("DoctorID", userData.ID);
    formData.append("PatientName", newPatient.name);
    formData.append("PatientSurname", newPatient.surname);
    formData.append("Age", newPatient.age);
    formData.append("Diagnosis", newPatient.diagnosis);
    formData.append("Gender", newPatient.gender);
    if (newPatient.photo) {
      formData.append("Photo", newPatient.photo);
    }

    try {
      const response = await axios.post(`${BASE_URL}AddPatient.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setError("");
      } else {
        setError("Failed to add patient");
      }
    } catch (error) {
      console.error("Add patient error:", error);
      setError("Error occurred while adding patient");
    } finally {
      fetchPatients(userData.ID);
    }
  };

  const handleUpdatePatient = async (patientId, updatedPatient) => {
    const formData = new FormData();
    formData.append("DoctorID", userData.ID);
    formData.append("PatientID", patientId);
    formData.append("Name", updatedPatient.name);
    formData.append("Surname", updatedPatient.surname);
    formData.append("Age", updatedPatient.age);
    formData.append("Diagnosis", updatedPatient.diagnosis);
    formData.append("Gender", updatedPatient.gender);
    formData.append("Photo", updatedPatient.photo);

    try {
      const response = await axios.post(
        `${BASE_URL}UpdatePatient.php`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setError("");
      } else {
        setError("Failed to update patient");
      }
    } catch (error) {
      console.error("Update patient error:", error);
      setError("Error occurred while updating patient");
    } finally {
      fetchPatients(userData.ID);
    }
  };

  const handleLogout = () => {
    setUserData(null);
    setPatients([]);
    localStorage.removeItem("userData");
  };

  const handleSelectPatient = async (patientId) => {
    const jsonData = {
      PatientID: patientId,
    };

    const url = `http://${ipAddress}:8081/control`;

    try {
      const response = await axios.post(url, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Sent JSON:", jsonData);
      console.log("URL:", url);
      console.log("Response:", response.data);
    } catch (error) {
      console.log("Sent JSON:", jsonData);
      console.log("URL:", url);
      if (error.response) {
        console.error("Response error:", error.response);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <div className="text-main-fontcolor">
      {userData ? (
        <div className="px-[14.5rem] m-auto pt-12 mob:px-4 mob:pt-6">
          <div className="flex flex-row justify-between items-center bg-white rounded-35 mob:rounded-20 p-4 mb-11 mob:py-4 mob:mb-6 mob:grid mob:grid-cols-8 mob:gap-4 mob:justify-between">
            <img
              className="w-[18.125rem] mx-5 mob:order-1 mob:col-span-6 mob:mx-0 mob:w-full"
              src={`${process.env.PUBLIC_URL}/logo.svg`}
              alt=""
            />
            <div className="flex flex-row gap-6 mob:gap-4 mob:contents">
              <button
                onClick={() => setShowAddPatientForm(true)}
                className="bg-main-accent/20 text-f20 min-w-[19.4375rem] gap-5 rounded-full flex flex-row items-center justify-between p-2 px-7 mob:px-5 mob:min-w-full mob:order-3  mob:gap-2 mob:py-4 mob:col-span-8"
              >
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
                    d="M0 14C0 6.268 6.268 0 14 0C21.732 0 28 6.268 28 14C28 21.73 21.732 28 14 28C6.268 28 0 21.73 0 14ZM14 2C7.373 2 2 7.373 2 14C2 20.63 7.373 26 14 26C20.627 26 26 20.63 26 14C26 7.373 20.627 2 14 2ZM15 7C15 6.448 14.552 6 14 6C13.448 6 13 6.448 13 7V13H7C6.448 13 6 13.448 6 14C6 14.552 6.448 15 7 15H13V21C13 21.55 13.448 22 14 22C14.552 22 15 21.55 15 21V15H21C21.552 15 22 14.552 22 14C22 13.448 21.552 13 21 13H15V7Z"
                    fill="#171717"
                  />
                </svg>
                Добавить пациента
              </button>
              <div className="bg-main-accent/20 text-f20 min-w-[19.4375rem] gap-5 rounded-full flex flex-row items-center justify-between p-2 px-7 mob:px-5 mob:min-w-full mob:gap-2 mob:py-4 mob:order-4 mob:col-span-8">
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
                    d="M18.4705 1.26262C18.6169 0.73273 18.3046 0.182862 17.7872 0.032893C17.2601 -0.107078 16.733 0.212817 16.5866 0.742708L9.75382 26.7374C9.61716 27.2673 9.91972 27.8171 10.4468 27.9671C10.9642 28.1071 11.501 27.7872 11.6377 27.2573L18.4705 1.26262ZM7.86014 22.7082C7.47945 23.0982 6.85482 23.0982 6.47413 22.7082L1.42757 17.5394C-0.475857 15.5798 -0.475857 12.4203 1.42757 10.4607L6.47413 5.29189C6.85482 4.90197 7.47945 4.90197 7.86014 5.29189C8.24082 5.68181 8.24082 6.3216 7.86014 6.71152L2.8137 11.8804C1.66188 13.0501 1.66188 14.95 2.8137 16.1197L7.86014 21.2886C8.24082 21.6785 8.24082 22.3183 7.86014 22.7082ZM21.7113 22.5183C21.3306 22.9083 20.7059 22.9083 20.3252 22.5183C19.9445 22.1284 19.9445 21.4886 20.3252 21.0987L25.1862 16.1198C26.338 14.95 26.338 13.0502 25.1862 11.8804L20.3252 6.90144C19.9445 6.51152 19.9445 5.87173 20.3252 5.48181C20.7059 5.09189 21.3306 5.09189 21.7113 5.48181L26.5724 10.4608C28.4758 12.4204 28.4758 15.5798 26.5724 17.5394L21.7113 22.5183Z"
                    fill="#171717"
                  />
                </svg>
                <input
                  className="outline-none bg-[initial] text-right mob:max-w-48"
                  type="text"
                  placeholder="Введите IP адрес"
                  value={ipAddress}
                  onChange={handleIpChange}
                />
              </div>

              <div className="contents mob:flex mob:justify-end mob:order-2 mob:col-span-2">
                <button
                  className="rounded-full w-16 h-16 flex justify-center items-center bg-main-accent "
                  onClick={handleLogout}
                >
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
                      d="M8 26C7.45 26 7 26.45 7 27C7 27.55 7.45 28 8 28H23C25.76 28 28 25.76 28 23V5C28 2.24 25.76 0 23 0H8C7.45 0 7 0.45 7 1C7 1.55 7.45 2 8 2H23C24.66 2 26 3.34 26 5V23C26 24.66 24.66 26 23 26H8ZM14.29 19.2901L18.59 15H1C0.45 15 0 14.55 0 14C0 13.45 0.45 13 1 13H18.59L14.29 8.70998C13.9 8.31998 13.9 7.68006 14.29 7.29006C14.68 6.90006 15.32 6.90006 15.71 7.29006L21.71 13.2901C22.1 13.6801 22.1 14.32 21.71 14.71L15.71 20.71C15.32 21.1 14.68 21.1 14.29 20.71C13.9 20.32 13.9 19.6801 14.29 19.2901Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <PatientList
            doctorId={userData.ID}
            patients={patients}
            handleSelectPatient={handleSelectPatient}
            onDeletePatient={handleDeletePatient}
            onUpdatePatient={handleUpdatePatient}
          />
          {showAddPatientForm && (
            <AddPatientForm
              onClose={() => setShowAddPatientForm(false)}
              onAddPatient={handleAddPatient}
            />
          )}
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} error={error} />
      )}
    </div>
  );
};

export default App;
