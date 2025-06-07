import { useEffect, useState } from 'react';
import { Link, useParamsc} from 'react-router-dom';

export default function SolvedPuzzle() {
  useEffect(() => {
    document.title = "QUESTION | PUZZLE";
  }, []);
  // 儲存謎題資料，初始為空值，後續透過 API 回傳資料補上
  const [puzzleData, setPuzzleData] = useState({
    title: '',       // 題目標題
    labels: [],      // 題目標籤 
    author: '',      // 題目作者名稱
    question: '',    // 題目內容
    hint: '',        // 提示（點擊 Hint 後取得）
    answer: '',      // 答案（點擊 Answer 後取得）
  });

  // 儲存目前登入使用者資訊，用於右上角個人區塊顯示
  const [userData, setUserData] = useState({
    username: '',
    avatar: '',
    statusMsg: '',
  });

  // 控制提示/答案 Modal 顯示的開關
  const [isHintOpen, setHintOpen] = useState(false);
  const [isAnswerOpen, setAnswerOpen] = useState(false);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // 從網址中取得 puzzleId，例如 /solved/123 中的 "123"
  const { id: puzzleId } = useParams();

  // 初始化頁面時，從後端 API 請求謎題與使用者資料
  useEffect(() => {
    async function fetchInitialData() {
      try {
        // GET /api/puzzle/:puzzleId
        // 取得謎題的標題、標籤、作者、題目內容
        const puzzleRes = await fetch(`/api/puzzle/${puzzleId}`);
        const puzzleJson = await puzzleRes.json();
        setPuzzleData((prev) => ({ ...prev, ...puzzleJson }));

        // GET /api/user/profile
        // 取得目前登入使用者資訊，右上角顯示用
        const userRes = await fetch(`/api/user/profile`);
        const userJson = await userRes.json();
        setUserData(userJson);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    }

    fetchInitialData();
  }, [puzzleId]);

  // 點擊 Hint 按鈕，發送請求取得提示
  const handleHintClick = async () => {
    try {
      setHintOpen(true);
      setIsLoadingHint(true);

      // GET /api/puzzle/:puzzleId/hint
      // 回傳格式：{ hint: string }
      const res = await fetch(`/api/puzzle/${puzzleId}/hint`);
      const data = await res.json();

      setPuzzleData((prev) => ({
        ...prev,
        hint: data.hint || '',
      }));
    } catch (error) {
      console.error('Failed to fetch hint:', error);
      setPuzzleData((prev) => ({ ...prev, hint: 'No hint available.' }));
    } finally {
      setIsLoadingHint(false);
    }
  };

  // 點擊 Answer 按鈕，發送請求取得答案（僅第一次點擊會請求）
  const handleAnswerClick = async () => {
    try {
      setAnswerOpen(true);

      if (!puzzleData.answer) {
        // GET /api/puzzle/:puzzleId/answer
        // 回傳格式：{ answer: string }
        const res = await fetch(`/api/puzzle/${puzzleId}/answer`);
        const data = await res.json();

        setPuzzleData((prev) => ({
          ...prev,
          answer: data.answer || '',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch answer:', error);
      setPuzzleData((prev) => ({ ...prev, answer: 'No answer available.' }));
    }
  };

  // 共用的按鈕樣式
  const btnStyle =
    'bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 active:scale-95 transition duration-150';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray relative p-4">
      {/*  使用者資訊區塊（右上角） */}
      {/* 需要後端提供 avatar, username, statusMsg */}
      <Link to="/User" className="absolute top-6 right-6"> 
        <button className="flex items-center space-x-6 bg-gray p-3 rounded">
          <img
            src={userData.avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full"
          />
          <div className="flex flex-col justify-center text-left">
            <h2 className="text-xl font-bold">{userData.username}</h2>
          </div>
        </button>
      </Link>

      {/* 謎題內容顯示區塊 */}
      <div className="bg-customGray flex items-center justify-center w-full max-w-6xl h-auto min-h-[30rem] rounded-lg">
        <div className="bg-customGray flex flex-col justify-between p-6 w-full h-full bg-white shadow-lg">
          
          {/* 標題與標籤 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">{puzzleData.title}</h1>
            <div className="flex flex-wrap gap-2">
              {puzzleData.labels.map((label, index) => (
                <label
                  key={index}
                  className={`${
                    index === 0
                      ? 'bg-slate-500 text-white'
                      : 'bg-slate-50 text-black'
                  } px-4 py-2 rounded`}
                >
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* 顯示作者名稱 */}
          <p className="text-lg text-gray-600 mb-2">
            Author: {puzzleData.author}
          </p>

          {/* 顯示題目內容 */}
          <div className="overflow-y-auto mb-4 flex-1">
            <p className="text-lg text-gray-600">
              <strong>Question:</strong> {puzzleData.question}
            </p>
          </div>

          {/* 顯示 Hint 與 Answer 按鈕 */}
          <div className="flex justify-start items-center gap-4">
            <button onClick={handleHintClick} className={btnStyle}>
              Hint
            </button>
            <button onClick={handleAnswerClick} className={btnStyle}>
              Answer
            </button>
          </div>
        </div>
      </div>

      {/*  Hint Modal：點擊 Hint 按鈕後出現 */}
      {isHintOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Hint</h2>
            {isLoadingHint ? (
              <p className="text-gray-700 mb-4 text-center">Loading hint...</p>
            ) : (
              <p className="text-gray-700 mb-4">
                {puzzleData.hint || 'No hint available.'}
              </p>
            )}
            <div className="flex justify-center">
              <button onClick={() => setHintOpen(false)} className={btnStyle}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  Answer Modal：點擊 Answer 按鈕後出現 */}
      {isAnswerOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Answer</h2>
            <p className="text-gray-700 mb-4">{puzzleData.answer}</p>
            <div className="flex justify-center">
              <button onClick={() => setAnswerOpen(false)} className={btnStyle}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
