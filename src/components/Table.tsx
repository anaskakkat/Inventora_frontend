// Table.tsx
import React from "react";

interface TableProps {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}

const Table: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-md shadow">
        <thead>
          <tr className="bg-blue-50 text-gray-600 uppercase text-xs leading-normal rounded-t-3xl">
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-6 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-300 hover:bg-gray-100 text-sm font-normal">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 px-6">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
