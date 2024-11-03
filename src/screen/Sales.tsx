import React, { useState, useEffect } from "react";
import Table from "@/components/Table";
import { FaPlus } from "react-icons/fa";
import AddSaleModal from "@/components/AddSaleModal";
import { Customer, Sale } from "@/utils/type";
import Api from "@/config/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";
import toast from "react-hot-toast";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

const Sales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [salesResponse, customersResponse] = await Promise.all([
        Api.get("/sale"),
        Api.get("/customer"),
      ]);
      setSales(salesResponse.data);
      setCustomers(customersResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      handleApiError(error);
      setIsLoading(false);
    }
  };

  const handleAddSale = async (newSale: Sale) => {
    try {
      const response = await Api.post("/sale", newSale);
      fetchData();
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error adding sale:", error);
      handleApiError(error);
    }
  };

  const headers: string[] = [
    "#",
    "Date",
    "Customer Name",

    "Total Quantity",
    "Items",
    "Total",
  ];

  const filteredSales = sales.filter((sale) => {
    const customer = customers.find((c) => c._id === sale.customerId._id);
    return customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const rows = filteredSales.map((sale) => {
    const customer = customers.find((c) => c._id === sale.customerId._id);
    const totalQuantity = sale.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const itemsList = sale.items
      .map((item) => `${item.name} (${item.quantity})`)
      .join("\n ");

    return [
      `#${sale.receiptNumber} `,
      new Date(sale.date).toLocaleDateString(),
      customer?.name || "Unknown",
      totalQuantity,
      itemsList,
      `₹${sale.totalAmount}`,
    ];
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSales.length / rowsPerPage);
  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Records</h1>

      {/* Search and Add Button */}
      <div className="flex flex-row justify-between mb-4 ">
        <input
          type="text"
          placeholder="Search by Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded focus:outline-none text-sm p-2 flex w-1/3"
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 text-white rounded px-4 py-2 ml-2 hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="mr-2" />
          Sell
        </button>
      </div>

      {/* Sales Table */}
      {rows.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow">
            <Table headers={headers} rows={paginatedRows} />
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-gray-600 text-center p-8 bg-white rounded-lg shadow">
          {searchTerm
            ? "No matching sales records found."
            : "No sales records yet."}
        </div>
      )}

      {/* Add Sale Modal */}
      <AddSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSale={handleAddSale}
      />
    </div>
  );
};

export default Sales;
