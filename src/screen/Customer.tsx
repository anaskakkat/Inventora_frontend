import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaUser, FaBook, FaArrowLeft } from "react-icons/fa";
import Table from "../components/Table";
import AddCustomerModal from "../components/AddCustomerModal";
import ConfirmationPopover from "@/components/ConfirmationPopover";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import Api from "@/config/axiosConfig";
import Pagination from "@/components/Pagination";
import { LedgerEntry } from "@/utils/type";
import Loader from "@/components/Loader";

interface Customer {
  _id: string;
  name: string;
  address: string;
  mobile: string;
}

const Customer: React.FC = () => {
  const headers = ["SR No", "Name", "Address", "Mobile", "Actions"];
  const ledgerHeaders = ["Date", "Description", "Debit", "Credit", "Balance"];
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Array<Array<React.ReactNode>>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  // New state for ledger functionality
  const [view, setView] = useState<"customers" | "ledger">("customers");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [ledgerData, setLedgerData] = useState<Array<Array<React.ReactNode>>>(
    []
  );
  const [_salesData, setSalesData] = useState<Array<Array<React.ReactNode>>>(
    []
  );

  const handleAddCustomer = async (
    customerData: Omit<Customer, "_id"> & { _id?: string }
  ) => {
    try {
      if (customerData._id) {
        const editedResponse = await Api.patch(
          `/customer/${customerData._id}`,
          customerData
        );
        toast.success(editedResponse.data.message);
      } else {
        const customerResponse = await Api.post("/customer", customerData);
        toast.success(customerResponse.data.messages);
      }
      fetchCustomers();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteCustomer = async (_id: string) => {
    try {
      await Api.delete(`/customer/${_id}`);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const DeleteConfirmation: React.FC<{ customerId: string }> = ({
    customerId,
  }) => (
    <ConfirmationPopover
      trigger={
        <button className="text-red-600 rounded-md p-2 hover:text-red-900">
          <FaTrash className="h-3 w-3" />
        </button>
      }
      message="Are you sure you want to delete this customer?"
      onConfirm={() => handleDeleteCustomer(customerId)}
    />
  );

  const handleEditCustomer = (customer: Customer) => {
    setCustomerData(customer);
    setIsModalOpen(true);
  };

  const handleLedgerView = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setView("ledger");
    // await fetchLedgerData(customer._id, selectedDate);
    await fetchSalesData(customer._id);
  };

  const fetchLedgerData = async (customerId: string, date: string) => {
    try {
      const params = date ? `?date=${date}` : "";
      const response = await Api.get<LedgerEntry[]>(
        `/customer/${customerId}/ledger${params}`
      );
      const ledgerEntries = response.data;

      let balance = 0;
      const formattedLedger = ledgerEntries.map((entry) => {
        balance += entry.credit - entry.debit;
        return [
          entry.date,
          entry.description,
          entry.debit.toFixed(2),
          entry.credit.toFixed(2),
          balance.toFixed(2),
        ];
      });

      setLedgerData(formattedLedger);
    } catch (error) {
      handleApiError(error);
    }
  };
  const fetchSalesData = async (customerId: string) => {
    try {
      const response = await Api.get(`/customer/${customerId}/sales`);
      const sales = response.data;
      console.log("----sales customer---", sales);

      const formattedSales = sales.map(
        (
          sale: {
            date: any;
            items: any[];
            totalAmount: number;
            receiptNumber: any;
          },
          index: number
        ) => [
          index + 1,
          sale.date,
          sale.items.map((item: { name: any }) => item.name).join(", "), // Join item names for display
          sale.totalAmount.toFixed(2),
          sale.receiptNumber,
        ]
      );

      setSalesData(formattedSales);
    } catch (error) {
      handleApiError(error);
    }
  };
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await Api.get<Customer[]>("/customer");
      const customers = response.data;
      const formattedRows = customers.map((customer, index) => [
        index + 1,
        customer.name,
        customer.address,
        customer.mobile,
        <div className="flex space-x-2" key={customer._id}>
          <button
            className="text-blue-600 rounded-md hover:text-blue-900"
            onClick={() => handleEditCustomer(customer)}
          >
            <FaEdit className="h-4 w-4" />
          </button>
          <button
            className="text-green-600 rounded-md hover:text-green-900"
            onClick={() => handleLedgerView(customer)}
          >
            <FaBook className="h-4 w-4" />
          </button>
          <DeleteConfirmation customerId={customer._id} />
        </div>,
      ]);
      setRows(formattedRows);
    } catch (error) {
      handleApiError(error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer && selectedDate) {
      fetchLedgerData(selectedCustomer._id, selectedDate);
    }
  }, [selectedDate, selectedCustomer]);

  const filteredRows = rows.filter((row) =>
    row.some((cell) =>
      String(cell).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
if(loading){return <Loader/>}
  if (view === "ledger") {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("customers")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft /> Back to Customers
            </button>
            <h1 className="text-3xl font-bold">
              Ledger for {selectedCustomer?.name}
            </h1>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        {ledgerData.length > 0 ? (
          <Table headers={ledgerHeaders} rows={ledgerData} />
        ) : (
          <p className="text-center p-4 text-gray-500">
            No ledger entries found
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Customer List</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md focus:outline-none text-sm pl-5 w-1/3"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white rounded-md px-2 py-1.5 hover:bg-blue-600"
        >
          <FaUser />
          Add Customer
        </button>
        <AddCustomerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCustomerData(null);
          }}
          onSubmit={handleAddCustomer}
          customerData={customerData}
        />
      </div>

      {paginatedRows.length > 0 ? (
        <>
          <Table headers={headers} rows={paginatedRows} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-center mt-4 p-10 text-red-800">No data available</p>
      )}
    </div>
  );
};

export default Customer;
