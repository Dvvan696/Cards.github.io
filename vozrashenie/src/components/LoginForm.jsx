import React, { useState } from "react";

const LoginForm = ({ onLogin, error }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(login, password);
  };

  React.useEffect(() => {
    if (error === "Введен неверный логин") {
      setLoginError(true);
      setPasswordError(false);
    } else if (error === "Введен неверный пароль") {
      setLoginError(false);
      setPasswordError(true);
    } else {
      setLoginError(false);
      setPasswordError(false);
    }
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center gap-24 pt-10 pb-28 min-h-[100vh] mob:gap-12">
      <img
        className="w-[28.6rem] object-contain mob:w-80"
        src={`${process.env.PUBLIC_URL}/logo.svg`}
        alt=""
      />
      <div className="bg-white rounded-35 mob:rounded-20 px-10 py-10 min-w-[29rem] mob:min-w-[90%] mob:p-6">
        <span className="text-f32 font-bold mb-8 text-center block">
          Авторизация
        </span>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <input
              className={`w-full bg-main-accent/10 outline-none p-3 px-6 text-f15 mob:text-f20 rounded-10 ${
                loginError ? "bg-red-200" : ""
              }`}
              type="text"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              className={`w-full bg-main-accent/10 outline-none p-3 px-6 text-f15 rounded-10 mob:text-f20 ${
                passwordError ? "bg-red-200" : ""
              }`}
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className=" p-3 px-[5.5rem] w-fit mx-auto text-white bg-main-accent rounded-10 text-f15 mob:text-f20 font-medium"
            type="submit"
          >
            Войти
          </button>
          <div className="min-h-4">
            {error && <div className="text-f12 text-center ">{error}</div>}
          </div>
        </form>
      </div>
      <a className="text-f15 underline" href="/privacy/">
        Политика конфиденциальности
      </a>
    </div>
  );
};

export default LoginForm;
