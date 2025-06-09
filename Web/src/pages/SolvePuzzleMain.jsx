import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/common/card_solvepzmain.jsx";
import { renderItemButton } from "../components/ui/button.jsx";
import InputField from "../components/ui/InputField.jsx";
import Button from "../components/ui/Button-submit";
import NumberSelector from "../components/ui/NumberSelector.jsx";
import Checkboxes from "../components/ui/Checkboxes.jsx";
import { fetchAllPuzzles } from "../lib/provider";

import { fetchActivePuzzles } from "../lib/provider"; // 你剛寫好的函式


  
  


const SolvePuzzleMain = () => {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        availableDays: null,
        labels: [],
        searchText: "",
    });

    const [filteredItems, setFilteredItems] = useState([]);
    const [allItems, setAllItems] = useState([]);

    // useEffect(() => {
    //     document.title = "SOLVE | PUZZLE";
    //     setAllItems(puzzleItems);
    // }, []);


    // useEffect(() => {
    //     document.title = "SOLVE | PUZZLE";

    //     const loadPuzzles = async () => {
    //         const puzzles = await fetchActivePuzzles();
    //         setAllItems(puzzles);
    //     };

    //     loadPuzzles();
    // }, []);

    // useEffect(() => {
    //     document.title = "SOLVE | PUZZLE";

    //     const loadPuzzles = async () => {
    //       const puzzles = await fetchAllPuzzles();
    //       setAllItems(puzzles);
    //     };

    //     loadPuzzles();
    //   }, []);

    useEffect(() => {
        const loadPuzzles = async () => {
            try {
                const puzzles = await fetchAllPuzzles();
                // 將 raw puzzle 轉成需要的前端格式
                const items = puzzles.map((pz) => ({
                    id: Number(pz.id),
                    title: pz.title,
                    question: pz.description,
                    author: pz.owner,
                    label: pz.tags?.split(",") || [],
                    time: new Date(Number(pz.timestamp) * 1000).toLocaleString(),
                    daysleft: Math.ceil((Number(pz.timestamp_end) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
                    status: pz.paidOut ? "inactive" : "active"
                }));
                setAllItems(items);
            } catch (err) {
                console.error("❌ Failed to fetch puzzles:", err);
            }
        };

        loadPuzzles();
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

    // status=active的點details要導向UnverifiedPuzzle, status=inactive的點details要導向verifiedPuzzle
    // 點details時 要透過id?取得title, question, author, tags, timestamp?渲染UnverifiedPuzzle或verifiedPuzzle
    const puzzleItems = [



    ];


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
            </div>

            {/* 🟢 右側卡片區域 */}
            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 把所有的題目的title, authorName, question, answer, hint, tags(label), status */}
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