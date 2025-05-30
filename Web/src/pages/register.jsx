import React, { useEffect, useState } from "react";
import {useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "REGISTER | PUZZLE";
  }, []);
    const toLogin = () => {
      navigate("/");
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
    console.log("Register form submitted:", formData);
    // 實際上你可以在這裡呼叫 API 或導向頁面
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-[url('/images/lgin_bg2.jpg')] bg-opacity-80">
      <div className="w-full max-w-md space-y-6 bg-[#cdd5d2] p-10 rounded">

        {/* 選擇login or register的頁面 */}
        <div className="flex justify-center space-x-2">
          <button className="w-1/2 py-2 rounded bg-gray-100 text-gray-500 font-semibold" onClick={toLogin}>LOGIN</button>
          <button className="w-1/2 py-2 rounded bg-lime-100 text-stone-700 font-semibold">REGISTER</button>
        </div>

        {/* 分隔線 */}
        <div className="text-center text-slate-800 text-sm">請輸入帳號資料</div>

        {/* 表單 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 輸入username的input */}
          <input
            type="text"
            name="username"
            value={formData.email}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          />
          {/* 輸入email的input */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
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
          {/* reenter email的input */}
          <input
            type="password"
            name="passwordRepeat"
            value={formData.email}
            onChange={handleChange}
            placeholder="Repeat Password"
            className="w-full border border-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:ring focus:border-blue-500"
            required
          />

          {/* sign up button */}
          
          <button
            type="submit"
            className="w-full bg-lime-700 text-white font-semibold py-2 rounded hover:bg-lime-800 transition"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
