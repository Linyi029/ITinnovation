
//import React from "react";

// export function renderItemButton(item) {
//   const isFinished = item.time.includes("Solved");
//   const isNtFinished = item.time.includes("left") && !item.time.includes("Solved");

//   const handleClick = () => {
//       console.log("Clicked:", item.description);
//       // 你也可以在這裡觸發其他邏輯，例如 router、setState 等
    
//   };

//   const buttonClass = `mt-2 px-3 py-1 text-sm rounded transition ${
//     isFinished
//       ? "bg-gray-300 text-gray-500 hover:bg-gray-700 hover:text-white"
//       : isNtFinished
//       ? "bg-lime-200 text-gray-500 hover:bg-lime-900 hover:text-white"
//       : "bg-yellow-300 text-gray-500 hover:bg-yellow-700 hover:text-white"
//   }`;

//   return (
//     <button className={buttonClass} onClick={handleClick}>
//       Details
//     </button>
//   );
//  }

import React from "react";
import { Link } from "react-router-dom";

export function renderItemButton(item) {
  const path = item.status === "active"
    ? `/UnverifiedPuzzle/${item.id}`
    : `/VerifiedPuzzle/${item.id}`;

  const buttonClass = `mt-2 px-3 py-1 text-sm rounded transition ${
    item.status === "active"
      ? "bg-lime-200 text-gray-500 hover:bg-lime-900 hover:text-white"
      : "bg-gray-300 text-gray-500 hover:bg-gray-700 hover:text-white"
  }`;

  return (
    <Link to={path}>
      <button className={buttonClass}>
        Details
      </button>
    </Link>
  );
}

