"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function ServiceForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <div className="max-w-xl mx-auto p-8 bg-card border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold italic tracking-tight">
              O que você <span className="text-primary italic">oferece?</span>
            </h2>
            <div className="space-y-2">
              <Label>Título do Serviço</Label>
              <Input
                placeholder="Ex: Manutenção de Ar Condicionado"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="h-12 border-2 hover:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <select
                className="w-full h-12 rounded-xl border-2 border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Selecione uma categoria</option>
                <option value="cleaning">Limpeza</option>
                <option value="tech">Tecnologia</option>
                <option value="maintenance">Manutenção</option>
              </select>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Conte mais detalhes</h2>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <textarea
                className="w-full h-32 rounded-xl border-2 border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Descreva o serviço em poucas palavras..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Defina seu valor</h2>
            <div className="space-y-2">
              <Label>Preço por serviço</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
                  R$
                </span>
                <Input
                  type="number"
                  placeholder="0,00"
                  className="h-12 border-2 pl-12 font-bold text-lg"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-sm">
                Ao registrar, seu serviço ficará visível para milhares de
                clientes.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1}
          className="gap-2 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        <Button
          onClick={step === 3 ? () => alert("Serviço registrado!") : nextStep}
          className="gap-2 px-8 font-bold h-12"
        >
          {step === 3 ? "Finalizar" : "Próximo"}
          {step < 3 && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Decorative effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
    </div>
  );
}
