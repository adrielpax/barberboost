"use client";

import { useAuth } from "@/context/AuthProvider";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Link as LinkIcon,
  LogOut,
  Share2,
  Clock,
  MapPin,
  Phone,
  Instagram,
  CreditCard,
  Settings,
  Camera,
  Type,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ProtectedPage } from "@/components/ProtectWrraper";
import { LoaderOverlay } from "@/components/ui/LoaderOverlay";

export default function DashboardPage() {
  // Pega os dados do Auth
  const { barberData, loading, logout, refreshBarberData } = useAuth();
  const { toast } = useToast();

  // Estado do Perfil
  const [barbershopName, setBarbershopName] = useState(
    barberData?.barbershop_name || ""
  );
  const [barberName, setBarberName] = useState(barberData?.nome || "");
  const [bio, setBio] = useState(barberData?.bio || "");
  const [address, setAddress] = useState(barberData?.address || "");
  const [phone, setPhone] = useState(barberData?.phone || "");
  const [instagram, setInstagram] = useState(barberData?.instagram || "");
  const [whatsapp, setWhatsapp] = useState(barberData?.whatsapp || "");

  // Estado de Configurações
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("19:00");
  const [paymentMethods, setPaymentMethods] = useState({
    pix: true,
    cartao: true,
    dinheiro: true,
    fiado: false,
  });
  const [isOpen, setIsOpen] = useState(true);
  const [automaticHours, setAutomaticHours] = useState(true);

  function toSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }

  const username = toSlug(barbershopName || barberData?.barbershop_name || "");
  const barberPageLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `https://meubarbeiro.app/${username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(barberPageLink);
    toast({
      title: "Link copiado!",
      description: "Seu link foi copiado para a área de transferência",
    });
  };

  const openBarberPage = () => {
    window.open(barberPageLink, "_blank");
  };

  const mockFinancialData = {
    today: 450,
    week: 2340,
    month: 8920,
  };

  const mockEntries = [
    {
      id: 1,
      description: "Corte + Barba - João Silva",
      value: 80,
      type: "entrada",
      date: "Hoje 14:30",
    },
    {
      id: 2,
      description: "Corte - Pedro Santos",
      value: 50,
      type: "entrada",
      date: "Hoje 11:00",
    },
    {
      id: 3,
      description: "Produtos - Compra pomada",
      value: 120,
      type: "saida",
      date: "Ontem",
    },
    {
      id: 4,
      description: "Corte + Sobrancelha - Carlos",
      value: 70,
      type: "entrada",
      date: "Ontem",
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoaderOverlay open={true} />
      </div>
    );

  // Se não tiver dados do barbeiro, mostra erro
  if (!barberData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro ao carregar dados</CardTitle>
            <CardDescription>
              Não conseguimos localizar seus dados. Tente fazer login novamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => logout()} className="w-full">
              Fazer Login Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log(barberData);

  const handleSaveProfile = async () => {
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso",
    });
    // Aqui você faria a chamada para atualizar no Supabase
  };

  const handleSaveSettings = async () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas preferências foram atualizadas",
    });
    // Aqui você faria a chamada para atualizar no Supabase
  };

  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-background">
        {/* HEADER */}
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
            <div className="flex items-center gap-3">
              <div className="  flex items-center justify-center">
                <img src="/icon-192.png" alt="Logo" className="w-10 h-10" />
              </div>
              <div>
                <span className="font-bold text-lg block leading-tight">
                  Meu Barbeiro
                </span>
                <span className="text-xs text-muted-foreground">
                  Seu painel
                </span>
              </div>
            </div>
            <Button
              onClick={() => logout()}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </header>

        {/* MAIN */}
        <main className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Bem-vindo, {barberData.nome?.split(" ")[0]}!
              </h1>
              <p className="text-base text-muted-foreground">
                Configure sua barbearia e comece a receber agendamentos online
              </p>
            </div>

            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="link">
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Agendamento</span>
                </TabsTrigger>
                <TabsTrigger value="financeiro">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Financeiro</span>
                </TabsTrigger>
                <TabsTrigger value="perfil">
                  <Type className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Perfil</span>
                </TabsTrigger>
                <TabsTrigger value="configuracoes">
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Config</span>
                </TabsTrigger>
              </TabsList>

              {/* TAB: AGENDAMENTO */}
              <TabsContent value="link" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="w-5 h-5" />
                      Seu Link de Agendamento
                    </CardTitle>
                    <CardDescription>
                      Compartilhe com seus clientes para que eles agendem online
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <Input
                        value={barberPageLink}
                        readOnly
                        className="font-mono text-sm flex-1"
                      />
                      <div className="flex gap-2">
                        <Button onClick={copyLink} size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={openBarberPage}
                          size="sm"
                        >
                          Ver página
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Próximos Agendamentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-8 h-8 mx-auto mb-4 opacity-40" />
                      <p className="font-medium">Sem agendamentos ainda</p>
                      <p className="text-sm mt-2">
                        Comece compartilhando seu link com clientes!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: FINANCEIRO */}
              <TabsContent value="financeiro" className="space-y-6 mt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Hoje
                      </CardTitle>
                      <div className="p-2 rounded-lg bg-green-50">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        R$ {mockFinancialData.today.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        +12% comparado a ontem
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Esta Semana
                      </CardTitle>
                      <div className="p-2 rounded-lg bg-blue-50">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        R$ {mockFinancialData.week.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Últimos 7 dias
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Este Mês
                      </CardTitle>
                      <div className="p-2 rounded-lg bg-purple-50">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        R$ {mockFinancialData.month.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Últimos 30 dias
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Movimentações</CardTitle>
                    <CardDescription>
                      Entradas e saídas da sua barbearia
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {entry.type === "entrada" ? (
                              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {entry.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {entry.date}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`font-semibold text-sm flex-shrink-0 ml-2 ${
                              entry.type === "entrada"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {entry.type === "entrada" ? "+" : "-"}R${" "}
                            {entry.value.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: PERFIL */}
              <TabsContent value="perfil" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Fotos da Barbearia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <div className="space-y-2">
                        <Label>Avatar</Label>
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Capa</Label>
                        <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informações Principais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="barbershop-name">Nome da Barbearia</Label>
                      <Input
                        id="barbershop-name"
                        placeholder="Ex: Barbearia do João"
                        value={barbershopName}
                        onChange={(e) => setBarbershopName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="barber-name">Seu Nome</Label>
                      <Input
                        id="barber-name"
                        placeholder="Ex: João Silva"
                        value={barberName}
                        onChange={(e) => setBarberName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio/Descrição</Label>
                      <Input
                        id="bio"
                        placeholder="Descreva sua barbearia em poucas linhas"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        placeholder="Rua, número, bairro"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          placeholder="(11) 99999-9999"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        placeholder="@suabarbearia"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                      />
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button onClick={handleSaveProfile}>Salvar Perfil</Button>
                      <Button variant="outline">Cancelar</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB: CONFIGURAÇÕES */}
              <TabsContent value="configuracoes" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Horário de Funcionamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <input
                        type="checkbox"
                        id="automatic-hours"
                        checked={automaticHours}
                        onChange={(e) => setAutomaticHours(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <Label
                        htmlFor="automatic-hours"
                        className="cursor-pointer flex-1"
                      >
                        Usar horário automático
                      </Label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="open-time">Horário de Abertura</Label>
                        <Input
                          id="open-time"
                          type="time"
                          value={openTime}
                          onChange={(e) => setOpenTime(e.target.value)}
                          disabled={!automaticHours}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="close-time">
                          Horário de Fechamento
                        </Label>
                        <Input
                          id="close-time"
                          type="time"
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                          disabled={!automaticHours}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg border">
                      <input
                        type="checkbox"
                        id="is-open"
                        checked={isOpen}
                        onChange={(e) => setIsOpen(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <Label
                        htmlFor="is-open"
                        className="cursor-pointer flex-1"
                      >
                        Aberto agora (override manual)
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Métodos de Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(paymentMethods).map(([method, enabled]) => (
                      <div
                        key={method}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() =>
                          togglePaymentMethod(
                            method as keyof typeof paymentMethods
                          )
                        }
                      >
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => {}}
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="flex-1 capitalize font-medium text-sm">
                          {method === "pix"
                            ? "Pix"
                            : method === "cartao"
                            ? "Cartão de Crédito/Débito"
                            : method === "dinheiro"
                            ? "Dinheiro"
                            : "Fiado"}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button onClick={handleSaveSettings}>
                    Salvar Configurações
                  </Button>
                  <Button variant="outline">Cancelar</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedPage>
  );
}
