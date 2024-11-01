import React, { useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Api from "@/config/axiosConfig";
import { Customer, InventoryItem, Sale } from "@/utils/type";
import { handleApiError } from "@/utils/handleApiError";

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSale: (sale: Sale) => void;
}

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  isOpen,
  onClose,
  onAddSale,
}) => {
  const [customerId, setCustomerId] = useState<string>("");
  const [customerDisplayName, setCustomerDisplayName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedItems, setSelectedItems] = useState<
    {
      _id: number;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }[]
  >([]);

  const [itemSearchTerm, setItemSearchTerm] = useState<string>("");
  const [_selectedItemName, setSelectedItemName] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, itemsResponse] = await Promise.all([
          Api.get("/customer"),
          Api.get("/items"),
        ]);

        setCustomers(customersResponse.data);
        setInventoryItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        handleApiError(error);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerDisplayName(searchTerm);
    if (searchTerm) {
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  };

  const handleItemSearch = (searchTerm: string) => {
    setItemSearchTerm(searchTerm);
    setSelectedItemName(searchTerm);
    if (searchTerm) {
      const filtered = inventoryItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.price.toString().includes(searchTerm)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  };

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setSelectedItemName(item.name);
    setItemSearchTerm(item.name);
    setFilteredItems([]);
  };

  const handleAddItem = () => {
   
    if (selectedItem) {
        if (quantity > selectedItem.quantity) {
            toast.error("Insufficient stock available.");
            return; // Exit the function if stock is insufficient
          }
      const existingItemIndex = selectedItems.findIndex(
        (item) => item._id === selectedItem._id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...selectedItems];
        const existingItem = updatedItems[existingItemIndex];
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * existingItem.price;
        setSelectedItems(updatedItems);
      } else {
        const newItem = {
          _id: selectedItem._id,
          name: selectedItem.name,
          quantity,
          price: selectedItem.price,
          total: selectedItem.price * quantity,
        };
        setSelectedItems((prevItems) => [...prevItems, newItem]);
      }

      setQuantity(1);
      setSelectedItem(null);
      setSelectedItemName("");
      setItemSearchTerm("");
    }
  };

  const handleDeleteItem = (itemId: number) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item._id !== itemId)
    );
  };

  const handleAddSale = () => {
    if (!customerId || selectedItems.length === 0) {
      toast.error("Please fill in all fields and add at least one item.");
      return;
    }
    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const saleData: Sale = {
      date: new Date().toISOString().split("T")[0],
      customerId,

      totalAmount: totalAmount,
      items: selectedItems.map(({ _id, name, quantity, total }) => ({
        _id,
        name,
        quantity,
        total,
      })),
    };

    onAddSale(saleData);
    onClose();

    setCustomerId("");
    setCustomerDisplayName("");
    setQuantity(1);
    setSelectedItems([]);
    setSelectedItem(null);
    setSelectedItemName("");
    setItemSearchTerm("");
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 text-sm">
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={onClose}
        />
        <div className="bg-white p-6 rounded-lg shadow-xl z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Add New Sale</h2>

          <div className="space-y-4">
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={new Date().toISOString().split("T")[0]}
                readOnly
                className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-blue-200 focus:ring-1"
              />
            </div>

            {/* Customer Search */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Customer"
                  value={customerDisplayName}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full focus:ring-1 focus:ring-blue-100 pl-8 focus:outline-none"
                />
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              {filteredCustomers.length > 0 && (
                <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto absolute bg-white w-1/3 z-10">
                  {filteredCustomers.map((customer, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setCustomerId(customer._id);
                        setCustomerDisplayName(customer.name);
                        setFilteredCustomers([]);
                      }}
                      className="p-2 hover:bg-blue-100 cursor-pointer bg-gray-200"
                    >
                      {customer.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Item Search and Add Section */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Inventory Items
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative ">
                  <input
                    type="text"
                    placeholder="Search items"
                    value={itemSearchTerm}
                    onChange={(e) => handleItemSearch(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full    focus:ring-blue-200 focus:ring-1 pl-8 focus:outline-none"
                  />
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                  {filteredItems.length > 0 && (
                    <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto absolute  bg-white w-full z-10">
                      {filteredItems.map((item) => (
                        <li
                          key={item._id}
                          onClick={() => handleSelectItem(item)}
                          className="p-2 hover:bg-blue-100 cursor-pointer flex justify-between items-center bg-gray-200"
                        >
                          <span>{item.name}</span>
                          <span className="text-gray-600">${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="w-24 text-sm">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="Qty"
                    className="border border-gray-300 rounded p-2 w-full focus:ring-blue-200 focus:ring-1 pl-8 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleAddItem}
                  disabled={!selectedItem}
                  className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Selected Items Table */}
            {selectedItems.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-sm mb-2">Added Items</h3>
                <div className="border border-gray-300 rounded overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-[11px] ">
                      <tr className="">
                        <th className="px-4 py-1 text-left">Item</th>
                        <th className="px-4 py-1 text-right">Price</th>
                        <th className="px-4 py-1 text-right">Quantity</th>
                        <th className="px-4 py-1 text-right">Total</th>
                        <th className="px-4 py-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item) => (
                        <tr
                          key={item._id}
                          className="border-t text-[11px] border-gray-300"
                        >
                          <td className="px-4 py-1">{item.name}</td>
                          <td className="px-4 py-1 text-right">
                            ₹{item.price}
                          </td>
                          <td className="px-4 py-1 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-1 text-right">
                            ₹{item.total}
                          </td>
                          <td className="px-4 py-1 text-right">
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-gray-300 bg-gray-50 font-semibold text-[14px]">
                        <td colSpan={3} className="px-4 py-1 text-right">
                          Total Amount:
                        </td>
                        <td className=" text-right px-3">₹{totalAmount}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSale}
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
              >
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddSaleModal;
