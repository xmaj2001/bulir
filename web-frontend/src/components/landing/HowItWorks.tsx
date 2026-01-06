'use client';
import { motion } from "framer-motion";
import { UserPlus, Search, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description: "Registe-se em segundos com email e senha. Verifique sua identidade para maior segurança.",
  },
  {
    icon: Search,
    number: "02",
    title: "Encontre serviços",
    description: "Navegue por categorias ou pesquise diretamente. Filtre por preço, avaliação e localização.",
  },
  {
    icon: CreditCard,
    number: "03",
    title: "Reserve e pague",
    description: "Escolha o serviço, confirme a data e pague com segurança. Transação atómica garantida.",
  },
  {
    icon: CheckCircle,
    number: "04",
    title: "Aproveite",
    description: "Receba o serviço e avalie a experiência. Construa histórico e reputação na plataforma.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Como Funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Simples e rápido
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Em apenas 4 passos você pode reservar qualquer serviço na nossa plataforma.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}
              
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
