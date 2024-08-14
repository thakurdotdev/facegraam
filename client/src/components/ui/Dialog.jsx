import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const DialogContext = createContext();

export const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    document.body.style.overflow = "hidden";
    setIsOpen(true);
  };

  const closeDialog = () => {
    document.body.style.overflow = "";
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ isOpen, openDialog, closeDialog }}>
      {React.Children.toArray(children).find(
        (child) => child.type === TriggerButton,
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={closeDialog}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white border-none p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <X
                className="absolute right-4 top-4 cursor-pointer"
                onClick={closeDialog}
              />
              {React.Children.toArray(children).find(
                (child) => child.type === DialogContent,
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};

export const TriggerButton = ({ children }) => {
  const { openDialog } = useContext(DialogContext);
  return React.cloneElement(children, { onClick: openDialog });
};

export const DialogContent = ({ children }) => {
  return <>{children}</>;
};
