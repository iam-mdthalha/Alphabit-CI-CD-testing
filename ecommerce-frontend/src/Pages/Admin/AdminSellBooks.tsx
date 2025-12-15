"use client";

import { notifications } from "@mantine/notifications";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";

interface SellBook {
  id: number;
  dateAdded: string;
  name: string;
  mobileNumber: string;
  status: "pending" | "purchased" | "rejected";
  bookTitle?: string;
  author?: string;
}

const AdminSellBooks = () => {
  const mockSellBooks: SellBook[] = [
    {
      id: 1,
      dateAdded: "2024-01-15",
      name: "John Doe",
      mobileNumber: "9874563210",
      status: "pending",
      bookTitle: "The Great Novel",
      author: "Jane Austen",
    },
    {
      id: 2,
      dateAdded: "2024-01-14",
      name: "Alice Smith",
      mobileNumber: "9658741230",
      status: "purchased",
      bookTitle: "Science Fundamentals",
      author: "Carl Sagan",
    },
    {
      id: 3,
      dateAdded: "2024-01-13",
      name: "Bob Johnson",
      mobileNumber: "9630258741",
      status: "rejected",
      bookTitle: "History of Everything",
      author: "Bill Bryson",
    },
  ];

  const [sellBooks, setSellBooks] = useState<SellBook[]>(mockSellBooks);
  const [filteredBooks, setFilteredBooks] = useState<SellBook[]>(mockSellBooks);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    let filtered = [...sellBooks];

    if (filterOption !== "All") {
      filtered = filtered.filter((book) => book.status === filterOption);
    }

    if (searchText) {
      filtered = filtered.filter(
        (book) =>
          book.name.toLowerCase().includes(searchText.toLowerCase()) ||
          book.mobileNumber.includes(searchText) ||
          book.bookTitle?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [sellBooks, filterOption, searchText]);

  const handleUpdateStatus = async (
    id: number,
    newStatus: "purchased" | "rejected"
  ) => {
    try {
      setSellBooks((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, status: newStatus } : book
        )
      );

      notifications.show({
        title: "Success!",
        message: `Book status updated to ${newStatus}`,
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to update status",
        color: "red",
      });
      console.error("Failed to update status:", error);
    }
  };

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startItem =
    filteredBooks.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredBooks.length);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "purchased":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      <Header title="Sell Books" />

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by name, mobile, or book title..."
              className="border border-gray-300 px-3 py-1 outline-none flex-grow max-w-md"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 px-3 py-1 rounded"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="purchased">Purchased</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Date Added
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Mobile Number
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Book Title
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No books found
                  </td>
                </tr>
              ) : (
                currentBooks.map((book) => (
                  <tr
                    key={book.id}
                    className={`border-t ${
                      selectedBookId === book.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedBookId(book.id)}
                  >
                    <td className="py-3 px-4 text-sm">{book.dateAdded}</td>
                    <td className="py-3 px-4 text-sm">{book.name}</td>
                    <td className="py-3 px-4 text-sm">{book.mobileNumber}</td>
                    <td className="py-3 px-4 text-sm">
                      {book.bookTitle || "-"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          book.status
                        )}`}
                      >
                        {book.status.charAt(0).toUpperCase() +
                          book.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      {book.status === "pending" && (
                        <>
                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(book.id, "purchased");
                            }}
                            title="Mark as Purchased"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(book.id, "rejected");
                            }}
                            title="Reject"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      {(book.status === "purchased" ||
                        book.status === "rejected") && (
                        <span className="text-gray-400 text-xs">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm">
          <div className="hidden md:flex">
            Showing {startItem} to {endItem} of {filteredBooks.length} entries
          </div>
          <div className="flex items-center gap-4">
            <select
              className="p-2 border rounded"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                &lt;&lt;
              </button>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &lt;
              </button>
              <span className="px-2 py-1 bg-gray-100 border rounded">
                {currentPage}
              </span>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &gt;
              </button>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(totalPages)}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSellBooks;
