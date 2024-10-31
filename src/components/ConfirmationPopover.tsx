import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ConfirmationPopoverProps {
  trigger: React.ReactNode;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmationPopover = ({
  trigger,
  message,
  confirmText = "Yes",
  cancelText = "No",
  confirmButtonClass = "px-2.5  py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600",
  cancelButtonClass = "px-2.5 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300",
  onConfirm,
  onCancel,
}: ConfirmationPopoverProps) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCancel) {
      onCancel();
    }
    const popover = e.currentTarget.closest('[role="dialog"]');
    if (popover) {
      (popover as HTMLElement).style.display = "none";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-60 p-3">
        <div className="">
          <p className="text-[12px] text-gray-600">{message}</p>
          <div className="flex justify-end space-x-2">
            <button className={cancelButtonClass} onClick={handleCancel}>
              {cancelText}
            </button>
            <button className={confirmButtonClass} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ConfirmationPopover;
