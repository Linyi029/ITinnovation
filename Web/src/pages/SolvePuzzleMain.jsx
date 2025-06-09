import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button-submit";
import NumberSelector from "../components/ui/NumberSelector";
import Checkboxes from "../components/ui/Checkboxes";
import { Card, CardContent, CardHeader } from "../components/common/card_solvepzmain.jsx";
import { renderItemButton } from "../components/ui/button.jsx";
import { fetchAllPuzzles } from "../lib/provider";

const SolvePuzzleMain = () => {
  const [allItems, setAllItems] = useState([]);
  const [filters, setFilters] = useState({
    searchText: "",
    availableDays: 0,
    labels: [],
  });

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        const puzzles = await fetchAllPuzzles();
        setAllItems(puzzles);
        console.log("✅ already formatted puzzles:", puzzles);
      } catch (err) {
        console.error("❌ Failed to fetch puzzles:", err);
      }
    };

    loadPuzzles();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      searchText: "",
      availableDays: 0,
      labels: [],
    });
  };

  const handleSearch = () => {
    // 搜尋功能是前端篩選
    const filtered = allItems.filter((item) => {
      const matchText =
        item.title.includes(filters.searchText) ||
        item.author.includes(filters.searchText) ||
        item.question.includes(filters.searchText);
      const matchDays =
        filters.availableDays === 0 || item.daysleft <= filters.availableDays;
      const matchLabels =
        filters.labels.length === 0 ||
        filters.labels.every((label) => item.label.includes(label));
      return matchText && matchDays && matchLabels;
    });
    setAllItems(filtered);
  };

  return (
    <div className="flex min-h-screen bg-[url('/images/lgin_bg2.jpg')]">
      {/* 🔵 左側 filter 區域 */}
      <div className="sticky top-0 h-screen bg-[#cdd5d2] bg-opacity-50 px-4 py-10 border-r w-[400px] flex flex-col gap-4">
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150 absolute top-9 left-6"
          >
            Homepage
          </Link>
        </div>
        <div className="py-10 space-y-6">
          <div className="relative w-full max-w-md">
            <InputField
              value={filters.searchText}
              onChange={(e) => handleFilterChange("searchText", e.target.value)}
              placeholder="Search by title, author, question context..."
              className="w-full pr-12"
            />
            <Button
              type="button"
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <img src="/images/search.webp" alt="Search" className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-[#1e1e1e]">Available days</label>
            <NumberSelector
              value={filters.availableDays}
              min={1}
              onChange={(value) => handleFilterChange("availableDays", value)}
              placeholder="Select days for solving puzzle"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base font-medium text-[#1e1e1e]">Label</label>
            <Checkboxes
              selected={filters.labels}
              onChange={(value) => handleFilterChange("labels", value)}
            />
          </div>

          <div className="flex flex-col gap-2 items-center">
            <Button
              type="button"
              onClick={handleReset}
              className="bg-[#C7DBA2] text-gray-800 hover:bg-lime-700 hover:text-white"
            >Reset Search</Button>
          </div>
        </div>
      </div>

      {/* 🔴 右側 puzzle 卡片區域 */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allItems.map((item) => (
            <Card key={item.id} className="w-full bg-white border shadow-md p-4 flex flex-col justify-between">
              <CardHeader className="pt-2 pb-1">
                <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.author}</span>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 truncate">{item.question}</span>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-2 mt-2">
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.label.map((label, index) => (
                        <div
                          key={index}
                          className="border border-gray-400 rounded px-2 py-1 text-sm text-gray-700 bg-white"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className="ml-auto">{renderItemButton(item)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolvePuzzleMain;
