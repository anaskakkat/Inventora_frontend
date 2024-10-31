import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import AddItemModal from "../components/AddItemModal";
import toast from "react-hot-toast";
import Api from "../config/axiosConfig";
import { handleApiError } from "../utils/handleApiError";
import { FcNext, FcPrevious } from "react-icons/fc";
import ConfirmationPopover from "@/components/ConfirmationPopover";
import { FaPlus } from "react-icons/fa";
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

  const handleAddItem = async (itemData: {
    _id?: string;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    price: number;
  }) => {
    try {
      if (itemData._id) {
        console.log("editing data", itemData);
        const editedResponse = await Api.patch(
          `/items/${itemData._id}`,
          itemData
        );
        // console.log("----editedResponse---", editedResponse);
        toast.success(editedResponse.data.message);
      } else {
        const response = await Api.post("/items", itemData);
        toast.success(response.data.message);
      }
      fetchItems();
    } catch (error) {
      console.error("Error:", error);
      handleApiError(error);
    }
  };

  const handleDeleteItem = async (_id: string) => {
    try {
      const deleteItemResponse = await Api.delete(`/items/${_id}`);
      toast.success(deleteItemResponse.data.message);
      fetchItems();
    } catch (error) {
      handleApiError(error);
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
      const { data } = await Api.get("/items");

      const formattedRows = data.map((item: any, index: number) => [
        index + 1,
        item.name,
        item.description,
        `${item.quantity} ${item.unit}`,
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

      {paginatedRows.length > 0 ? (
        <>
          <Table headers={headers} rows={paginatedRows} />
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-1 py-1 rounded-md cursor-pointer"
            >
              <FcPrevious />
            </button>
            <span className="flex items-center text-xs ">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-1 py-1 rounded-md cursor-pointer"
            >
              <FcNext />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center mt-4 p-10  text-red-800">No data available</p>
      )}
    </div>
  );
};

export default Inventory;
