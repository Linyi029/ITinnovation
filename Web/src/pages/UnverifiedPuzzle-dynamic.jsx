import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPuzzleById } from '../lib/provider';


export default function UnsolvedPuzzle() {
  const navigate = useNavigate();
  const { id: puzzleId } = useParams(); 
  useEffect(() => {
    document.title = "SOLVE THE QUESTION | PUZZLE";
  }, []);

  // 謎題狀態
  const [puzzleData, setPuzzleData] = useState({
    id: null,
    title: '',       // 謎題標題
    author: '',      // 作者名稱
    question: '',    // 謎題內容
    labels: [],      // 標籤分類
  });

  // 用戶資料狀態
  const [userData, setUserData] = useState({
    username: '',    // 用戶名
    avatar: '',      // 頭像URL
    statusMsg: '',   // 狀態訊息
  });

  // 時間
  const [timeInfo, setTimeInfo] = useState({
    statusMsg: '',   // 剩餘時間訊息
  });

  // 提示相關狀態
  const [isHintOpen, setHintOpen] = useState(false);  // 是否顯示提示彈窗
  const [hintText, setHintText] = useState('');       // 提示內容
  const [isLoadingHint, setLoadingHint] = useState(false); // 正在加載提示

  // 嘗試回答相關狀態
  const [isRetryOpen, setRetryOpen] = useState(false);    // 是否顯示嘗試彈窗
  const [retryAnswer, setRetryAnswer] = useState('');     // 用戶輸入的答案
  const [retryError, setRetryError] = useState('');       // 錯誤訊息

  // 按鈕基礎樣式
  const btnStyle =
    'bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 active:scale-95 transition duration-150';

  // 獲取謎題資料的API請求
  // const fetchPuzzle = async () => {
  //   try {
  //     const res = await fetch(`/api/puzzle/${puzzleId}`);
  //     if (!res.ok) throw new Error('Failed to fetch hint:');
  //     const data = await res.json();
  //     setPuzzleData({
  //       id: data.id,
  //       title: data.title,
  //       author: data.author,
  //       question: data.question,
  //       labels: data.labels || [],
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     // 失敗時重置謎題
  //     setPuzzleData({
  //       id: null,
  //       title: '',
  //       author: '',
  //       question: '',
  //       labels: [],
  //     });
  //   }
  // };

  const fetchPuzzle = async () => {
    try {
      const data = await getPuzzleById(puzzleId);
      setPuzzleData(data);
    } catch (error) {
      console.error("Error fetching puzzle from contract:", error);
      setPuzzleData({
        id: null,
        title: '',
        author: '',
        question: '',
        labels: [],
      });
    }
  };

  // 獲取用戶資料的API請求
  // const fetchUserProfile = async () => {
  //   try {
  //     const res = await fetch('/api/user/profile');
  //     if (!res.ok) throw new Error('Failed to fetch User');
  //     const data = await res.json();
  //     setUserData({
  //       username: data.username,
  //       avatar: data.avatar,
  //       statusMsg: data.statusMsg,
  //     });
  //   } catch (error) {
  //     console.error(error);
      // 失敗時設置默認值
  //     setUserData({
  //       username: 'Unknown User',
  //       avatar: '',
  //       statusMsg: '',
  //     });
  //   }
  // };

  // 獲取時間資訊的API請求
  // const fetchTimeInfo = async () => {
  //   try {
  //     const res = await fetch('/api/time/info');
  //     if (!res.ok) throw new Error('Failed to fetch time');
  //     const data = await res.json();
  //     setTimeInfo({
  //       statusMsg: data.statusMsg || '',
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     setTimeInfo({
  //       statusMsg: 'time error',
  //     });
  //   }
  // };

  // 獲取提示的API請求
  // const fetchHint = async () => {
  //   if (!puzzleId) return;
  //   setLoadingHint(true);
  //   try {
  //     const res = await fetch(`/api/puzzle/${puzzleId}/hint`);
  //     if (!res.ok) throw new Error('Failed to fetch hint');
  //     const data = await res.json();
  //     setHintText(data.hint || '');
  //   } catch (error) {
  //     console.error(error);
  //     setHintText('');
  //   } finally {
  //     setLoadingHint(false);
  //   }
  // };

  // 點擊提示按鈕
  const handleHintClick = async () => {
    setHintOpen(true);
    await fetchHint();
  };

  // 購買提示的API請求
  // const handleBuyHint = async () => {
  //   if (!puzzleId) return;
  //   setLoadingHint(true);
  //   try {
  //     const res = await fetch(`/api/puzzle/${puzzleId}/hint/buy`, {
  //       method: 'POST',
  //     });
  //     if (!res.ok) throw new Error('Failed to fetch buy hint');
  //     await fetchHint(); // 購買成功後重新獲取提示
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // 提交答案的API請求
  const handleRetrySubmit = async () => {
    if (!puzzleId) return;
    try {
      const res = await fetch('/api/puzzle/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: puzzleId,
          answer: retryAnswer.trim(), // 去除前後空格
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setRetryError(data.message || 'Wrong answer. Please try again.');
      } else {
        // 答案正確，導向已解決頁面
        navigate(`/solved-puzzle/${puzzleId}`);
      }
    } catch (error) {
      console.error(error);
      setRetryError('Try again later.');
    }
  };

  // 組件加載時執行數據獲取
  useEffect(() => {
    fetchPuzzle();
    fetchUserProfile();
    fetchTimeInfo();
  }, [puzzleId]);

  // 如果沒有謎題數據，顯示加載中
  if (!puzzleData.id) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
       Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray relative p-4   bg-[url('/images/lgin_bg2.jpg')]">
      {/* 謎題主畫面 */}
      <div className="bg-customGray flex items-center justify-center w-full max-w-6xl h-auto min-h-[30rem] rounded-lg">
        <div className="bg-customGray flex flex-col justify-between p-6 w-full h-full bg-white shadow-lg">
          {/* 標題 + 標籤區塊 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">{puzzleData.title}</h1>
            <div className="flex flex-wrap gap-2">
              {/* 顯示所有標籤 */}
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

          {/* 作者資訊 */}
          <p className="text-lg text-gray-600 mb-2">Author: {puzzleData.author}</p>

          {/* 謎題內容 */}
          <div className="overflow-y-auto mb-4 flex-1">
            <p className="text-lg text-gray-600">
              <strong>Qusetion:</strong> {puzzleData.question}
            </p>
          </div>

          {/* 底部按鈕區塊 (提示 + 嘗試 + 剩餘時間) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-4">
              <button onClick={handleHintClick} className={btnStyle}>
                Hint
              </button>
              <button onClick={() => setRetryOpen(true)} className={btnStyle}>
                Try
              </button>
            </div>

            <div className="text-lg text-gray-700">{timeInfo.statusMsg}</div>
          </div>
        </div>
      </div>

      {/* 用戶個人資料區塊 (右上角) */}
      <Link to="/User" className="absolute top-6 right-6 z-50">
        <button className="flex items-center space-x-6 p-3 rounded">
          {userData.avatar ? (
            <img
              src={userData.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300" />
          )}
          <div className="flex flex-col justify-center text-left">
            <h2 className="text-xl font-bold">{userData.username}</h2>
            <p className="text-gray-600">{userData.statusMsg}</p>
          </div>
        </button>
      </Link>

      {/* 提示彈窗 */}
      {isHintOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Hint</h2>
            {isLoadingHint ? (
              <p className="text-gray-700 mb-4 text-center">Loading hint...</p>
            ) : hintText ? (
              <>
                <p className="text-gray-700 mb-4">{hintText}</p>
                <div className="flex justify-center mt-4">
                  <button onClick={() => setHintOpen(false)} className={btnStyle}>
                    OK
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center mb-4 space-y-3">
                <p className="text-gray-700 mb-4">No hint available.</p>
                <div className="flex space-x-4">
                  <button onClick={handleBuyHint} className={btnStyle}>
                  Buy Hint
                  </button>
                  <button
                    onClick={() => setHintOpen(false)}
                    className={`${btnStyle} bg-gray-400 hover:bg-gray-500`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 嘗試回答彈窗 */}
      {isRetryOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Try</h2>

            {!retryError ? (
              <>
                <input
                  type="text"
                  value={retryAnswer}
                  onChange={(e) => setRetryAnswer(e.target.value)}
                  className="border border-gray-300 px-3 py-2 mb-4 w-full rounded"
                  placeholder="Please enter your answer"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setRetryOpen(false);
                      setRetryError('');
                      setRetryAnswer('');
                    }}
                    className={btnStyle}
                  >
                    Cancel
                  </button>
                  <button onClick={handleRetrySubmit} className={btnStyle}>
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-red-600 mb-4">{retryError}</p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setRetryError('');
                      setRetryAnswer('');
                    }}
                    className={btnStyle}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}