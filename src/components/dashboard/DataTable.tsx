import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { DataItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DataTableProps {
  data: DataItem[];
}

const DataTable = ({ data }: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const headers = useMemo(() => {
    if (data.length === 0) return [];
    // Get all unique keys from data
    return Array.from(new Set(data.flatMap((item) => Object.keys(item))));
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  return (
    <div className="bg-dark-400 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white text-black">
          Invoice Data
        </h2>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <Input
            className="pl-10 bg-dark-300 border-gray-700 text-white"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-500  dark:text-gray-400 text-black-400">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-dark-300">
                {headers.map((header) => (
                  <td
                    key={`${rowIndex}-${header}`}
                    className="px-4 py-3 text-black-300 dark:text-gray-300"
                  >
                    {row[header] !== undefined ? String(row[header]) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data found</div>
      )}
    </div>
  );
};

export default DataTable;
