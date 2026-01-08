import { ReactNode } from 'react';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

interface TableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export default function Table({ columns, data, pagination }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all border-b border-gray-100 group"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-gray-900 group-hover:text-gray-900">
                  {column.render ? column.render(row[column.key], row) : (row[column.key] as string)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="px-6 py-4 flex items-center justify-between border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>Showing page</span>
            <span className="font-bold text-gray-900 px-2 py-1 bg-white border border-gray-300 rounded">{pagination.currentPage}</span>
            <span>of</span>
            <span className="font-bold text-gray-900">{pagination.totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white border border-gray-300 hover:border-gray-400"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white border border-gray-300 hover:border-gray-400"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
