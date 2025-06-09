import React from "react";
import { Link } from "react-router-dom";



export function renderItemButton(item) {
  const path = item.status === "inactive"
    ? `/VerifiedPuzzle/${item.id}`
    : `/UnverifiedPuzzle/${item.id}`;

  const buttonClass = `mt-2 px-3 py-1 text-sm rounded transition ${
    item.status === "inactive"
      ? "bg-gray-300 text-gray-500 hover:bg-gray-700 hover:text-white"
      : "bg-lime-200 text-gray-500 hover:bg-lime-900 hover:text-white"
  }`;

  return (
    <Link to={path}>
      <button className={buttonClass}>
        Details
      </button>
    </Link>
  );
}


