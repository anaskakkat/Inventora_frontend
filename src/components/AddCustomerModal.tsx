// components/AddCustomerModal.tsx
import { validateMobileNumber, validateTextField } from "@/utils/validation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    _id?: string;
    name: string;
    address: string;
    mobile: string;
  }) => void;
  customerData?: {
    _id?: string;
    name: string;
    address: string;
    mobile: string;
  } | null;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customerData,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (customerData) {
      setName(customerData.name);
      setAddress(customerData.address);
      setMobile(customerData.mobile);
    } else {
      setName("");
      setAddress("");
      setMobile("");
    }
  }, [customerData, isOpen]);

  const handleSubmit = () => {
    if (!name || !address || !mobile) {
      toast.error("All fields are required!");
      return;
    }
    if (!validateTextField(name)) {
      toast.error("Invalid name format");
      return;
    }
    if (!validateTextField(address)) {
      toast.error("Invalid address format");
      return;
    }
    if (!validateMobileNumber(mobile)) {
      toast.error(
        "Invalid mobile number. Must be 10 digits without whitespace."
      );
      return;
    }

    onSubmit({ name, address, mobile, _id: customerData?._id });
    handleClose();
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
        className={`relative bg-white rounded-md shadow-md w-full max-w-sm mx-4 p-4 ${
          isOpen
            ? "animate-in zoom-in-95 duration-300"
            : isClosing
            ? "animate-out zoom-out-95 duration-300"
            : ""
        }`}
      >
        <h2 className="text-lg font-medium mb-3 text-gray-800">
          {customerData ? "Edit Customer" : "Add Customer"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
          />
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-300"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
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
            onClick={handleSubmit}
            className="px-3 py-1.5 text-sm text-white bg-blue-400 rounded-md hover:bg-blue-500 transition-colors"
          >
            {customerData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
