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
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (itemData) {
      setName(itemData.name);
      setDescription(itemData.description);
      setQuantity(itemData.quantity.toString());
      setUnit(itemData.unit);
      setPrice(itemData.price.toString());
    } else {
      setName("");
      setDescription("");
      setQuantity("");
      setUnit("kg");
      setPrice("");
    }
  }, [itemData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !quantity || !price) {
      toast.error("All fields are required!");
      return;
    }
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
      handleClose();
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen
          ? "animate-in fade-in duration-300"
          : isClosing
          ? "animate-out fade-out duration-300"
          : ""
      }`}
    >
      <div className="fixed inset-0 bg-black/30" onClick={handleClose} />

      <div
        className={`relative bg-white rounded-md shadow-md w-full max-w-sm mx-4 p-4 
        ${
          isOpen
            ? "animate-in zoom-in-95 duration-300"
            : isClosing
            ? "animate-out zoom-out-95 duration-300"
            : ""
        }`}
      >
        <h2 className="text-lg font-medium mb-3 text-gray-800">
          {itemData ? "Edit Item" : "Add Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
            >
              <option value="kg">kg</option>
              <option value="litre">litre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Price</label>
            <input
              type="number"
              value={price}
              min={0}
              onChange={handlePriceChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm text-white bg-blue-400 rounded-md hover:bg-blue-500 transition-colors"
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
