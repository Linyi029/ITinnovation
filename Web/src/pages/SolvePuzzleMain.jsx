import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/common/card_solvepzmain.jsx";
import { renderItemButton } from "../components/ui/button.jsx";
import { fetchAllPuzzles } from "../lib/provider";

const SolvePuzzleMain = () => {
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        const puzzles = await fetchAllPuzzles();
        console.log("✅ already formatted puzzles:", puzzles);
        setAllItems(puzzles);
      } catch (err) {
        console.error("❌ Failed to fetch puzzles:", err);
      }
    };

    loadPuzzles();
  }, []);

  return (
    <div className="flex min-h-screen bg-[url('/images/lgin_bg2.jpg')]">
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
