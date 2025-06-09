import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router-dom';
import UserInfoButton from '../components/common/UserInfoButton';


export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "USER | PUZZLE";
  }, []);
  // 用 state 管理資料，方便未來串API
  const [solvingAttempts, setSolvingAttempts] = useState([]);
  const [createdPuzzles, setCreatedPuzzles] = useState([]);
  const [userProfile, setUserProfile] = useState({
    username: "",
    avatarUrl: "",
    statusMessage: "",
  });


  useEffect(() => {
    // 模擬抓資料，之後改成 fetch 從後端拿資料
    setSolvingAttempts([
      {
        id: 1,
        title: "Puzzle#1",
        status: "verified",
        reward: "XXX PUZ",
        desc: "Received XXX PUZ.",
      },
      {
        id: 5,
        title: "Puzzle#5",
        status: "failed",
        desc: "This is still unsolved, try again?",
      },
      {
        id: 4,
        title: "Puzzle#4",
        status: "failed",
        solvedBy: "user456",
        desc: "This puzzle is solved by user456. View answer?",
      },
    ]);

    setCreatedPuzzles([
      {
        id: 1,
        title: "Puzzle#1",
        status: "solved_verified",
        desc: "Solved and verified.",
      },
      {
        id: 2,
        title: "Puzzle#2",
        status: "solved_unverified",
        desc: "Solved, unverified.",
      },
      {
        id: 5,
        title: "Puzzle#5",
        status: "unsolved",
        prizePool: "1000 PUZ",
        desc: "Unsolved. Prize pool has stacked up to 1000PUZ now!",
      },
    ]);

    setUserProfile({
      username: "ho5hi_kwon",
      avatarUrl:
        "https://upload.wikimedia.org/wikipedia/commons/b/b7/221014_HOSHI_%28SEVENTEEN%29.jpg",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray p-8  bg-[url('/images/lgin_bg2.jpg')]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150"
          >
            Homepage
          </Link>
        </div>

        {/* 右側頭像 + 名稱 + 狀態訊息 */}
        <UserInfoButton />
      </div>

      {/* 兩個卡片並排 */}
      <div className="flex space-x-6">
        {/* CreatePuzz中的getAttemptedPuzzles() */}
        <Card title="Puzzle Solving Attempts" items={solvingAttempts} />
        {/* CreatePuzz中的getMyPuzzles() */}
        <Card title="Created Puzzles" items={createdPuzzles} />
      </div>
    </div>
  );
}

// 接收Card，title跟 items陣列，渲染每筆資料
function Card({ title, items }) {
  return (
    <div className="bg-customGray rounded-lg shadow p-6 w-1/2 h-[500px] flex flex-col bg-white">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start border-b pb-2">
            <div>
              <p className="font-medium text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150">
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
