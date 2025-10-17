"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Scissors, ExternalLink } from "lucide-react";

export default function AdminPage() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // todo: remove mock functionality
  const pages = [
    {
      id: "home",
      name: "Landing Page Principal",
      path: "/",
      description: "Página principal com todas as seções",
    },
    {
      id: "essencial",
      name: "Plano Essencial",
      path: "/plano-essencial",
      description: "Página do plano gratuito",
    },
    {
      id: "profissional",
      name: "Plano Profissional",
      path: "/plano-profissional",
      description: "Página do plano mais vendido",
    },
    {
      id: "premium",
      name: "Plano Premium",
      path: "/plano-premium",
      description: "Página do plano master",
    },
  ];

  const mockLeads = [
    {
      id: 1,
      name: "João Silva",
      whatsapp: "(11) 99999-9999",
      email: "joao@email.com",
      plan: "profissional",
      date: "Hoje 14:32",
      status: "pending",
    },
    {
      id: 2,
      name: "Maria Santos",
      whatsapp: "(11) 98888-8888",
      email: "maria@email.com",
      plan: "essencial",
      date: "Hoje 11:20",
      status: "pending",
    },
    {
      id: 3,
      name: "Pedro Costa",
      whatsapp: "(11) 97777-7777",
      email: "pedro@email.com",
      plan: "premium",
      date: "Ontem 16:45",
      status: "pending",
    },
    {
      id: 4,
      name: "Ana Oliveira",
      whatsapp: "(11) 96666-6666",
      email: "",
      plan: "profissional",
      date: "Ontem 09:15",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-background" />
            </div>
            <span className="font-bold text-xl">Meu Barbeiro - Admin</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Visualize todas as páginas e gerencie os leads capturados
            </p>
          </div>

          <Tabs defaultValue="pages" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pages" data-testid="tab-pages">
                Páginas
              </TabsTrigger>
              <TabsTrigger value="leads" data-testid="tab-leads">
                Leads Capturados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                  <Card
                    key={page.id}
                    className="hover-elevate transition-all cursor-pointer"
                    onClick={() => setSelectedPage(page.id)}
                    data-testid={`page-card-${page.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {page.name}
                        <ExternalLink className="w-4 h-4" />
                      </CardTitle>
                      <CardDescription>{page.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">
                            Preview
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(page.path, "_blank");
                          }}
                          data-testid={`button-view-${page.id}`}
                        >
                          Visualizar Página
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leads Capturados</CardTitle>
                  <CardDescription>
                    Total de {mockLeads.length} leads registrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover-elevate transition-all"
                        data-testid={`lead-${lead.id}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{lead.name}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                lead.plan === "premium"
                                  ? "bg-yellow-500/10 text-yellow-700"
                                  : lead.plan === "profissional"
                                  ? "bg-green-500/10 text-green-700"
                                  : "bg-blue-500/10 text-blue-700"
                              }`}
                            >
                              {lead.plan}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lead.whatsapp}
                          </p>
                          {lead.email && (
                            <p className="text-sm text-muted-foreground">
                              {lead.email}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {lead.date}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Status: Pendente
                          </p>
                        </div>
                      </div>
                    ))}
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
