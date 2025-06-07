import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/common/modal.jsx';

export default function Page5() {
  useEffect(() => {
    document.title = "QUESTION | PUZZLE";
  }, []);
  
  const [puzzleData, setPuzzleData] = useState({
    title: '',
    labels: [],
    author: '',
    question: '',
  });

  const [isAnswerOpen, setAnswerOpen] = useState(false);
  const [isHintOpen, setHintOpen] = useState(false);

  const [hintConfig, setHintConfig] = useState({
    title: '',
    content: '',
    showSubmit: true,
    submitText: 'SURE',
    discardText: 'CLOSE',
    onSubmit: null,
  });

  const openUnlockHintModal = () => {
    setHintConfig({
        title: 'Hint',
        //hint要放在這裡
        content: '{hint}',
        showSubmit: false, // 不再顯示 SURE 按鈕
        onSubmit: null,
      });
    setHintOpen(true);
  };


  const [userData] = useState({
    username: 'ho5hi_kwon',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/221014_HOSHI_%28SEVENTEEN%29.jpg'
  });

  const btnStyle = 'bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 active:scale-95 transition duration-150';

  // 模擬一開始撈 puzzleData (可換成 fetch('/api/puzzle/1'))
  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPuzzleData({
          title: 'Puzzle 1',
          labels: ['Solved', 'label2', 'label3', 'label4', 'label5'],
          author: 'Jane Doe',
          question: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        });
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };

    fetchPuzzle();
  }, []);


  // 點 Answer → fetch answer
  const handleAnswerClick = async () => {
    try {
      setAnswerOpen(true);
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray bg-[url('/images/lgin_bg2.jpg')]">
      {/* 頁首：包含返回首頁按鈕與使用者個人資訊，這裡link要改 */}
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

      {/* Puzzle 區域 */}
      <div
        className="bg-customGray flex items-center justify-center"
        style={{ width: '1270px', height: '479px' }}
      >
        <div
          className="bg-customGray flex flex-col justify-between p-6 bg-white shadow-lg"
          style={{ width: '1072px', height: '370px' }}
        >
          {/* Title + Labels */}
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
          <p className="text-lg text-gray-600 mb-2">
            Author: {puzzleData.author}
          </p>

          {/* Puzzle Content */}
          <div className="overflow-y-auto mb-4" style={{ maxHeight: '160px' }}>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Question:</strong> {puzzleData.question}
            </p>
          </div>

          {/* Hint + Answer buttons */}
          <div className="flex justify-start items-center space-x-4">
            <button
              onClick={openUnlockHintModal}
              className={btnStyle}
            >
              Hint
            </button>

            <button
              onClick={handleAnswerClick}
              className={btnStyle}
            >
              Answer
            </button>
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
          discardText={hintConfig.discardText}
          onClose={() => setHintOpen(false)}
          onSubmit={hintConfig.onSubmit}
        />
      )}

      {/* Answer Modal */}
      {isAnswerOpen && (
        <Modal
          txtTitle='Answer'
          //此處get該問題的answer
          txtContent='{answer}'
          showSubmit={false}
          submitText=''
          discardText='CLOSE'
          onClose={() => setAnswerOpen(false)}
          onSubmit={() => setAnswerOpen(true)}
        />
      )}
    </div>
  );
}
