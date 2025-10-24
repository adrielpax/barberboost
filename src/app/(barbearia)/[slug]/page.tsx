"use client";

import { useAuth } from "@/context/AuthProvider";
import { useFetchSupabase } from "@/hooks/useFetchSupabase";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Scissors,
  CheckCircle2,
  MapPin,
  Star,
  Clock,
  Instagram,
  Phone,
  BadgeCheck,
  MessageCircle,
  Award,
  Users,
  ArrowLeft,
} from "lucide-react";
import { MdVerified } from "react-icons/md";
import Link from "next/link";

type ServiceType = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
};

type BarbershopData = {
  id: string;
  nome: string;
  barbershop_name: string;
  whatsapp: string;
  avatar_url: string;
  capa_url: string;
  bio: string;
  localizacao: string;
  metodos_pagamento: string[];
  horario_abertura: string;
  horario_fechamento: string;
  aberto_manual: boolean;
  online: boolean;
  status: string;
  avaliacao_media: number;
  total_avaliacoes: number;
  total_clientes: number;
  instagram_url: string;
  services: ServiceType[];
  portfolio: string[];
};

export default function BarbeariaPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);
  const { user } = useAuth();
  const { slug } = useParams();

  const { data: barber, loading } = useFetchSupabase("barbeiros", {
    filters: { slug },
    single: true,
    enabled: !!slug,
  });

  const { data: servicesData } = useFetchSupabase("servicos", {
    filters: { id: barber?.id },
  });

  const barbershopData: BarbershopData = {
    id: barber?.id || "mockid01",
    nome: barber?.nome || "Barbearia do João",
    barbershop_name: barber?.slug || "",
    whatsapp: barber?.whatsapp || "11999999999",
    avatar_url: "",
    capa_url: "",
    bio: "Barbearia tradicional com mais de 10 anos de experiência. Cortes modernos e clássicos.",
    localizacao: "Rua das Flores, 123 - Centro",
    metodos_pagamento: ["Pix", "Cartão", "Dinheiro"],
    horario_abertura: "09:00",
    horario_fechamento: "19:00",
    aberto_manual: false,
    online: true,
    status: "aberto",
    avaliacao_media: 4.8,
    total_avaliacoes: 127,
    total_clientes: 1250,
    instagram_url: "https://instagram.com/barbeariadojoao",
    services: servicesData || [],
    portfolio: ["🔥", "✂️", "💈", "🎨", "⭐", "💯"],
  };

  const isOwner = barber?.id === user?.id;

  const checkIfOpen = useCallback(() => {
    if (manualOverride) return isOpen;
    const now = new Date();
    const hours = now.getHours();
    const [openHour] = barbershopData.horario_abertura.split(":").map(Number);
    const [closeHour] = barbershopData.horario_fechamento
      .split(":")
      .map(Number);
    return hours >= openHour && hours < closeHour;
  }, [
    barbershopData.horario_abertura,
    barbershopData.horario_fechamento,
    isOpen,
    manualOverride,
  ]);

  useEffect(() => {
    setIsOpen(checkIfOpen());
  }, [checkIfOpen]);

  useEffect(() => {
    if (!barbershopData.id) return;
    const channel = supabase
      .channel("services-inserts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "services",
          filter: `barber_id=eq.${barbershopData.id}`,
        },
        (payload: any) => {
          // Handle service updates
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [barbershopData.id]);

  const handleBooking = () => {
    if (selectedService && selectedDate && selectedTime) {
      // Trigger booking dialog
    }
  };

  const generateDates = () => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = generateDates();

  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    const times: string[] = [];
    const start = 9;
    const end = 19;
    for (let h = start; h < end; h++) {
      times.push(`${h.toString().padStart(2, "0")}:00`);
      times.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return times;
  };

  const formatDate = (date: Date) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return {
      day: days[date.getDay()],
      number: date.getDate(),
      month: date.getMonth() + 1,
    };
  };

  const selectedServiceData = barbershopData.services.find(
    (s: ServiceType) => s.id === selectedService
  );

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="w-1/2 h-8 mb-4" />
        <Skeleton className="w-full h-40 mb-4" />
        <Skeleton className="w-32 h-32 rounded-full mb-4" />
        <Skeleton className="w-full h-6 mb-2" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Sticky somente com um token de login vera esse header com botaoes e configuraçoes */}

      {/* <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-lg hidden sm:inline">
              Meu Dashboard
            </span>
          </Link>
          {isOwner && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Editar Página
            </Link>
          )}
        </div>
      </header> */}
      <main className="w-full max-w-2xl md:px-4 md:py-6 mx-auto">
        {/* Capa */}
        <div className="h-40 bg-gray-200 rounded-xl mb-6 overflow-hidden" />

        {/* Info Card */}
        <div className="mb-6 -mt-16 relative z-10 md:px-4">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-2 md:pt-6 px-2">
              <div className="flex gap-4 items-start mb-4">
                <Avatar className="w-20 h-20  md:w-24 md:h-24 border-4 border-background flex-shrink-0">
                  <AvatarFallback className="text-2xl">
                    {barbershopData.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-transparent flex items-center gap-1 rounded-md p-0"
                    >
                      <MdVerified className="w-4 h-4 text-blue-600" />
                      {/* Verificado */}
                    </Badge>
                    <h1 className="font-bold text-base md:text-2xl truncate">
                      {barbershopData.nome}
                    </h1>
                  </div>
                  {/* <p className="text-sm text-muted-foreground mb-3">
                    {barbershopData.barbershop_name}
                  </p> */}
                  <div className="flex gap-3 flex-wrap">
                    {isOpen ? (
                      <Badge className="bg-green-500/10 text-green-700 border-green-500/20 text-xs">
                        🟢 Aberto agora
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-xs">
                        🔴 Fechado
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {barbershopData.horario_abertura} –{" "}
                      {barbershopData.horario_fechamento}
                    </span>
                  </div>
                </div>
              </div>
              {/* Bio */}
              <p className="text-sm text-muted-foreground mb-4 px-6 flex flex-col gap-2">
                {barbershopData.bio}
                {/* Localização */}
                <div
                  className="flex items-center gap-2 text-sm  rounded-lg
              text-blue-500"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{barbershopData.localizacao}</span>
                </div>
              </p>
              <div className="px-6 flex flex-row gap-2 pb-3">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none gap-2"
                  onClick={() =>
                    window.open(`https://wa.me/${barbershopData.whatsapp}`)
                  }
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                {barbershopData.instagram_url && (
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none gap-2"
                    onClick={() => window.open(barbershopData.instagram_url)}
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-6 flex-col sm:flex-row p-6">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Agendar Horário
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="font-bold text-lg">
                    {barbershopData.services?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Serviços</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {barbershopData.avaliacao_media}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({barbershopData.total_avaliacoes})
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">
                    {barbershopData.total_clientes}
                  </p>
                  <p className="text-xs text-muted-foreground">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="servicos" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="servicos" className="gap-1 text-xs sm:text-sm">
              <Scissors className="w-4 h-4" />
              <span className="hidden sm:inline">Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-1 text-xs sm:text-sm">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Portfólio</span>
            </TabsTrigger>
            <TabsTrigger
              value="avaliacoes"
              className="gap-1 text-xs sm:text-sm"
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Avaliações</span>
            </TabsTrigger>
          </TabsList>

          {/* Serviços Tab */}
          <TabsContent value="servicos" className="space-y-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Serviços Disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {servicesData && servicesData.length > 0 ? (
                  servicesData.map((service: ServiceType) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedService === service.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-border hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-sm truncate">
                          {service.name}
                        </h3>
                        <span className="font-bold text-green-600 text-sm whitespace-nowrap">
                          R$ {service.price}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {service.duration}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-30" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum serviço disponível
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {barbershopData.portfolio?.map((item, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer border border-border"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Avaliações Tab */}
          <TabsContent value="avaliacoes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Avaliações dos Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="space-y-2 pb-4 border-b last:border-b-0"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            C{i + 1}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            Cliente {i + 1}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            há 2 dias
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className="w-3 h-3 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      Excelente atendimento! Corte perfeito e ambiente
                      agradável. Voltarei com certeza.
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Métodos de Pagamento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {barbershopData.metodos_pagamento?.map((metodo) => (
                <Badge
                  key={metodo}
                  variant="outline"
                  className="text-xs px-3 py-1"
                >
                  ✓ {metodo}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
