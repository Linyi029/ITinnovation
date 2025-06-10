import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router-dom';
import UserInfoButton from '../components/common/UserInfoButton';
import {getAttemptedPuzzles, getMyPuzzles} from '../lib/provider';


export default function User() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "USER | PUZZLE";
  }, []);

  // 儲存從後端取得的解題紀錄陣列
  const [solvingAttempts, setSolvingAttempts] = useState([]);

  // 儲存從後端取得的使用者創建的謎題陣列
  const [createdPuzzles, setCreatedPuzzles] = useState([]);

  // 儲存使用者基本資料
  const [userProfile, setUserProfile] = useState({
    username: "",   // 使用者名稱
    avatar: "",     // 使用者頭像圖片 URL
    statusMsg: "",  // 狀態訊息（自我介紹或個人簽名）
  });

  const [isLoading, setIsLoading] = useState(true);  // 載入狀態
  const [error, setError] = useState(null);          // 錯誤處理

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // ❌ 不再用 fetch('/api/puzzle/attempts')
        const attemptsData = await getAttemptedPuzzles(); // ✅ 使用 provider function
        setSolvingAttempts(attemptsData);

        // ❌ 不再用 fetch('/api/puzzle/created')
        const createdData = await getMyPuzzles(); // ✅ 使用 provider function
        setCreatedPuzzles(createdData);

        // 🟡（如果你之後要補回 userProfile，這裡可以額外 fetch 或加到 provider 裡）
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // === UI：載入中狀態 ===
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray p-8 flex items-center justify-center  bg-[url('/images/lgin_bg2.jpg')]">
        <p>Loading data...</p>
      </div>
    );
  }

  // === UI：錯誤狀態 ===
  if (error) {
    return (
      <div className="min-h-screen bg-gray p-8 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // === UI：成功取得資料後渲染主頁內容 ===
  return (
    <div className="min-h-screen bg-gray p-8 bg-[url('/images/lgin_bg2.jpg')]">
      
      {/* 頁首：包含返回首頁按鈕與使用者個人資訊，這裡link要改 */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150"
          >
            Homepage
          </Link>
        </div>

        {/* 使用者頭像與資料 */}
        <UserInfoButton />
      </div>

      {/* 內容區塊：左邊是解題紀錄，右邊是創建的謎題 */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* CreatePuzz中的getAttemptedPuzzles() */}
        <Card 
          title="Puzzle Solving Attempts" 
          items={solvingAttempts} 
          emptyMessage="No puzzle attempts yet"
        />
        {/* CreatePuzz中的getMyPuzzles() */}
        <Card 
          title="Created Puzzles" 
          items={createdPuzzles} 
          emptyMessage="No puzzles created yet"
        />
      </div>
    </div>
  );
}

// 重複使用於解題紀錄與創建謎題
function Card({ title, items, emptyMessage }) {
  return (
    <div className="bg-customGray rounded-lg shadow p-6 w-full md:w-1/2 h-[500px] flex flex-col bg-white">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {/* 如果有資料，就逐筆列出，否則顯示提示文字 */}
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex justify-between items-start border-b pb-2">
              <div>
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
                {/* 顯示狀態標籤（如果有提供） */}
                {item.status && (
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                    {item.status}
                  </span>
                )}
              </div>
              {/* 點擊進入該謎題詳細頁 這裡link要改 */}
              <Link
                to={item.status === "active" 
                  ? `/UnverifiedPuzzle/${item.id}` 
                  : `/VerifiedPuzzle/${item.id}`
                }
                className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150"
              >
                {item.status === "active" ? "Active" : "Finish => create NFT"}
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
