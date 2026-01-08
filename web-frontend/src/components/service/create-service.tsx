"use client";

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
import useServices from "@/hooks/use-services";

const createServiceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z
    .number({ message: "Preço deve ser um número" })
    .positive("Preço deve ser um número positivo"),
});

export type CreateServiceForm = z.infer<typeof createServiceSchema>;
interface CreateServiceProps {
  onClose: () => void;
  onSuccess?: (data: CreateServiceForm) => void;
  setLoading: (isLoading: boolean) => void;
}

export const CreateFormService = ({
  onClose,
  onSuccess,
  setLoading,
}: CreateServiceProps) => {
  const {
    createService,
    isPending: isCreating,
  } = useServices();
  const form = useForm<CreateServiceForm>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const onSubmit = async (data: CreateServiceForm) => {
    try {
      setLoading(true);
      const result = await createService(data);

      if (!result) {
        throw new Error("No data returned from createService");
      }

      if (onSuccess) {
        onSuccess(data);
      }

      toast.success("Serviço criado com sucesso!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar serviço");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle>Criar Serviço</DialogTitle>
        <DialogDescription>
          Insira os detalhes do serviço que deseja criar.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nome do serviço"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Insira o nome do serviço.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Descrição do serviço"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Insira a descrição do serviço.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (Kz) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Preço do serviço"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Insira o preço do serviço em Kwanzas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCreating}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Salvando..." : "Criar Serviço"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
