import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import Modal from '../components/common/modal.jsx';

export default function Page6() {
  const deadline = new Date('2025-06-09');
  const today = new Date();
  const remainingDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  useEffect(() => {
    document.title = "SOLVE THE QUESTION | PUZZLE";
  }, []);
  // Puzzle 資料 state，方便未來從 API 撈資料
  // 要取的資料 title, question, answer, hint, tags, 
  const [puzzleData, setPuzzleData] = useState({
    id: 1,
    title: 'Puzzle 1',
    author: 'Jane Doe',
    question:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio at turpis interdum tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis condimentum lorem nec nulla dictum, at tincidunt sapien tincidunt. Donec sed tellus eu erat blandit lacinia. Nulla facilisi. Sed vitae sapien metus. Pellentesque a gravida nisi. In volutpat sapien quis urna fringilla, nec ullamcorper magna euismod.',
    labels: ['Unsolved', 'label2', 'label3', 'label4', 'label5'],
  });

  // 使用者資訊獨立成一個 state，方便串接 API
  const [userData, setUserData] = useState({
    username: 'ho5hi_kwon',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/b7/221014_HOSHI_%28SEVENTEEN%29.jpg'
  });

  // Hint / Retry 狀態
  const [isHintOpen, setHintOpen] = useState(false);

  const [hintConfig, setHintConfig] = useState({
    title: '',
    content: '',
    showSubmit: true,
    submitText: 'SURE',
    onSubmit: null,
  });

  const [isRetryOpen, setRetryOpen] = useState(false);
  const [retryAnswer, setRetryAnswer] = useState('');

  const openUnlockHintModal = () => {
    setHintConfig({
      title: 'You can unlock the hint by 3 PUZ',
      content: '',
      showSubmit: true,
      submitText: 'Unlock',
      onSubmit: handleUnlockHint,
    });
    setHintOpen(true);
  };

  const handleUnlockHint = async () => {
    try {
      // 此處要從後端get此puzzle的hint，並且要呼叫tokenManager的BurnToken

      // const tx = await contract.unlockHint(puzzleId);
      // await tx.wait();

      setHintConfig({
        title: 'Hint unlocked successfully!',
        //hint要放在這裡
        content: 'Hint : {hint}',
        showSubmit: false, // 不再顯示 SURE 按鈕
        onSubmit: null,
      });
    } catch (err) {
      setHintConfig({
        title: 'Error',
        content: 'Something went wrong.',
        showSubmit: false,
        onSubmit: null,
      });
    }
  };

  // 這是submit answer的function 要有一個核對答案的function 如果retryAnswer跟該題目的Answer相同 直接讓此puzzle inactive並burnToken
  const handleRetrySubmit = () => {
    console.log('Submitted answer:', retryAnswer);
    setRetryOpen(false);
  };

  const btnStyle =
    'bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 active:scale-95 transition duration-150';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray bg-[url('/images/lgin_bg2.jpg')]">
      <div className="w-full flex justify-between items-center px-6">
        <div className="flex justify-end space-x-4">
          <Link
            to="/Main"
            className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150 absolute top-9 left-6"
          >
            Homepage
          </Link>
        </div>

        {/* 右側頭像 + 名稱 */}
        <div className="flex items-center space-x-6">
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
        </div>
      </div>
      {/* Puzzle主畫面 */}
      <div
        className="bg-customGray flex items-center justify-center"
        style={{ width: '1270px', height: '479px' }}
      >
        <div
          className="bg-white shadow-lg flex flex-col justify-between p-6 shadow-lg"
          style={{ width: '1072px', height: '370px' }}
        >
          {/* Title + Label */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{puzzleData.title}</h1>
            <div className="flex space-x-2">
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

          {/* Author */}
          <p className="text-lg text-gray-600 mb-2">Author: {puzzleData.author}</p>

          {/* Puzzle Content */}
          <div className="overflow-y-auto mb-4" style={{ maxHeight: '160px' }}>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Question:</strong> {puzzleData.question}
            </p>
          </div>

          {/* Hint + Retry + Days Remaining */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button onClick={openUnlockHintModal} className={btnStyle}>
                Hint
              </button>
              <button onClick={() => setRetryOpen(true)} className={btnStyle}>
                Try
              </button>
            </div>

            <div className="text-lg text-gray-700">
              {remainingDays <= 0 ? 'Verified' : `Days remaining until deadline: ${remainingDays}`}
            </div>
          </div>
        </div>
      </div>

      {/* Hint Modal */}
      {isHintOpen && (
        <Modal
          txtTitle={hintConfig.title}
          txtContent={hintConfig.content}
          showSubmit={hintConfig.showSubmit}
          submitText={hintConfig.submitText}
          onClose={() => setHintOpen(false)}
          onSubmit={hintConfig.onSubmit}
        />
      )}

      {/* Retry Modal */}
      {isRetryOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm">
            <h2 className="text-xl font-bold mb-4">Try</h2>
            <input
              type="text"
              value={retryAnswer}
              onChange={(e) => setRetryAnswer(e.target.value)}
              className="border border-gray-300 px-3 py-2 mb-4 w-full rounded"
              placeholder="Please enter your answer"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRetryOpen(false)}
                className={btnStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleRetrySubmit}
                className={btnStyle}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
