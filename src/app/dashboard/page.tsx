"use client";

import { useAuth } from "@/context/AuthProvider";
import { useFetchSupabase } from "@/hooks/useFetchSupabase";
import { useUpdateSupabase } from "@/hooks/useUpdateSupabase";

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
  Scissors,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { barberData, loading, logout } = useAuth();
  const { toast } = useToast();
  const [barbershopName, setBarbershopName] = useState("");

  const shouldFetch = !!barberData?.id;

  const { data: financialData } = useFetchSupabase({
    table: "financial",
    filters: { barber_id: barberData?.id },
  });

  const { data: entries } = useFetchSupabase({
    table: "entries",
    filters: { barber_id: barberData?.id },
  });

  // Supondo que temos o username do barbeiro do usuário logado; para mockar, use "barbearia-do-joao" ou similar
  function toSlug(text: string) {
    return text
      .toLowerCase() // tudo em minúsculas
      .trim() // remove espaços extras no início/fim
      .replace(/\s+/g, "-") // substitui espaços por hífen
      .replace(/[^\w\-]+/g, "") // remove caracteres especiais
      .replace(/\-\-+/g, "-"); // substitui múltiplos hífens por 1
  }
  const username = toSlug(barberData?.barbershop_name || "");
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

  // todo: remove mock functionality
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

  if (loading) return <p>Carregando... </p>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-background" />
            </div>
            <span className="font-bold text-xl">Meu Barbeiro</span>
          </div>
          <Button onClick={() => logout} variant="outline" size="sm">
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {/* 👋  */}
              Bem-vindo {barberData?.name?.split(" ")[0]}, ao seu painel! 🎉
            </h1>
            <p className="text-muted-foreground">
              Complete seu cadastro e comece a receber agendamentos,{" "}
              <button className="text-blue-500 font-medium underline">
                Clique Aqui
              </button>
            </p>
          </div>

          <Tabs defaultValue="link" className="space-y-6">
            <TabsList>
              <TabsTrigger value="link" data-testid="tab-link">
                Link de Agendamento
              </TabsTrigger>
              <TabsTrigger value="financeiro" data-testid="tab-financeiro">
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="perfil" data-testid="tab-perfil">
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Seu Link Personalizado
                  </CardTitle>
                  <CardDescription>
                    Compartilhe este link com seus clientes para que eles possam
                    agendar online.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={barberPageLink}
                      readOnly
                      className="font-mono"
                      data-testid="input-booking-link"
                    />
                    <Button onClick={copyLink} data-testid="button-copy-link">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={openBarberPage}
                      data-testid="button-open-barber"
                    >
                      Ver página
                    </Button>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm">
                      💡 <strong>Dica:</strong> Adicione este link na bio do
                      Instagram, no status do WhatsApp ou envie diretamente aos
                      seus clientes!
                    </p>
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
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Você ainda não tem agendamentos</p>
                    <p className="text-sm mt-1">
                      Compartilhe seu link para começar!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {/* {mockFinancialData.today.toFixed(2)} */}
                      R$ {financialData?.today?.toFixed(2) ?? 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Esta Semana
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {mockFinancialData.week.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Este Mês
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {mockFinancialData.month.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Entradas e Saídas</CardTitle>
                  <CardDescription>
                    Histórico das suas movimentações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <div className="space-y-3">
                    {mockEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        data-testid={`entry-${entry.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {entry.type === "entrada" ? (
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                              <TrendingDown className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{entry.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {entry.date}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-semibold ${
                            entry.type === "entrada"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {entry.type === "entrada" ? "+" : "-"}R${" "}
                          {entry.value.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div> */}
                  {entries?.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {entry.type === "entrada" ? (
                          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{entry.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.date}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`font-semibold ${
                          entry.type === "entrada"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {entry.type === "entrada" ? "+" : "-"}R${" "}
                        {entry.value.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="perfil" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Barbearia</CardTitle>
                  <CardDescription>
                    Complete seu perfil para começar a receber agendamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="barbershop-name">Nome da Barbearia</Label>
                    <Input
                      id="barbershop-name"
                      placeholder="Ex: Barbearia do João"
                      value={barbershopName}
                      onChange={(e) => setBarbershopName(e.target.value)}
                      data-testid="input-barbershop-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, bairro"
                      data-testid="input-address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        data-testid="input-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        placeholder="@suabarbearia"
                        data-testid="input-instagram"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        toast({
                          title: "Perfil atualizado!",
                          description:
                            "Suas informações foram salvas com sucesso",
                        });
                      }}
                      data-testid="button-save-profile"
                    >
                      Salvar Informações
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plano Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">Plano Essencial</p>
                      <p className="text-sm text-muted-foreground">
                        Grátis para sempre
                      </p>
                    </div>
                    <Button variant="outline">Fazer Upgrade</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
