import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { validateTextField } from "../utils/validation";

interface ItemData {
  _id?: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: ItemData) => void;
  itemData?: ItemData | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  itemData = null,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");

  // Effect to populate the fields when editing
  useEffect(() => {
    if (itemData) {
      setName(itemData.name);
      setDescription(itemData.description);
      setQuantity(itemData.quantity.toString());
      setUnit(itemData.unit);
      setPrice(itemData.price.toString());
    } else {
      // Reset fields for new item
      setName("");
      setDescription("");
      setQuantity("");
      setUnit("kg");
      setPrice("");
    }
  }, [itemData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    let valid = true;

    if (!validateTextField(name)) {
      toast.error("Invalid name format");
      valid = false;
      return;
    }

    if (!validateTextField(description)) {
      toast.error("Invalid description format");
      valid = false;
      return;
    }
    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);
    if (parsedQuantity < 0 || parsedPrice < 0) {
      toast.error("Quantity and Price must be non-negative.");
      valid = false;
    }

    if (valid) {
      const itemPayload = {
        name,
        description,
        quantity: parsedQuantity,
        unit,
        price: parsedPrice,
      };
      onSubmit({ ...itemPayload, _id: itemData?._id });
      onClose();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      setQuantity(value);
    } else {
      toast.error("Only non-negative numbers are allowed.");
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setPrice(value);
    } else {
      toast.error("Only non-negative numbers are allowed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-md p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">
          {itemData ? "Edit Item" : "Add Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              value={quantity} // Set the value of the quantity field
              onChange={handleQuantityChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
              required
              min={0}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
            >
              <option value="kg">kg</option>
              <option value="litre">litre</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Price</label>
            <input
              type="number"
              value={price} // Set the value of the price field
              min={0}
              onChange={handlePriceChange}
              className="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black rounded-md px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            >
              {itemData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
