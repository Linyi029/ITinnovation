import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/modal.jsx';
import { useParams } from 'react-router-dom';
//const { id: puzzleId } = useParams();
import { getPuzzleById } from '../lib/provider'; // 根據你實際放的位置調整路徑

import { attemptPuzzle } from '../lib/provider';


export default function Page6() {
  const { id: puzzleId } = useParams();
  const navigate = useNavigate();

  const [puzzleData, setPuzzleData] = useState({
    id: null,
    title: '',
    author: '',
    question: '',
    labels: [],
    timestamp_end: 0,
  });

  const [userData, setUserData] = useState({
    username: 'ho5hi_kwon',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/221014_HOSHI_%28SEVENTEEN%29.jpg'
  });

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

  const btnStyle =
    'bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 active:scale-95 transition duration-150';

  useEffect(() => {
    document.title = "SOLVE THE QUESTION | PUZZLE";
  }, []);


  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const data = await getPuzzleById(puzzleId);
        console.log("✅ Puzzle data from backend:", data);

        setPuzzleData({
          id: data.id,
          title: data.title,
          author: data.author,
          question: data.question,
          labels: data.tags?.split(',') || [],
          timestamp_end: data.timestamp_end
        });
        console.log("📦 setPuzzleData done");
      } catch (err) {
        console.error('❌ Error fetching puzzle:', err);
      }
    };

    fetchPuzzle();
  }, [puzzleId]);

  useEffect(() => {
    console.log("🧩 Current puzzleData:", puzzleData);
  }, [puzzleData]);
  


  const remainingDays = Math.ceil((puzzleData.timestamp_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24));

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
      const res = await fetch(`/api/puzzle/${puzzleId}/hint/buy`, { method: 'POST' });
      const data = await res.json();
      setHintConfig({
        title: 'Hint unlocked successfully!',
        content: `Hint: ${data.hint}`,
        showSubmit: false,
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

  const handleRetrySubmit = async () => {
    const result = await attemptPuzzle(puzzleId, retryAnswer);
    if (result.success) {
      alert('Transaction submitted! Puzzle attempt recorded.');
    } else {
      alert('Failed to submit attempt: ' + result.error);
    }
    setRetryOpen(false);
    setRetryAnswer('');
  };

  if (!puzzleData.id) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray bg-[url('/images/lgin_bg2.jpg')]">
      <div className="w-full flex justify-between items-center px-6">
        <Link
          to="/"
          className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150 absolute top-9 left-6"
        >Homepage</Link>
        <div className="flex items-center space-x-6">
          <Link to="/User" className="absolute top-6 right-6">
            <button className="flex items-center space-x-6 bg-gray p-3 rounded">
              <img src={userData.avatar} alt="avatar" className="w-16 h-16 rounded-full" />
              <div className="flex flex-col justify-center text-left">
                <h2 className="text-xl font-bold">{userData.username}</h2>
              </div>
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-customGray flex items-center justify-center" style={{ width: '1270px', height: '479px' }}>
        <div className="bg-white shadow-lg flex flex-col justify-between p-6" style={{ width: '1072px', height: '370px' }}>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{puzzleData.title}</h1>
            <div className="flex space-x-2">
              {puzzleData.labels.map((label, index) => (
                <label
                  key={index}
                  className={`${index === 0 ? 'bg-slate-500 text-white' : 'bg-slate-50 text-black'} px-4 py-2 rounded`}
                >{label}</label>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-2">Author: {puzzleData.author}</p>

          <div className="overflow-y-auto mb-4" style={{ maxHeight: '160px' }}>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Question:</strong> {puzzleData.question}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button onClick={openUnlockHintModal} className={btnStyle}>Hint</button>
              <button onClick={() => setRetryOpen(true)} className={btnStyle}>Try</button>
            </div>
            <div className="text-lg text-gray-700">
              {remainingDays <= 0 ? 'Verified' : `Days remaining until deadline: ${remainingDays}`}
            </div>
          </div>
        </div>
      </div>

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
              <button onClick={() => setRetryOpen(false)} className={btnStyle}>Cancel</button>
              <button onClick={handleRetrySubmit} className={btnStyle}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
