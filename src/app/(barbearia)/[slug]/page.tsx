"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  Scissors,
  Heart,
  Share2,
  CheckCircle2,
  MessageCircle,
  Bookmark,
  Instagram,
  DollarSign,
  Award,
  X,
  ImageIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton"; // se disponível, senão use div animada

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
  username: string;
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
  // ...adicione campos conforme uso real/mocks
};

// type ServiceType = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   duration: string;
// };

export default function BarbeariaPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);
  // const [barbershopData, setBarbershopData] = useState<BarbershopData | null>(
  //   null
  // );
  const [barbershopLoading, setBarbershopLoading] = useState(false);
  const user = { id: "usuario_dono_teste" }; // TROCAR pela auth real
  const isOwner = true;

  // Render skeleton se loading
  if (barbershopLoading) {
    return (
      <div className="p-10">
        <Skeleton className="w-1/2 h-8 mb-2 animate-pulse" />
        <Skeleton className="w-full h-40 mb-4 animate-pulse" />
        <Skeleton className="w-32 h-32 rounded-full mb-4 animate-pulse" />
        <Skeleton className="w-full h-6 mb-2 animate-pulse" />
        <Skeleton className="w-5/6 h-8 mb-2 animate-pulse" />
        {/* ...outros skeletons... */}
      </div>
    );
  }

  const barbershopData = {
    id: "mockid01",
    nome: "Barbearia do João",
    username: "barbearia-do-joao",
    whatsapp: "11999999999",
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
    services: [
      {
        id: "corte",
        name: "Corte Masculino",
        price: 35,
        duration: "30min",
        description: "Corte personalizado com máquina e tesoura",
      },
      {
        id: "barba",
        name: "Barba Completa",
        price: 25,
        duration: "20min",
        description: "Aparar, desenhar e finalizar com toalha quente",
      },
      {
        id: "corte-barba",
        name: "Corte + Barba",
        price: 50,
        duration: "45min",
        description: "Combo completo com desconto especial",
      },
      {
        id: "sobrancelha",
        name: "Design de Sobrancelha",
        price: 15,
        duration: "15min",
        description: "Design masculino profissional",
      },
    ],
    portfolio: ["🔥", "✂️", "💈", "🎨", "⭐", "💯"],
  };

  // Proteção contra dados nulos
  if (!barbershopData) return null;

  // Simular dados do barbeiro (substituir por dados reais do Supabase)
  // const user = { id: "usuario_dono_teste" };
  // const isOwner = true; // Simular que é o dono

  // Gerar próximos 7 dias
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = generateDates();

  // Horários disponíveis baseados no dia selecionado
  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    const times = [];
    const start = 9;
    const end = 19;
    for (let h = start; h < end; h++) {
      times.push(`${h.toString().padStart(2, "0")}:00`);
      times.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return times;
  };

  // Verificar se está no horário de funcionamento
  const checkIfOpen = () => {
    if (manualOverride) return isOpen;
    const now = new Date();
    const hours = now.getHours();
    const [openHour] = barbershopData.horario_abertura.split(":").map(Number);
    const [closeHour] = barbershopData.horario_fechamento
      .split(":")
      .map(Number);
    return hours >= openHour && hours < closeHour;
  };

  const handleBooking = () => {
    if (selectedService && selectedDate && selectedTime) {
      setIsDialogOpen(true);
    }
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

  useEffect(() => {
    setIsOpen(checkIfOpen());
  }, [manualOverride]);

  // useEffect(() => {
  //   setBarbershopLoading(true);
  //   // Exemplo: fetch por slug com fallback para mock
  //   (async () => {
  //     const slug = "barbearia-do-joao"; // trocar depois pelo params
  //     const { data, error } = await supabase
  //       .from("barbeiros")
  //       .select("*", { count: "exact" })
  //       .eq("username", slug)
  //       .single();
  //     if (!error && data) {
  //       setBarbershopData(data);
  //     } else {
  //       // Mock
  //       setBarbershopData({
  //         id: "mockid01",
  //         nome: "Barbeiro de Teste",
  //         username: "barbearia-do-joao",
  //         whatsapp: "11999999999",
  //         avatar_url: "",
  //         capa_url: "",
  //         bio: "Barbearia tradicional, 10 anos de experiência.",
  //         localizacao: "Rua das Flores, 123 - Centro",
  //         metodos_pagamento: ["Pix", "Cartão", "Dinheiro"],
  //         horario_abertura: "09:00",
  //         horario_fechamento: "19:00",
  //         aberto_manual: false,
  //         online: true,
  //         status: "aberto",
  //         avaliacao_media: 4.7,
  //         total_avaliacoes: 140,
  //         total_clientes: 1200,
  //         instagram_url: "https://insta.me/barbeiro",
  //         services: [
  //           {
  //             id: "corte",
  //             name: "Corte",
  //             description: "Corte de cabelo",
  //             price: 30,
  //             duration: "30min",
  //           },
  //         ],
  //         portfolio: ["🔥"],
  //       });
  //     }
  //     setBarbershopLoading(false);
  //   })();
  // }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header responsivo */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-full px-4 mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-background" />
            </div>
            <span className="font-bold text-lg truncate">Meu Barbeiro</span>
          </div>
          <Button variant="outline" size="sm" className="px-3 py-1 text-sm">
            Voltar
          </Button>
        </div>
      </header>

      <main className="w-full max-w-[600px] px-4 py-4 mx-auto">
        {/* Profile Card Topo responsivo */}
        <Card className="overflow-hidden mb-4">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-primary/20" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <h1 className="font-bold text-lg sm:text-2xl truncate">
                  {barbershopData.nome}
                </h1>
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Verificado
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">
                {barbershopData.username}
              </p>
              <div className="flex flex-wrap gap-2 text-xs items-center mb-2">
                {isOpen ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    Aberto agora
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                    Fechado
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {barbershopData?.horario_abertura ?? "--"}–
                  {barbershopData?.horario_fechamento ?? "--"}
                </span>
              </div>
              <div className="flex justify-between mt-2 text-center text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-sm sm:text-base">
                    {barbershopData.services?.length || 0}
                  </div>
                  serviços
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base">
                    {barbershopData.total_clientes}
                  </div>
                  clientes
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />{" "}
                    {barbershopData.avaliacao_media}
                  </div>
                  {barbershopData.total_avaliacoes} avaliações
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm mb-2">{barbershopData.bio}</p>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{barbershopData.localizacao}</span>
        </div>

        {/* Action Buttons mobile-first */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80 py-2">
            Agendar Horário
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Instagram className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs responsivo */}
        <Tabs defaultValue="servicos" className="mb-4">
          <TabsList className="flex gap-2 overflow-x-auto text-sm">
            <TabsTrigger
              value="servicos"
              className="flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <Scissors className="w-4 h-4" /> Serviços
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" /> Portfólio
            </TabsTrigger>
            <TabsTrigger
              value="avaliacoes"
              className="flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <Award className="w-4 h-4" /> Avaliações
            </TabsTrigger>
            <TabsTrigger
              value="contato"
              className="flex items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap"
            >
              <MapPin className="w-4 h-4" /> Contato
            </TabsTrigger>
          </TabsList>

          {/* Conteúdo das Tabs simplificado mobile */}
          <TabsContent value="servicos" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Escolha um Serviço</CardTitle>
                <CardDescription>Selecione o serviço desejado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {barbershopData.services?.map((service: ServiceType) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedService === service.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <h3 className="font-semibold text-base mb-1 truncate">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-green-600">
                        R$ {service.price}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {barbershopData.portfolio?.map((item, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center text-4xl sm:text-6xl hover:scale-105 transition-transform cursor-pointer border"
                >
                  {item}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Avaliações Tab */}
          <TabsContent value="avaliacoes" className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 pb-4 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>C{i + 1}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">Cliente {i + 1}</p>
                      <p className="text-xs text-muted-foreground">há 2 dias</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm line-clamp-3">
                  Excelente atendimento! Corte perfeito e ambiente agradável.
                </p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
