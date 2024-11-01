import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
import Table from "../components/Table";
import AddCustomerModal from "../components/AddCustomerModal";
import ConfirmationPopover from "@/components/ConfirmationPopover";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import Api from "@/config/axiosConfig";
import Pagination from "@/components/Pagination";

const Customer: React.FC = () => {
  const headers = ["SR No", "Name", "Address", "Mobile", "Actions"];
  const [rows, setRows] = useState<Array<Array<React.ReactNode>>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [customerData, setCustomerData] = useState<any | null>(null);

  const handleAddCustomer = async (customerData: {
    _id?: string;
    name: string;
    address: string;
    mobile: string;
  }) => {
    console.log("---handleAddCustomer---a", customerData);
    try {
      if (customerData._id) {
        console.log("editing data", customerData);

        const editedResponse = await Api.patch(
          `/customer/${customerData._id}`,
          customerData
        );
        console.log("----editedResponse---", editedResponse);
        toast.success(editedResponse.data.message);
      } else {
        const customerResponse = await Api.post("/customer", customerData);
        console.log("--customerResponse--", customerResponse);
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
    }
  };

  const DeleteConfirmation = ({ customerId }: { customerId: string }) => (
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

  const handleEditCustomer = (customer: any) => {
    setCustomerData(customer);
    setIsModalOpen(true);
  };

  const fetchCustomers = async () => {
    try {
      const response = await Api.get("/customer");
      const customers = response.data;
      const formattedRows = customers.map((customer: any, index: number) => [
        index + 1,
        customer.name,
        customer.address,
        customer.mobile,
        <div className="flex space-x-2" key={customer._id}>
          <button className="text-blue-600 rounded-md hover:text-blue-900">
            <FaEdit
              className="h-4 w-4"
              onClick={() => handleEditCustomer(customer)}
            />
          </button>
          <DeleteConfirmation customerId={customer._id} />
        </div>,
      ]);
      setRows(formattedRows);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

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
