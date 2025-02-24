import React, { useState, useEffect } from "react";
import CreationPopup from "./CreationPopup";
import EditAiPopup from "./EditAiPopup";
import BASE_URL from "../config";
import axios from "axios";
import AiSuccess from "./AiSuccess";
import DeleteAi from "./DeleteAi";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/scrollbar";
import { FreeMode, Scrollbar, Mousewheel } from "swiper/modules";

const AiBlock = ({ doctorId }) => {
  const [showCreationPopup, setShowCreationPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingName, setLoadingName] = useState(null);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const openPopup = (video) => {
    setSelectedVideo(video);
    setShowPopup(true);
    setShowEditPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowEditPopup(false);
    setSelectedVideo(null);
  };

  const handleDelete = (video) => {
    setVideoToDelete(video);
    setShowDeletePopup(true);
  };

  const fetchDoctorVideosCache = async (doctorId) => {
    try {
      const response = await axios.get(`${BASE_URL}GetDoctorVideosCache.php`, {
        params: { DoctorID: doctorId },
      });

      if (response.data.success) {
        return response.data.videosCache; // Возвращает кэш видео из ответа
      } else {
        setError("Не удалось получить список видео");
        return [];
      }
    } catch (error) {
      console.error("Ошибка при получении списка видео:", error);
      setError("Произошла ошибка при получении списка видео");
      return [];
    }
  };

  const confirmDelete = async () => {
    if (videoToDelete) {
      setLoadingName(videoToDelete.name);
      try {
        const response = await fetch(
          `${BASE_URL}/DeleteVideoCache.php?DoctorID=${doctorId}&Name=${videoToDelete.name}`,
          { method: "GET" }
        );
        if (response.ok) {
          setVideos(videos.filter((v) => v.name !== videoToDelete.name));
        } else {
          console.error("Не удалось удалить видео");
        }
      } catch (error) {
        console.error("Ошибка при удалении видео:", error);
      } finally {
        setLoadingName(null);
        setShowDeletePopup(false);
      }
    }
  };

  const updateVideos = async () => {
    const cache = await fetchDoctorVideosCache(doctorId);
    setVideos(cache);
  };

  useEffect(() => {
    updateVideos();
  }, [doctorId]);

  const [isScrollbarVisible, setScrollbarVisible] = useState(false);
  useEffect(() => {
    const swiperElement = document.querySelector(".mySwiper");
    const isOverflowing =
      swiperElement.scrollHeight > swiperElement.clientHeight;
    setScrollbarVisible(isOverflowing);
  }, [videos]);

  return (
    <div className="bg-white rounded-35 mob:rounded-20 p-7">
      <div className="flex flex-row justify-between items-center pb-8">
        <span className="text-f24 font-bold block tracking-1">
          Загрузка образов
        </span>

        <span
          onClick={() => setShowCreationPopup(true)}
          className="mt-0.5 w-fit cursor-pointer bg-main-accent/20 text-f20 text-center p-2.5 px-4 rounded-10 flex flex-row gap-5 justify-center items-center"
        >
          <svg
            className="w-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 10C0 4.47714 4.47714 0 10 0C15.5229 0 20 4.47714 20 10C20 15.5214 15.5229 20 10 20C4.47714 20 0 15.5214 0 10ZM10 1.42857C5.26643 1.42857 1.42857 5.26643 1.42857 10C1.42857 14.7357 5.26643 18.5714 10 18.5714C14.7336 18.5714 18.5714 14.7357 18.5714 10C18.5714 5.26643 14.7336 1.42857 10 1.42857ZM10.7143 5C10.7143 4.60571 10.3943 4.28571 10 4.28571C9.60571 4.28571 9.28571 4.60571 9.28571 5V9.28571H5C4.60571 9.28571 4.28571 9.60571 4.28571 10C4.28571 10.3943 4.60571 10.7143 5 10.7143H9.28571V15C9.28571 15.3929 9.60571 15.7143 10 15.7143C10.3943 15.7143 10.7143 15.3929 10.7143 15V10.7143H15C15.3943 10.7143 15.7143 10.3943 15.7143 10C15.7143 9.60571 15.3943 9.28571 15 9.28571H10.7143V5Z"
              fill="#171717"
            />
          </svg>
          Создать
        </span>
      </div>
      <Swiper
        direction={"vertical"}
        slidesPerView={"auto"}
        freeMode={true}
        scrollbar={true}
        mousewheel={true}
        modules={[FreeMode, Scrollbar, Mousewheel]}
        className="mySwiper max-h-72"
      >
        <SwiperSlide
          className={` bg-white  gap-3 flex flex-col  ${
            isScrollbarVisible ? "ps-9" : ""
          }`}
        >
          {videos.map((video, index) => (
            <li
              key={index}
              className={`flex flex-row justify-between items-center ${
                loadingName === video.name ? "cursor-progress" : ""
              }`}
            >
              <div className="flex flex-row items-center gap-8 w-full mob:p-3 mob:pe-0">
                {loadingName === video.name ? (
                  <svg
                    className="w-[1.625rem]"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 13C0 5.82214 5.82029 0 13 0C20.1797 0 26 5.82214 26 13C26 20.1779 20.1797 26 13 26C5.82029 26 0 20.1779 0 13ZM13 1.85714C6.84636 1.85714 1.85714 6.84357 1.85714 13C1.85714 19.1564 6.84636 24.1429 13 24.1429C19.1536 24.1429 24.1429 19.1564 24.1429 13C24.1429 6.84357 19.1536 1.85714 13 1.85714ZM12.0714 13.9286C12.0714 14.2071 12.194 14.4672 12.4057 14.6436L17.9771 19.2864C18.3708 19.6114 18.9568 19.5557 19.2846 19.1657C19.6133 18.7757 19.5594 18.1907 19.1657 17.8564L13.9286 13.4922V5.57143C13.9286 5.06071 13.5126 4.64286 13 4.64286C12.4874 4.64286 12.0714 5.06071 12.0714 5.57143V13.9286Z"
                      fill="#11C8D9"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-[1.625rem]"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 13C0 5.82029 5.82029 0 13 0C20.1797 0 26 5.82029 26 13C26 20.1779 20.1797 26 13 26C5.82029 26 0 20.1779 0 13ZM13 1.85714C6.84636 1.85714 1.85714 6.84636 1.85714 13C1.85714 19.1564 6.84636 24.1429 13 24.1429C19.1536 24.1429 24.1429 19.1564 24.1429 13C24.1429 6.84636 19.1536 1.85714 13 1.85714ZM19.2093 8.61068C19.5816 8.96261 19.5983 9.55039 19.2464 9.92368L12.2301 17.355C12.0556 17.5407 11.8113 17.6429 11.555 17.6429C11.2997 17.6429 11.0555 17.5407 10.88 17.355L6.75342 12.9824C6.40149 12.6091 6.41819 12.0213 6.79054 11.6694C7.16383 11.3175 7.75162 11.3342 8.10354 11.7065L11.555 15.3586L17.8963 8.6478C18.2482 8.27544 18.836 8.25875 19.2093 8.61068Z"
                      fill="#11C8D9"
                    />
                  </svg>
                )}

                <span className="block text-f20 font-medium leading-110">
                  {video.name}
                </span>
              </div>
              <div className="flex flex-row gap-2.5 justify-end">
                <button
                  onClick={() => handleDelete(video, index)}
                  className="bg-main-accent/20 flex justify-center items-center rounded-full min-w-[2.8125rem] w-[2.8125rem] h-[2.8125rem]"
                >
                  <svg
                    className="w-6"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="fill-[#01CACC]"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.56 2.46C6.56 1.10126 7.66126 0 9.02 0H13.94C15.2987 0 16.4 1.10126 16.4 2.46V3.28H22.14C22.5926 3.28 22.96 3.64736 22.96 4.1C22.96 4.55264 22.5926 4.92 22.14 4.92H20.5V18.86C20.5 21.124 18.664 22.96 16.4 22.96H6.56C4.29598 22.96 2.46 21.124 2.46 18.86V4.92H0.82C0.36736 4.92 0 4.55264 0 4.1C0 3.64736 0.36736 3.28 0.82 3.28H6.56V2.46ZM8.2 3.28H14.76V2.46C14.76 2.00736 14.3926 1.64 13.94 1.64H9.02C8.56736 1.64 8.2 2.00736 8.2 2.46V3.28ZM4.1 4.92V18.86C4.1 20.2187 5.20126 21.32 6.56 21.32H16.4C17.7587 21.32 18.86 20.2187 18.86 18.86V4.92H4.1ZM11.48 7.38C11.9326 7.38 12.3 7.74736 12.3 8.2V18.04C12.3 18.4926 11.9326 18.86 11.48 18.86C11.0274 18.86 10.66 18.4926 10.66 18.04V8.2C10.66 7.74736 11.0274 7.38 11.48 7.38Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => openPopup(video)}
                  className={`flex justify-center items-center rounded-full min-w-[2.8125rem] w-[2.8125rem] h-[2.8125rem] ${
                    loadingName === video.name
                      ? "bg-main-accent/10 pointer-events-none"
                      : "bg-main-accent/20"
                  }`}
                >
                  <svg
                    className="w-[1.375rem]"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className={
                        loadingName === video.name
                          ? "fill-[#01CACC]/20"
                          : "fill-[#01CACC]"
                      }
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.3702 1.80974C15.1158 0.0634192 17.9471 0.0634192 19.6927 1.80974C21.439 3.55531 21.439 6.38595 19.6927 8.13228L7.82539 19.9996H20.2886C20.7034 19.9996 21.04 20.3355 21.04 20.7511C21.04 21.1659 20.7034 21.5025 20.2886 21.5025H0.75143C0.336641 21.5025 0 21.1659 0 20.7511V15.4911C0 15.2919 0.0789225 15.1003 0.220191 14.9598L13.3702 1.80974ZM5.70035 19.9996L15.8447 9.85533L11.6472 5.65784L1.50286 15.8021V19.9996H5.70035ZM12.7097 4.59532L16.9072 8.7928L18.6302 7.06975C19.7889 5.9103 19.7889 4.03097 18.6302 2.87227C17.4708 1.71281 15.5921 1.71281 14.4327 2.87227L12.7097 4.59532Z"
                    />
                  </svg>
                </button>
                <a
                  href={`${BASE_URL}${video.resultVideo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex justify-center items-center rounded-full min-w-[2.8125rem] w-[2.8125rem] h-[2.8125rem] ${
                    loadingName === video.name
                      ? "bg-main-accent/20 pointer-events-none"
                      : "bg-main-accent"
                  }`}
                >
                  <svg
                    className="w-6"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.51161 14.0241L11.8688 19.3812C12.217 19.7303 12.783 19.7303 13.1312 19.3812L18.4883 14.0241C18.8375 13.6759 18.8375 13.1098 18.4883 12.7616C18.1401 12.4125 17.5741 12.4125 17.2259 12.7616L13.3928 16.5946V0.892857C13.3928 0.4 12.9928 0 12.5 0C12.0071 0 11.6071 0.4 11.6071 0.892857V16.5946L7.77406 12.7616C7.42585 12.4125 6.85983 12.4125 6.51161 12.7616C6.16251 13.1098 6.16251 13.6759 6.51161 14.0241ZM1.78571 16.0714C1.78571 15.5786 1.38571 15.1786 0.892857 15.1786C0.4 15.1786 0 15.5786 0 16.0714V20.5357C0 23.0009 1.99911 25 4.46429 25H20.5357C23.0009 25 25 23.0009 25 20.5357V16.0714C25 15.5786 24.6 15.1786 24.1071 15.1786C23.6143 15.1786 23.2143 15.5786 23.2143 16.0714V20.5357C23.2143 22.0152 22.0152 23.2143 20.5357 23.2143H4.46429C2.98482 23.2143 1.78571 22.0152 1.78571 20.5357V16.0714Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </SwiperSlide>
      </Swiper>
      {showEditPopup && selectedVideo && (
        <EditAiPopup
          video={selectedVideo}
          onClose={closePopup}
          doctorId={doctorId}
          setLoadingName={setLoadingName}
          onSuccess={() => {
            updateVideos();
            setShowEditPopup(false);
          }}
        />
      )}
      {showCreationPopup && (
        <CreationPopup
          doctorId={doctorId}
          setLoadingName={setLoadingName}
          onClose={() => setShowCreationPopup(false)}
          onSuccess={() => {
            updateVideos();
            setShowCreationPopup(false);
          }}
          setShowSuccess={setShowSuccess}
        />
      )}
      {showSuccess && <AiSuccess onClose={() => setShowSuccess(false)} />}

      {showDeletePopup && (
        <DeleteAi
          onConfirm={confirmDelete}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </div>
  );
};

export default AiBlock;
