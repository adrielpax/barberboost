"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TesteBarbeariaPage() {
  const [barbershopName, setBarbershopName] = useState("Barbearia do João");

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const barbeariaUrl = `/${generateSlug(barbershopName)}`;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Teste de Link Dinâmico da Barbearia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="barbershop-name">Nome da Barbearia</Label>
              <Input
                id="barbershop-name"
                value={barbershopName}
                onChange={(e) => setBarbershopName(e.target.value)}
                placeholder="Digite o nome da barbearia"
              />
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Link gerado:</p>
              <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                {barbeariaUrl}
              </code>
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <Link href={barbeariaUrl}>Ver Página da Barbearia</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Voltar ao Início</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exemplos de Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Exemplos de como os links ficam:
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    Barbearia do João
                  </code>
                  <span className="text-sm">→</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    /barbearia/barbearia-do-joao
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    Studio Hair
                  </code>
                  <span className="text-sm">→</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    /barbearia/studio-hair
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    Corte & Estilo
                  </code>
                  <span className="text-sm">→</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    /barbearia/corte-estilo
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
