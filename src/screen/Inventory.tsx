import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import AddItemModal from "../components/AddItemModal";
import toast from "react-hot-toast";
import Api from "../config/axiosConfig";
import { handleApiError } from "../utils/handleApiError";
import ConfirmationPopover from "@/components/ConfirmationPopover";
import { FaPlus } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

const Inventory: React.FC = () => {
  const headers: string[] = [
    "SR No",
    "Name",
    "Description",
    "Quantity",
    "Price",
    "Actions",
  ];

  const [rows, setRows] = useState<Array<Array<React.ReactNode>>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [itemData, setItemData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleAddItem = async (itemData: {
    _id?: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
  }) => {
    try {
      setLoading(true); // Start loading
      if (itemData._id) {
        console.log("editing data", itemData);
        const editedResponse = await Api.patch(
          `/items/${itemData._id}`,
          itemData
        );
        toast.success(editedResponse.data.message);
      } else {
        const response = await Api.post("/items", itemData);
        toast.success(response.data.message);
      }
      fetchItems();
    } catch (error) {
      console.error("Error:", error);
      handleApiError(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDeleteItem = async (_id: string) => {
    try {
      setLoading(true); // Start loading
      const deleteItemResponse = await Api.delete(`/items/${_id}`);
      toast.success(deleteItemResponse.data.message);
      fetchItems();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const DeleteConfirmation = ({ itemId }: { itemId: string }) => (
    <ConfirmationPopover
      trigger={
        <button className="text-red-600 rounded-md p-2 hover:text-red-900">
          <FaTrash className="h-3 w-3" />
        </button>
      }
      title="Confirm Deletion"
      message="Are you sure you want to delete this item?"
      onConfirm={() => handleDeleteItem(itemId)}
    />
  );

  const handleEditItem = (item: any) => {
    setItemData(item);
    setIsModalOpen(true);
  };

  const fetchItems = async () => {
    try {
      setLoading(true); // Start loading
      const { data } = await Api.get("/items");

      const formattedRows = data.map((item: any, index: number) => [
        index + 1,
        item.name,
        item.description,
        item.quantity > 0 ? `${item.quantity} ${item.unit}` : "No Stock",
        `₹${item.price.toFixed(2)} / ${item.unit}`,
        <div className="flex space-x-2">
          <button className="text-blue-600 rounded-md hover:text-blue-900">
            <FaEdit className="h-4 w-4" onClick={() => handleEditItem(item)} />
          </button>
          <DeleteConfirmation itemId={item._id} />
        </div>,
      ]);

      setRows(formattedRows);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchItems();
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
      <h1 className="text-3xl font-bold mb-4">Inventory Items</h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md focus:outline-none text-sm pl-5 w-1/3"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white rounded-md px-2 py-1.5 hover:bg-blue-600"
        >
          <FaPlus className="" />
          Add Items
        </button>
        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false), setItemData(null);
          }}
          onSubmit={handleAddItem}
          itemData={itemData}
        />
      </div>

      {loading ? ( // Show loading indicator
        <Loader />
      ) : paginatedRows.length > 0 ? (
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

export default Inventory;
