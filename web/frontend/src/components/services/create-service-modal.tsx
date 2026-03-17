"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createServiceSchema,
  type CreateServiceInput,
} from "@/schemas/service.schema";
import { useCreateService } from "@/hooks/use-services";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";

interface CreateServiceModalProps {
  children?: React.ReactNode;
}

export default function CreateServiceModal({
  children,
}: CreateServiceModalProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { upload, isUploading, progress } = useImageUpload();
  const createService = useCreateService();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceInput>({
    // @ts-expect-error - Zod coercion types sometimes conflict with react-hook-form's expected input types
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isActive: true,
    },
  });

  const onSubmit: SubmitHandler<CreateServiceInput> = async (data) => {
    try {
      await createService.mutateAsync({
        ...data,
        imageUrl: imageUrl || undefined,
      });
      setOpen(false);
      reset();
      setImageUrl(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await upload(file);
    if (result) {
      setImageUrl(result.url);
      setValue("imageUrl", result.url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="rounded-xl gap-2 h-10 px-6 font-bold shadow-glow hover:shadow-glow-lg transition-all">
            <Plus className="w-5 h-5" /> Novo Serviço
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Criar Novo Serviço
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
          className="space-y-6 py-4"
        >
          <div className="space-y-4">
            {/* Image Upload Area */}
            <div className="space-y-2">
              <Label>Thumbnail do Serviço</Label>
              <div
                className={cn(
                  "relative aspect-video rounded-2xl border-2 border-dashed border-border overflow-hidden group flex flex-col items-center justify-center transition-colors bg-muted/5",
                  imageUrl ? "border-solid" : "hover:border-primary/50",
                )}
              >
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setImageUrl(null);
                        setValue("imageUrl", "");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer w-full h-full justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    {isUploading ? (
                      <div className="w-full max-w-[200px] px-4 space-y-1">
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground">
                          {progress}%
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Clique para carregar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG até 10MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
              {errors.imageUrl && (
                <p className="text-xs text-destructive">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
                id="name"
                placeholder="Ex: Consultoria Técnica"
                className="rounded-xl"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (Kz)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                className="rounded-xl"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o que o seu serviço oferece..."
                className="rounded-xl min-h-[100px]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="w-full rounded-xl font-bold h-12 shadow-glow"
              disabled={isSubmitting || isUploading || createService.isPending}
            >
              {isSubmitting || createService.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Publicar Serviço"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
