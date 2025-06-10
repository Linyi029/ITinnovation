
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Modal from '../components/common/modal.jsx';
import { getPuzzleById } from '../lib/provider';
import UserInfoButton from '../components/common/UserInfoButton';

export default function Page5() {
  const { id: puzzleId } = useParams();

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

  const [userData] = useState({
    username: 'ho5hi_kwon',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/221014_HOSHI_%28SEVENTEEN%29.jpg'
  });

  useEffect(() => {
    document.title = "QUESTION | PUZZLE";
  }, []);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const data = await getPuzzleById(puzzleId);
        setPuzzleData({
          title: data.title,
          labels: data.tags?.split(',') || [],
          author: data.author,
          question: data.question,
        });
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };

    fetchPuzzle();
  }, [puzzleId]);

  const btnStyle = 'bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 active:scale-95 transition duration-150';

  const openUnlockHintModal = () => {
    setHintConfig({
      title: 'Hint',
      content: '{hint}', // 實際 hint 可從 API 再補
      showSubmit: false,
      onSubmit: null,
    });
    setHintOpen(true);
  };

  const handleAnswerClick = () => {
    setAnswerOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray bg-[url('/images/lgin_bg2.jpg')]">
      <div className="w-full flex justify-between items-center px-6">
        <Link to="/" className={btnStyle + " absolute top-9 left-6"}>Homepage</Link>
        <UserInfoButton />
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
                >
                  {label}
                </label>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-2">Author: {puzzleData.author}</p>

          <div className="overflow-y-auto mb-4" style={{ maxHeight: '160px' }}>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Question:</strong> {puzzleData.question}
            </p>
          </div>

          <div className="flex justify-start items-center space-x-4">
            <button onClick={openUnlockHintModal} className={btnStyle}>Hint</button>
            <button onClick={handleAnswerClick} className={btnStyle}>Answer</button>
          </div>
        </div>
      </div>

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

      {isAnswerOpen && (
        <Modal
          txtTitle="Answer"
          txtContent="{answer}" // 實際 answer 也可以動態補
          showSubmit={false}
          discardText="CLOSE"
          onClose={() => setAnswerOpen(false)}
        />
      )}
    </div>
  );
}