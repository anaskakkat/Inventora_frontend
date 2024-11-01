// components/Pagination.tsx

import React from "react";
import { FcNext, FcPrevious } from "react-icons/fc";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-1 py-1 rounded-md cursor-pointer"
      >
        <FcPrevious />
      </button>
      <span className="flex items-center text-xs ">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-1 py-1 rounded-md cursor-pointer"
      >
        <FcNext />
      </button>
    </div>
  );
};

export default Pagination;
