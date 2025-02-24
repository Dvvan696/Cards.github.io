import React, { useState, useEffect } from "react";
import axios from "axios";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import BASE_URL from "../config";

const CreationPopup = ({
  onClose,
  doctorId,
  setLoadingName,
  onSuccess,
  setShowSuccess,
}) => {
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [originalAudio, setOriginalAudio] = useState(null);
  const [originalVideo, setOriginalVideo] = useState(null);
  const [response, setResponse] = useState("");
  const [ffmpeg, setFFmpeg] = useState(null);

  useEffect(() => {
    // Инициализация FFmpeg
    const initFFmpeg = async () => {
      const ffmpegInstance = new FFmpeg({ log: true });
      await ffmpegInstance.load();
      setFFmpeg(ffmpegInstance);
    };

    initFFmpeg();
  }, []);

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingName(name);
    const formData = new FormData();
    formData.append("DoctorID", doctorId);
    formData.append("Name", name);
    formData.append("OriginalPhoto", originalPhoto);
    formData.append("OriginalAudio", originalAudio);
    formData.append("OriginalVideo", originalVideo);

    try {
      // Выполняем первый запрос
      const res = await axios.post(
        `${BASE_URL}UploadVideoCache.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(res.data);

      if (res.data) {
        // Обновляем список и показываем новый элемент как загружающийся
        if (onSuccess) onSuccess();

        // Продолжаем выполнение остальных запросов
        handleSubmitLivePortrait();
      } else {
        setError("Произошла ошибка при загрузке видео.");
      }
    } catch (error) {
      console.error("Произошла ошибка при отправке формы", error);
      setResponse("Произошла ошибка при отправке формы");
    }
  };

  const handleSubmitLivePortrait = async () => {
    setError(null);

    const imagePath = originalPhoto;
    const videoUrl = `${BASE_URL}DoctorVideos/${doctorId}/${name}/originalVideo.mp4`;

    const formData = new FormData();
    formData.append("face_image", imagePath);
    formData.append("driving_video", videoUrl);

    try {
      const response = await fetch(`${BASE_URL}LivePortrait.php`, {
        method: "POST",
        body: formData,
      });

      const resultData = await response.json();

      if (response.ok) {
        const resultVideoFile = `${BASE_URL}${resultData.download_link}`;

        handleAudioCloneSubmit(resultVideoFile);
      } else {
        setError(resultData.error || "Что-то пошло не так");
      }
    } catch (err) {
      setError(`Произошла ошибка: ${err.message}`);
    }
  };

  const handleAudioCloneSubmit = async (resultVideoFile) => {
    setError(null);
    const sourceAudioUrl = `${BASE_URL}DoctorVideos/${doctorId}/${name}/originalAudio.mp3`;
    const targetAudioUrl = `${BASE_URL}DoctorVideos/${doctorId}/${name}/originalVideo.mp4`;

    try {
      const response = await axios.post(
        `${BASE_URL}audioclone.php`,
        new URLSearchParams({
          source_audio_url: sourceAudioUrl,
          target_audio_url: targetAudioUrl,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const sanitizedAudioLink = `${BASE_URL}${response.data.download_link}`;

      // Обработать видео после клонирования аудио
      await handleVideoProcessing(resultVideoFile, sanitizedAudioLink);
    } catch (err) {
      setError("Ошибка при отправке данных на AudioClone API: " + err.message);
    }
  };

  const handleVideoProcessing = async (resultVideoFile, sanitizedAudioLink) => {
    if (!ffmpeg) {
      setError("FFmpeg не загружен");
      return;
    }

    try {
      const videoBlob = await fetchFile(resultVideoFile);
      const audioBlob = await fetchFile(sanitizedAudioLink);

      // Запись файлов в файловую систему FFmpeg
      await ffmpeg.writeFile("input.mp4", videoBlob);
      await ffmpeg.writeFile("input.mp3", audioBlob);

      // Выполнение команды объединения
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-i",
        "input.mp3",
        "-c:v",
        "copy",
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "output.mp4",
      ]);

      // Чтение и сохранение результата
      const data = await ffmpeg.readFile("output.mp4", "binary");
      const mergedBlob = new Blob([data.buffer], { type: "video/mp4" });

      // Создание файла из Blob
      const mergedFile = new File([mergedBlob], "resultVideo.mp4", {
        type: "video/mp4",
      });

      // Отправить обработанное видео как файл
      await handleFinalSubmit(mergedFile);
    } catch (err) {
      console.error("Ошибка при обработке видео:", err);
    }
  };

  // Функция для повторной отправки данных
  const handleFinalSubmit = async (mergedFile) => {
    const formData = new FormData();
    formData.append("DoctorID", doctorId);
    formData.append("Name", name);
    formData.append("OriginalPhoto", originalPhoto);
    formData.append("OriginalAudio", originalAudio);
    formData.append("OriginalVideo", originalVideo);
    formData.append("ResultVideo", mergedFile);

    try {
      const res = await axios.post(
        `${BASE_URL}UploadVideoCache.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Ошибка при повторной отправке:", error);
      setResponse("Произошла ошибка при повторной отправке");
    } finally {
      setLoadingName(null);
      setShowSuccess(true);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-full z-50 backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-35 mob:rounded-20 p-8 px-16 w-[32.5rem]">
        <h3 className="text-main-accent text-f32 block font-bold text-center mb-8">
          Создание образа
        </h3>
        <p className="mb-8 text-f20 text-center m-auto leading-130">
          Введите название образа и загрузите файлы
        </p>

        <div>
          <div>
            <form
              className="flex flex-col gap-2.5 mb-2.5"
              onSubmit={handleSubmit}
            >
              <div>
                <input
                  className="bg-main-accent/10 w-full rounded-10 p-3 px-6 outline-none"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Имя"
                />
              </div>
              <div className="grid gap-3 grid-cols-3 ">
                <div className="bg-main-accent/20 border-1 border-main-accent/20 rounded-10 h-32 flex justify-center items-center relative">
                  {originalPhoto ? (
                    <img
                      src={URL.createObjectURL(originalPhoto)}
                      alt="Фото"
                      className="w-full h-full object-cover rounded-10"
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center gap-1 text-center text-f14 ">
                      <svg
                        className="w-4"
                        viewBox="0 0 16 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.51195 1.07143C2.62427 1.07143 1.9048 1.79089 1.9048 2.67857V8.88536L4.20464 6.58555C4.41357 6.37609 4.75318 6.37609 4.96211 6.58555L9.13694 10.7604L11.7046 8.19269C11.9136 7.98323 12.2532 7.98323 12.4621 8.19269L14.7619 10.4925V2.67857C14.7619 1.79089 14.0425 1.07143 13.1548 1.07143H3.51195ZM15.8334 2.67857C15.8334 1.19946 14.6339 0 13.1548 0H3.51195C2.03284 0 0.833374 1.19946 0.833374 2.67857V12.3214C0.833374 13.8005 2.03284 15 3.51195 15H13.1548C14.6339 15 15.8334 13.8005 15.8334 12.3214V2.67857ZM14.7619 12.0075L12.0834 9.32893L9.89445 11.5179L12.3052 13.9286H13.1548C14.0425 13.9286 14.7619 13.2091 14.7619 12.3214V12.0075ZM10.7902 13.9286L4.58337 7.72179L1.9048 10.4004V12.3214C1.9048 13.2091 2.62427 13.9286 3.51195 13.9286H10.7902ZM11.5477 3.21429C10.9557 3.21429 10.4762 3.69375 10.4762 4.28571C10.4762 4.87768 10.9557 5.35714 11.5477 5.35714C12.1396 5.35714 12.6191 4.87768 12.6191 4.28571C12.6191 3.69375 12.1396 3.21429 11.5477 3.21429ZM9.4048 4.28571C9.4048 3.10232 10.3643 2.14286 11.5477 2.14286C12.7311 2.14286 13.6905 3.10232 13.6905 4.28571C13.6905 5.46911 12.7311 6.42857 11.5477 6.42857C10.3643 6.42857 9.4048 5.46911 9.4048 4.28571Z"
                          fill="black"
                        />
                      </svg>
                      Загрузите фото
                    </div>
                  )}
                  <input
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    type="file"
                    accept=".jpg, .jpeg, .png, .heic"
                    onChange={(e) => handleFileChange(e, setOriginalPhoto)}
                    required
                  />
                </div>
                <div className="bg-main-accent/20 border-1 border-main-accent/20 text-center rounded-10 h-32 flex justify-center items-center relative">
                  <div className="flex flex-col justify-center items-center gap-1 text-center text-f14 ">
                    <svg
                      className="w-4"
                      viewBox="0 0 16 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.5 0.535748C15.5 0.368605 15.4197 0.210558 15.2911 0.109308C15.1572 0.00805799 14.9803 -0.0251395 14.8196 0.0193247L5.17677 2.6979C4.94642 2.76272 4.78571 2.97378 4.78571 3.21432V10.1786C4.33571 9.84218 3.78393 9.64289 3.17857 9.64289C1.7 9.64289 0.5 10.8424 0.5 12.3215C0.5 13.8006 1.7 15 3.17857 15C4.65714 15 5.85714 13.8006 5.85714 12.3215C5.85714 12.2593 5.85714 12.1972 5.85178 12.1361C5.85714 12.1093 5.85714 12.0815 5.85714 12.0536V3.62147L14.4286 1.24074V8.57146C13.9786 8.23503 13.4268 8.03575 12.8214 8.03575C11.3429 8.03575 10.1429 9.23521 10.1429 10.7143C10.1429 12.1934 11.3429 13.3929 12.8214 13.3929C14.3 13.3929 15.5 12.1934 15.5 10.7143C15.5 10.5884 15.4893 10.4642 15.4732 10.3425C15.4893 10.2911 15.5 10.2359 15.5 10.1786V0.535748ZM12.8214 9.10718C11.9321 9.10718 11.2143 9.82664 11.2143 10.7143C11.2143 11.602 11.9321 12.3215 12.8214 12.3215C13.7107 12.3215 14.4286 11.602 14.4286 10.7143C14.4286 9.82664 13.7107 9.10718 12.8214 9.10718ZM3.17857 10.7143C2.28929 10.7143 1.57143 11.4338 1.57143 12.3215C1.57143 13.2091 2.28929 13.9286 3.17857 13.9286C4.06786 13.9286 4.78571 13.2091 4.78571 12.3215C4.78571 11.4338 4.06786 10.7143 3.17857 10.7143Z"
                        fill="black"
                      />
                    </svg>
                    {originalAudio ? (
                      <p>
                        {originalAudio.name.length > 11
                          ? originalAudio.name.substring(0, 11) + "..."
                          : originalAudio.name}
                      </p>
                    ) : (
                      "Загрузите аудио"
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".mp3"
                    onChange={(e) => handleFileChange(e, setOriginalAudio)}
                    required
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="bg-main-accent/20 border-1 border-main-accent/20 text-center rounded-10 h-32 flex justify-center items-center relative">
                  <div className="flex flex-col justify-center items-center gap-1 text-center text-f14 ">
                    <svg
                      className="w-4"
                      viewBox="0 0 16 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.166504 2.67857C0.166504 1.19946 1.3665 0 2.84508 0H12.4879C13.9665 0 15.1665 1.19946 15.1665 2.67857V12.3214C15.1665 13.8005 13.9665 15 12.4879 15H2.84508C1.3665 15 0.166504 13.8005 0.166504 12.3214V2.67857ZM14.0951 12.3214V10.7143H11.4165V13.9286H12.4879C13.3772 13.9286 14.0951 13.2091 14.0951 12.3214ZM14.0951 5.35714V9.64286H11.4165V5.35714H14.0951ZM14.0951 4.28571V2.67857C14.0951 1.79089 13.3772 1.07143 12.4879 1.07143H11.4165V4.28571H14.0951ZM10.3451 4.81554V1.07143H4.98793V13.9286H10.3451V10.1823V10.1786V10.1748V4.82731C10.3451 4.82517 10.3451 4.82357 10.3451 4.82143C10.3451 4.81929 10.3451 4.81769 10.3451 4.81554ZM3.9165 13.9286V10.7143H1.23793V12.3214C1.23793 13.2091 1.95579 13.9286 2.84508 13.9286H3.9165ZM3.9165 5.35714V9.64286H1.23793V5.35714H3.9165ZM3.9165 4.28571V1.07143H2.84508C1.95579 1.07143 1.23793 1.79089 1.23793 2.67857V4.28571H3.9165Z"
                        fill="black"
                      />
                    </svg>{" "}
                    {originalVideo ? (
                      <p>
                        {originalVideo.name.length > 11
                          ? originalVideo.name.substring(0, 11) + "..."
                          : originalVideo.name}
                      </p>
                    ) : (
                      "Загрузите видео"
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".mp4, .mov"
                    onChange={(e) => handleFileChange(e, setOriginalVideo)}
                    required
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <button
                  className="bg-main-accent/20 text-f15 rounded-10 p-3.5 w-full"
                  onClick={onClose}
                >
                  Отменить
                </button>
                <button
                  type="submit"
                  className="bg-main-accent text-white text-f15 rounded-10 p-3.5 w-full"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>

        {error}
      </div>
    </div>
  );
};

export default CreationPopup;
