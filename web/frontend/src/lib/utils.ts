import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApiService } from "@/lib/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function serviceToMenuItem(service: ApiService) {
  const tempImage = `https://placehold.co/900x900/1a1a1a/F97015?text=${encodeURIComponent(service.name)}`;
  return {
    image: service.imageUrl ?? tempImage,
    link: `/services/${service.id}`,
    title: service.name,
    description: `A partir de ${service.price.toLocaleString("pt-AO")} Kz`,
  };
}
