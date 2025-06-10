import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const Card = ({ puzzles, title, emptyMessage }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full md:w-1/2 h-[500px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {puzzles.length > 0 ? (
          puzzles.map((puzzle) => (
            <div key={puzzle.id} className="flex justify-between items-start border-b pb-2">
              <div>
                <p className="font-medium text-gray-800">{puzzle.title}</p>
                <p className="text-sm text-gray-500">{puzzle.question}</p>
                <p className="text-xs text-gray-400">
                  By: {puzzle.author} | Ends in {puzzle.daysleft} days | {puzzle.time}
                </p>
                {puzzle.status && (
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded">
                    {puzzle.status}
                  </span>
                )}
              </div>
              <Link
                to={puzzle.status === "active" 
                  ? `/UnverifiedPuzzle/${puzzle.id}` 
                  : `/VerifiedPuzzle/${puzzle.id}`
                }
                className="bg-slate-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-slate-600 active:scale-95 transition duration-150"
              >
                {puzzle.status === "active" ? "Active" : "Finish => create NFT"}
              </Link>

            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string,
  puzzles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      question: PropTypes.string,
      author: PropTypes.string,
      time: PropTypes.string,
      daysleft: PropTypes.number,
      status: PropTypes.string,
    })
  ).isRequired,
};

export default Card;