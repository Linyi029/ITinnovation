import React, { useState, useEffect } from "react";

const options = [
  "經典謎語", "腦筋急轉彎", "常識問答", "字詞遊戲", "數字邏輯",
  "日常生活", "歷史地理", "動物植物", "你知道嗎？", "快問快答"
];

export default function Checkboxes({ selected = [], onChange }) {
  const [internalSelected, setInternalSelected] = useState(selected);
  const [open, setOpen] = useState(false);

  // ✅ 每次 internal 選項改變，就告訴父層
  useEffect(() => {
    if (onChange) {
      onChange(internalSelected);
    }
  }, [internalSelected]);

  const toggleOption = (value) => {
    setInternalSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="relative inline-block w-full">
      <div
        className="border border-gray-300 bg-white p-2 rounded cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {internalSelected.length > 0
          ? internalSelected.join(", ")
          : "Choose labels of your puzzle"}
      </div>
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md z-10 mt-1 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <label key={option} className="block px-3 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={internalSelected.includes(option)}
                onChange={() => toggleOption(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
