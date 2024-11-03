import React from "react";
import { ChevronUp, ChevronDown, AlertCircle } from "lucide-react";

interface TableProps {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Search and filters section could go here */}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="group px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronUp className="w-3 h-3" />
                      <ChevronDown className="w-3 h-3 -mt-1" />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200 text-[14px] font-sans">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-6 py-4 whitespace-nowrap  ${
                      cell === "No Stock"
                        ? "text-red-500 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    {cell === "No Stock" ? (
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>{cell}</span>
                      </div>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {rows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No data available</p>
          </div>
        )}
      </div>

      {/* Table Footer - Pagination Example */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
   
      </div>
    </div>
  );
};

export default Table;