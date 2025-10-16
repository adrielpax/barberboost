import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Lucas Silva",
      location: "Belo Horizonte",
      rating: 5,
      text: "Antes eu esquecia até quem tinha marcado. Agora o MeuBarbeiro lembra por mim — meus clientes acham que é milagre.",
    },
    {
      name: "Rafael Barros",
      location: "Rafa Barber Studio, SP",
      rating: 5,
      text: "Ganhei tempo e passei a parecer muito mais profissional. Meus clientes adoram a facilidade de agendar pelo link.",
    },
    {
      name: "Carlos Mendes",
      location: "Rio de Janeiro",
      rating: 5,
      text: "Acabou a bagunça na agenda! Agora consigo focar no que importa: fazer cortes incríveis.",
    },
  ];

  return (
    <section className="bg-background py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            🔁 O que nossos barbeiros dizem
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 space-y-4 border hover-elevate transition-all"
              data-testid={`testimonial-card-${index}`}
            >
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-lg leading-relaxed">
                💬 &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="pt-4 border-t">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
