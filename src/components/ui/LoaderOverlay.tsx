"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Loader Overlay Melhorado
export function LoaderOverlay({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog.Root open={open}>
          <Dialog.Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2
                    className="w-12 h-12 text-violet-500"
                    strokeWidth={2}
                  />
                </motion.div>
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm text-gray-300 font-medium tracking-wide"
                >
                  Carregando...
                </motion.p>
              </div>
            </motion.div>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}

// Login Page Melhorada
