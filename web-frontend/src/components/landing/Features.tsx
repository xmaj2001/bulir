'use client';
import { motion } from "framer-motion";
import { 
  CalendarCheck, 
  Wallet, 
  History, 
  ShieldCheck, 
  Users, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Reservas Simplificadas",
    description: "Agende serviços em poucos cliques. Interface intuitiva e fluxo otimizado.",
  },
  {
    icon: Wallet,
    title: "Gestão de Saldo",
    description: "Controle total do seu saldo. Recarregue e acompanhe todas as transações.",
  },
  {
    icon: History,
    title: "Histórico Completo",
    description: "Acesse todo o histórico de reservas, pagamentos e serviços realizados.",
  },
  {
    icon: ShieldCheck,
    title: "Transações Atômicas",
    description: "Segurança máxima. Cada transação é processada de forma única e consistente.",
  },
  {
    icon: Users,
    title: "Rede de Prestadores",
    description: "Milhares de prestadores verificados prontos para atender você.",
  },
  {
    icon: Zap,
    title: "Tempo Real",
    description: "Atualizações instantâneas. Acompanhe o status das suas reservas ao vivo.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 relative" id="how-it-works">
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
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            Tudo o que você precisa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma completa para clientes e prestadores de serviço, 
            com foco em segurança e experiência do utilizador.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-card rounded-lg p-6 hover-lift cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
