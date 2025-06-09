import React, { useEffect, useState } from 'react';
import PuzzleForm from './createPZ.jsx'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/modal.jsx'; // Adjust the import path as necessary
import UserInfoButton from '@/components/common/UserInfoButton.jsx';

const CreatePuzzleSubmit = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "CREATE YOUR'S | PUZZLE";
  }, []);
  const [formData, setFormData] = useState({
    availableDays: '',
    label: '',
    puzzle: '',
    answer: '',
    hint: ''
  });

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

  const modalSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    document.body.classList.remove('overflow-hidden', 'grayscale');
    setIsModalOpen(false);
    navigate('/Main');
  };

  const handleDiscardConfirm  = () => {
    // if (confirm('Are you sure you want to discard your puzzle?')) {
      setFormData({
        availableDays: '',
        label: 'checkers',
        puzzle: '',
        answer: '',
        hint: ''
      });
      setIsModalOpen(false);
      document.body.classList.remove('overflow-hidden', 'grayscale');
      navigate('/Main');
    // }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove('overflow-hidden', 'grayscale');
  };

  return (
    <div className="relative min-h-screen w-full bg-[url('/images/lgin_bg2.jpg')] flex-col items-center">
      <div className="absolute top-8 right-10 flex flex-col items-end">
        <div className="flex items-center">
          {/* 每個使用者的username跟PUZ數量在此處顯示 */}
          <UserInfoButton />
        </div>
      </div>
      <div className="flex flex-end flex-col items-center p-8 pb-3"> <h1 className="text-5xl font-bold text-stone-600 mt-8 mb-12 items-center">Create Puzzle</h1></div>
      <div className="items-center justify-center w-full flex">
        {/* 這是綠色框框的部分 詳細component在createPZ.jsx*/}
        {/* getters to CreatePuzz.sol的PuzzStruct :
        title : formData.title,
        question : formData.puzzle,
        tags : formData.label.join(', '),
        answer : formData.answer, 
        hint : formData.hint
        formData.availableDays是puzzle有幾天可以解(不確定三個timestamp的變數代表什麼)
        */}
        <PuzzleForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onDiscard={handleDiscard}
        />
        {isModalOpen && <Modal onClose={closeModal} onSubmit={modalSubmit} txtTitle={'This will cost 3 PUZ'} txtContent={'But you will get more tokens back if no one can solve your puzzle!'} />}
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