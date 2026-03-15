import { MouseEvent, ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twJoin } from "tailwind-merge";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  closeOnClickOutside?: boolean;
  children?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  children,
  closeOnClickOutside = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(
    function handleShowOrCloseDialog() {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    },
    [open],
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const dialog = dialogRef.current;
      if (!closeOnClickOutside || !dialog) return;

      const rect = dialog.getBoundingClientRect();
      const clickedOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;

      if (clickedOutside) {
        onClose();
      }
    },
    [closeOnClickOutside, onClose],
  );

  return createPortal(
    <dialog
      ref={dialogRef}
      className={twJoin(
        "top-[10vh] my-0 flex max-h-[75vh] w-full max-w-lg",
        "rounded-xl border border-dark-600 bg-dark-800 text-neutral-100 shadow-2xl",
        "backdrop:bg-black/60 backdrop:backdrop-blur-xs",
      )}
      onClose={onClose}
      onClick={handleClick}
    >
      {children}
    </dialog>,
    document.body,
  );
}
