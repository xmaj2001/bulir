"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { UserService } from "@/http/user/user.service";
import { useAuth } from "@/context/AuthContext";

const updateBalanceSchema = z.object({
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0,
      "Valor deve ser um número positivo"
    ),
});

export type UpdateBalanceForm = z.infer<typeof updateBalanceSchema>;

interface UpdateBalanceProps {
  onClose: () => void;
  onSuccess?: (data: UpdateBalanceForm) => void;
  setLoading: (isLoading: boolean) => void;
}

export const UpdateBalance = ({
  onClose,
  onSuccess,
  setLoading,
}: UpdateBalanceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuth();
  const form = useForm<UpdateBalanceForm>({
    resolver: zodResolver(updateBalanceSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = async (data: UpdateBalanceForm) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const result = await UserService.updateBalance(
        accessToken ?? "",
        parseFloat(form.getValues("amount"))
      );
      
      if(!result) {
        throw new Error("No data returned from updateBalance");
      }

      if (onSuccess) {
        onSuccess(data);
      }

      toast.success("Saldo atualizado com sucesso!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar saldo");
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Atualizar Saldo</DialogTitle>
        <DialogDescription>
          Insira o valor que deseja adicionar ao seu saldo.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Insira um valor positivo para adicionar ao seu saldo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="p-3 border rounded-md bg-muted">
            <p className="text-sm font-medium">Saldo atual</p>
            <p className="text-xs text-muted-foreground">
              Será atualizado após a confirmação.
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
