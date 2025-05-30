import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/common/card_solvepzmain.jsx";
import { renderItemButton } from "../components/ui/button.jsx";
import InputField from "../components/ui/InputField.jsx";
import Button from "../components/ui/Button-submit";
import NumberSelector from "../components/ui/NumberSelector.jsx";
import Checkboxes from "../components/ui/Checkboxes.jsx";

const SolvePuzzleMain = () => {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        availableDays: null,
        labels: [],
        searchText: "",
    });

    const [filteredItems, setFilteredItems] = useState([]);
    const [allItems, setAllItems] = useState([]);

    useEffect(() => {
        document.title = "SOLVE | PUZZLE";
        setAllItems(puzzleItems);
    }, []);

    // 當 allItems 有值後，自動初始化搜尋結果
    useEffect(() => {
        if (allItems.length > 0) {
            handleSearch();
        }
    }, [allItems]);

    useEffect(() => {
        handleSearch();
    }, [filters.availableDays, filters.labels]);

    const handleSearch = () => {
        const filtered = allItems.filter((item) => {
            const matchesDays = !filters.availableDays || item.daysleft <= filters.availableDays;
            const matchesLabel =
                filters.labels.length === 0 ||
                filters.labels.some((label) => item.label.includes(label));
            const search = filters.searchText.toLowerCase();
            const matchesText =
                !search ||
                item.title.toLowerCase().includes(search) ||
                item.question.toLowerCase().includes(search) ||
                item.author.toLowerCase().includes(search);

            return matchesDays && matchesLabel && matchesText;
        });
        
        setFilteredItems(filtered);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleReset = () => {
        setFilters({
            availableDays: null,
            labels: [],
            searchText: "",
        });
        setFilteredItems(allItems);
    };

    const puzzleItems = [
        {
            id: 1,
            question: "What is the capital of France?",
            title: "Puzzle#1",
            time: "Solved and verified.",
            author: "abc",
            label: ["常識問答", "歷史地理"],
            daysleft: 0
        },
        {
            id: 2,
            question: "Which number comes next in the sequence: 2, 4, 8, 16, ?",
            title: "Puzzle#2",
            time: "Solved (1 day left)",
            author: "123",
            label: ["數字邏輯"],
            daysleft: 1
        },
        {
            id: 3,
            question: "Identify the pattern hidden in the following symbol sequence.",
            title: "Menu Label",
            time: "Solved and verified.",
            author: "ejjhkwe",
            label: ["數字邏輯", "快問快答"],
            daysleft: 0
        },
        {
            id: 4,
            question: "Unscramble the word: LPEPZU. Hint: It's something you're solving.",
            title: "Puzzle#4",
            time: "Solved (5 days left)",
            author: "arho",
            label: ["字詞遊戲", "腦筋急轉彎"],
            daysleft: 5
        },
        {
            id: 5,
            question: "What 5-letter word becomes shorter when you add two letters to it?",
            title: "Puzzle#5",
            time: "10 days left",
            author: "e54f",
            label: ["腦筋急轉彎", "字詞遊戲"],
            daysleft: 10
        },
        {
            id: 7,
            question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?",
            title: "Puzzle Alpha",
            time: "3 days left",
            author: "user_alpha",
            label: ["邏輯推理", "腦筋急轉彎"],
            daysleft: 3
        },
        {
            id: 8,
            question: "Find your way from A to B without crossing the same path twice.",
            title: "Maze Runner",
            time: "Solved and verified.",
            author: "maze_master",
            label: ["數字邏輯", "日常生活", "腦筋急轉彎"],
            daysleft: 0
        },
        {
            id: 9,
            question: "Four people are seated at a table. Alan sits left of Ben, but right of Cara. Who is on the far left?",
            title: "Logic Grid",
            time: "2 days left",
            author: "logic_fan",
            label: ["邏輯推理", "常識問答"],
            daysleft: 2
        },
        {
            id: 10,
            question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
            title: "Riddle Time",
            time: "5 hours left",
            author: "wise_owl",
            label: ["經典謎語"],
            daysleft: 1
        },
        {
            id: 11,
            question: "Rearrange the letters to form a meaningful word: TSIWT",
            title: "Word Twist",
            time: "Solved and verified.",
            author: "wordsmith",
            label: ["字詞遊戲", "腦筋急轉彎"],
            daysleft: 0
        },
        {
            id: 12,
            question: "If 2x + 3 = 9, what is x?",
            title: "Math Mystery",
            time: "1 day left",
            author: "number_nerd",
            label: ["數字邏輯"],
            daysleft: 1
        },
        {
            id: 13,
            question: "Fit all the shapes into the box without overlap.",
            title: "Shape Shuffle",
            time: "Solved and verified.",
            author: "geo_wizard",
            label: ["數字邏輯", "快問快答"],
            daysleft: 0
        },
        {
            id: 14,
            question: "What number logically follows this series: 3, 9, 27, ?",
            title: "Sequence Quest",
            time: "12 hours left",
            author: "puzzle_guru",
            label: ["數字邏輯", "常識問答"],
            daysleft: 0
        },
        {
            id: 15,
            question: "Decode the message: %^&@! means 'HELLO'. What does @!%^ mean?",
            title: "Symbol Cipher",
            time: "Solved and verified.",
            author: "cipher_mage",
            label: ["腦筋急轉彎", "快問快答", "你知道嗎？"],
            daysleft: 0
        },
        {
            id: 16,
            question: "If a clock shows 3:15, what is the angle between the hour and minute hands?",
            title: "Clock Logic",
            time: "6 hours left",
            author: "ticktock",
            label: ["常識問答", "日常生活"],
            daysleft: 1
        }
    ];

    return (
        <div className="flex min-h-screen bg-[url('/images/lgin_bg2.jpg')]">
            {/* 🔵 左側 filter 區域 */}
            <div className="sticky top-0 h-screen bg-[#cdd5d2] bg-opacity-50 px-4 py-10 border-r w-[400px] flex flex-col gap-4">
                <div className="relative w-full max-w-md">
                  {/* 搜尋title, author, question的輸入框 */}
                    <InputField
                        value={filters.searchText}
                        onChange={(e) => handleFilterChange("searchText", e.target.value)}
                        placeholder="Search by title, author, question context..."
                        className="w-full pr-12"
                    />
                    {/* 搜尋鈕 */}
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
                    {/* 篩選題目到期日期 */}
                    <NumberSelector
                        value={filters.availableDays}
                        min={1}
                        onChange={(value) => handleFilterChange("availableDays", value)}
                        placeholder="Select days for solving puzzle"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-[#1e1e1e]">Label</label>
                    {/* 篩選題目label */}
                    <Checkboxes
                        selected={filters.labels}
                        onChange={(value) => handleFilterChange("labels", value)}
                    />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    {/* reset所有篩選結果的按鈕 */}
                    <Button
                        type="button"
                        onClick={handleReset}
                        className="bg-[#C7DBA2] text-gray-800 hover:bg-lime-700 hover:text-white"
                    >Reset Search</Button>
                </div>
            </div>

            {/* 🟢 右側卡片區域 */}
            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
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
                                          {/* 將單個題目的所有label print出來 */}
                                            {item.label.map((label, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-400 rounded px-2 py-1 text-sm text-gray-700 bg-white"
                                                >
                                                    {label}
                                                </div>
                                            ))}
                                        </div>
                                        {/* question detail button */}
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
