import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

/**
 * DataTable Component
 *
 * A comprehensive table component that displays CSV data with sorting and filtering capabilities:
 * 1. Displays data in a table format with column headers
 * 2. Allows sorting by clicking on column headers
 * 3. Provides search functionality to filter data
 * 4. Implements pagination for large datasets
 *
 * @param {Object} data - The parsed CSV data (headers and rows)
 */
const DataTable = ({ data }) => {
  // State management
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  /**
   * Handles column header click to sort data
   * @param {string} field - The column field to sort by
   */
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  /**
   * Applies filtering and sorting to the data
   * Memoized to prevent recalculation on every render
   */
  const processedData = useMemo(() => {
    if (!data || !data.rows) return [];

    // First, filter the data based on search term
    let filtered = data.rows;
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = data.rows.filter((row) => {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowercaseSearch)
        );
      });
    }

    // Then, sort the filtered data
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        // Handle numeric values
        if (
          !isNaN(parseFloat(a[sortField])) &&
          !isNaN(parseFloat(b[sortField]))
        ) {
          return sortDirection === "asc"
            ? parseFloat(a[sortField]) - parseFloat(b[sortField])
            : parseFloat(b[sortField]) - parseFloat(a[sortField]);
        }

        // Handle string values
        const valA = String(a[sortField]).toLowerCase();
        const valB = String(b[sortField]).toLowerCase();

        if (sortDirection === "asc") {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      });
    }

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  // Calculate pagination values
  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = processedData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // If no data is provided, show a message
  if (!data || !data.headers || !data.rows) {
    return (
      <p className="text-center p-4">
        No data available. Please upload a CSV file.
      </p>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Table</CardTitle>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {data.headers.map((header) => (
                  <TableHead key={header} className="font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(header)}
                      className="flex items-center font-medium"
                    >
                      {header}
                      {sortField === header &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {data.headers.map((header) => (
                      <TableCell key={`${rowIndex}-${header}`}>
                        {row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={data.headers.length}
                    className="text-center"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-appGray-dark">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + rowsPerPage, processedData.length)} of{" "}
              {processedData.length} entries
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <Button variant="outline" size="sm" disabled>
                        ...
                      </Button>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;
