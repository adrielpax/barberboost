"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { validateWhatsApp } from "@/lib/validators/whatsapp";

interface WhatsAppInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function WhatsAppInput({ value, onChange }: WhatsAppInputProps) {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({
    isValid: false,
    message: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Permitir apenas números, espaços, parênteses, hífens
    inputValue = inputValue.replace(/[^\d\s\-()]/g, "");

    // Limitar a 15 caracteres
    inputValue = inputValue.slice(0, 15);

    onChange(inputValue);

    // Validar em tempo real
    if (inputValue.trim()) {
      const result = validateWhatsApp(inputValue);
      setValidation({
        isValid: result.isValid,
        message: result.isValid ? "✓ WhatsApp válido" : "WhatsApp inválido",
      });
    } else {
      setValidation({ isValid: false, message: "" });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">WhatsApp</label>
      <div className="relative">
        <Input
          type="tel"
          placeholder="(11) 99999-9999"
          value={value}
          onChange={handlePhoneChange}
          maxLength={15}
          className={`pr-10 ${
            value &&
            (validation.isValid ? "border-green-500" : "border-red-500")
          }`}
        />
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {validation.isValid ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      {validation.message && (
        <p
          className={`text-xs ${
            validation.isValid ? "text-green-600" : "text-red-600"
          }`}
        >
          {validation.message}
        </p>
      )}
    </div>
  );
}
