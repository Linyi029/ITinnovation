import React, { useEffect,useState } from "react";
import {useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "LOGIN | PUZZLE";
  }, []);
  const toRegister = () => {
    navigate("/Register");
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);
    // 實際上你可以在這裡呼叫 API 或導向頁面
    navigate("/Main");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-[url('/images/lgin_bg2.jpg')] bg-opacity-80">
      <div className="w-full max-w-md space-y-6 bg-[#cdd5d2] p-10 rounded">

        {/* 選擇login or register的頁面 */}
        <div className="flex justify-center space-x-2">
          <button className="w-1/2 py-2 rounded bg-lime-100 text-stone-700 font-semibold">LOGIN</button>
          <button className="w-1/2 py-2 rounded bg-gray-100 text-gray-500 font-semibold" onClick={toRegister}>REGISTER</button>
        </div>

        {/* 分隔線 */}
        <div className="text-center text-slate-800 text-sm">請輸入帳號密碼</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 輸入email的input */}
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email or username"
            className="w-full border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          />
          {/* 輸入password的input */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          />

          {/* Remember me / Forgot password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="accent-slate-600"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-lime-800 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-lime-700 text-white font-semibold py-2 rounded hover:bg-lime-800 transition"
          >
            SIGN IN
          </button>
        </form>

        {/* 註冊提示(點擊導向register.jsx) */}
        <div className="text-center text-sm text-gray-700">
          Not a member?{" "}
          <a href="#" className="text-lime-800 hover:underline" onClick={toRegister}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
