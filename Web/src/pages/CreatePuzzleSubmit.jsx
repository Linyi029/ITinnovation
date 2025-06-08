import React, { useEffect, useState } from 'react';
import PuzzleForm from './createPZ.jsx';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/modal.jsx';

//import { getContracts } from '../lib/provider.js'; // 解構引入
//import submitPuzzle from '../lib/provider.js';
import { getContracts, submitPuzzle } from '../lib/provider.js';
//import { createAndAddWithNewManager } from '../lib/provider';


const CreatePuzzleSubmit = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    answer: '',
    fixedFee: '3000000000000000000' // 預設 3 PUZ
  });

  // const [formData, setFormData] = useState({
  //   title: "",
  //   description: "",
  //   tags: "",
  //   answer: "",
  //   fixedFee: "", // 預設值
  // });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  useEffect(() => {
    document.title = "CREATE YOUR'S | PUZZLE";

    // 初始化 signer 地址作為 username
    async function fetchAddress() {
      try {
        const { signer } = await getContracts();
        const address = await signer.getAddress();
        setUsername(address);
      } catch (err) {
        console.error('Failed to get signer address:', err);
        setUsername('Unknown user');
      }
    }
    fetchAddress();
  }, []);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    document.body.classList.add('overflow-hidden', 'grayscale');
  };

  const handleDiscard = (e) => {
    e.preventDefault();
    setIsDiscardModalOpen(true);
    document.body.classList.add('overflow-hidden', 'grayscale');
  };

  // const modalSubmit = async () => {
  //   try {
  //     const response = await createAndAddWithNewManager(signer, {
  //       title: formData.title,
  //       description: formData.description,
  //       tags: formData.tags,
  //       answer: formData.answer,
  //       fixedFee: formData.fixedFee,
  //     });

  //     if (response.success) {
  //       console.log("Puzzle created with ID:", response.puzzleId);
  //       navigate(`/puzzle/${response.puzzleId}`); // 或導向你設計的成功頁面
  //     } else {
  //       console.error("Create puzzle failed:", response.error);
  //       alert("創建失敗：" + response.error.message);
  //     }
  //   } catch (e) {
  //     console.error("Unhandled error:", e);
  //     alert("提交過程出錯！");
  //   }
  // };


  const modalSubmit = async (e) => {
    e.preventDefault();
    try {
      const txHash = await submitPuzzle(formData);
      console.log('Puzzle submitted, txHash:', txHash);
      alert('Puzzle successfully submitted!');
      setIsModalOpen(false);
      document.body.classList.remove('overflow-hidden', 'grayscale');
      navigate('/');
    } catch (err) {
      console.error('Failed to submit puzzle:', err);
      alert('Submission failed. See console.');
      setIsModalOpen(false);
      document.body.classList.remove('overflow-hidden', 'grayscale');
    }
  };

  const handleDiscardConfirm = () => {
    setFormData({
      title: '',
      description: '',
      tags: '',
      answer: '',
      fixedFee: '3000000000000000000',
    });
    setIsDiscardModalOpen(false);
    document.body.classList.remove('overflow-hidden', 'grayscale');
    navigate('/Main');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove('overflow-hidden', 'grayscale');
  };

  return (
    <div className="relative min-h-screen w-full bg-[url('/images/lgin_bg2.jpg')] flex-col items-center">
      <div className="absolute top-8 right-10 flex flex-col items-end">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-stone-500 rounded-full"></div>
          <span className="text-stone-600 text-2xl font-semibold ml-2">{username}</span>
        </div>
      </div>

      <div className="flex flex-end flex-col items-center p-8 pb-3">
        <h1 className="text-5xl font-bold text-stone-600 mt-8 mb-12 items-center">Create Puzzle</h1>
      </div>

      <div className="items-center justify-center w-full flex">
        <PuzzleForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onDiscard={handleDiscard}
        />
        {isModalOpen && (
          <Modal
            onClose={closeModal}
            onSubmit={modalSubmit}
            txtTitle={'This will cost 3 PUZ'}
            txtContent={'But you will get more tokens back if no one can solve your puzzle!'}
          />
        )}
        {isDiscardModalOpen && (
          <Modal
            txtTitle="Discard this puzzle?"
            txtContent="Are you sure you want to discard this puzzle? Your progress will be lost."
            onClose={() => {
              setIsDiscardModalOpen(false);
              document.body.classList.remove('overflow-hidden', 'grayscale');
            }}
            onSubmit={handleDiscardConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePuzzleSubmit;
