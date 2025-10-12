import { MessageSquareX, CalendarX, UserX, Clock } from "lucide-react";

export default function ProblemSection() {
  const problems = [
    {
      icon: MessageSquareX,
      title: "Mensagens chegando o dia todo",
      description: "Você não para de responder WhatsApp e ainda assim esquece clientes"
    },
    {
      icon: CalendarX,
      title: "Confusão com horários",
      description: "Marcações desencontradas e clientes aparecendo no horário errado"
    },
    {
      icon: UserX,
      title: "Clientes que 'furam'",
      description: "Sem confirmação automática, você perde tempo e dinheiro"
    },
    {
      icon: Clock,
      title: "Tempo perdido",
      description: "Horas do seu dia gastas organizando agenda ao invés de cortando"
    }
  ];

  return (
    <section className="bg-[hsl(220,30%,15%)] py-16 md:py-24 lg:py-32 text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            💡 Todo barbeiro já passou por isso...
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Você trabalha duro — seu sistema precisa trabalhar por você.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-white/10"
              data-testid={`problem-card-${index}`}
            >
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{problem.title}</h3>
              <p className="text-white/70 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
