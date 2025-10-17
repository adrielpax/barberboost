"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { supabase } from "@/services/supabaseClient";
import { useAuth } from "@/context/AuthProvider";

interface Service {
  id: string;
  barber_id: string;
  name: string;
  price: number;
  duration: number; // minutos
  active: boolean;
}

interface UserDataContextType {
  services: Service[];
  refreshServices: () => Promise<void>;
  addService: (service: Omit<Service, "id" | "barber_id">) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  loadingServices: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    if (user?.id) fetchServices();
  }, [user]);

  const fetchServices = async () => {
    setLoadingServices(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("barber_id", user.id)
      .order("name", { ascending: true });

    if (!error && data) setServices(data);
    setLoadingServices(false);
  };

  const addService = async (service: Omit<Service, "id" | "barber_id">) => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("services")
      .insert([{ ...service, barber_id: user.id }])
      .select()
      .single();

    if (!error && data) setServices((prev) => [...prev, data]);
  };

  const removeService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const value = useMemo(
    () => ({
      services,
      refreshServices: fetchServices,
      addService,
      removeService,
      loadingServices,
    }),
    [services, loadingServices]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx)
    throw new Error("useUserData deve ser usado dentro de UserDataProvider");
  return ctx;
};
