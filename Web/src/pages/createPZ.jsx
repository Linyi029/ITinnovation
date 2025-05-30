import React from 'react';
import InputField from '../components/ui/InputField';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button-submit';
import NumberSelector from '../components/ui/NumberSelector';
import Checkboxes from '../components/ui/Checkboxes';

const PuzzleForm = ({ formData, onChange, onSubmit, onDiscard }) => {
  return (
    <div className="w-[946px] h-[600px] bg-lime-800 bg-opacity-30 rounded-[50px] p-8 mb-12">
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div>
            <label className="block text-base font-normal text-[#1e1e1e] mb-2">
              Available days
            </label>
            {/* 可以解題的時間設為5-30天 */}
            <NumberSelector
              value={formData.availableDays}
              onChange={(value) => onChange('availableDays', value)}
              min={5}
              placeholder="Select days for solving puzzle"
              required
            />
          </div>
          <div>
            <label className="block text-base font-normal text-[#1e1e1e] mb-2">
              Label
            </label>
            {/* 可複選此題目的label(optional) */}
            <Checkboxes 
              selected={formData.label}
              onChange={(value) => onChange('label', value)}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-base font-normal text-[#1e1e1e] mb-2">
            Title
          </label>
          {/* 輸入答案的格子 */}
          <InputField
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Enter the title of the puzzle"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-base font-normal text-[#1e1e1e] mb-2">
            Puzzle
          </label>
          {/* 輸入問題的格子 */}
          <Textarea
            value={formData.puzzle}
            onChange={(e) => onChange('puzzle', e.target.value)}
            placeholder="Enter your puzzle content"
            className="h-20"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-base font-normal text-[#1e1e1e] mb-2">
            Answer
          </label>
          {/* 輸入答案的格子 */}
          <InputField
            value={formData.answer}
            onChange={(e) => onChange('answer', e.target.value)}
            placeholder="Enter the answer"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-base font-normal text-[#1e1e1e] mb-2">
            Hint (Optional)
          </label>
          {/* 輸入hint的格子(optional) */}
          <InputField
            value={formData.hint}
            onChange={(e) => onChange('hint', e.target.value)}
            placeholder="Enter a hint (optional)"
          />
        </div>

        <div className="flex justify-center mt-auto space-x-4">
          {/* 取消創造題目->回到CreatePuzzleMain */}
          <Button
            type="button"
            onClick={onDiscard}
            className="bg-[#5a5a5a] text-[#f5f5f5] border border-[#303030] rounded-lg px-6 py-2"
          >
            Discard
          </Button>
          <Button
            type="submit"
            className="bg-[#2c2c2c] text-[#f5f5f5] border border-[#2c2c2c] rounded-lg px-6 py-2"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PuzzleForm;