// Modal.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card_solvepzmain'; // 假設你叫它 Card.js

function Modal({txtTitle, txtContent, onClose, onSubmit}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-grayscale p-5">
      <Card className="max-w-md w-full bg-white shadow-xl rounded-xl relative">
        {/* 關閉按鈕 */}
        <button
          className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>

        <CardHeader className="pl-6">
          <CardTitle>{txtTitle}</CardTitle>
          <CardDescription>
            {txtContent}
          </CardDescription>
        </CardHeader>

        <CardFooter className="justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300">
            Discard
          </button>
          <button onClick={onSubmit} className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800">
            SURE
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default Modal;
