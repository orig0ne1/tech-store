"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";
import { z } from "zod";
import { getProducts } from "@/lib/products";
import { createAvailabilityRequest } from "@/lib/requests";
import { getErrorMessage } from "@/lib/api";
import { emailSchema, nameSchema, phoneSchema } from "@/lib/schemas";
import type { ProductSummary } from "@/types/product";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { SuccessState } from "../ui/SuccessState";

const availabilitySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  productId: z.string().min(1, "Выберите товар"),
});

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

export function AvailabilityForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("productId");

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      productId: preselected ? String(preselected) : "",
    },
  });

  useEffect(() => {
    getProducts({ size: 100, sort: "name,asc" })
      .then((page) => setProducts(page.content))
      .catch((error) => setProductsError(getErrorMessage(error)));
  }, []);

  const onSubmit = async (values: AvailabilityFormValues) => {
    setServerError(null);
    try {
      await createAvailabilityRequest({
        productId: Number(values.productId),
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
      });
      setSuccess(true);
      reset();
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  if (success) {
    return (
      <SuccessState
        title="Мы сообщим о поступлении"
        description="Как только товар появится в наличии, мы напишем вам на указанный email."
        action={
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Оставить ещё одну заявку
          </button>
        }
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div>
        <label
          htmlFor="availability-product"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Товар
        </label>
        {productsError ? (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {productsError}
          </p>
        ) : (
          <Select
            id="availability-product"
            disabled={products.length === 0}
            {...register("productId")}
          >
            <option value="">Выберите товар</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
        )}
        {errors.productId && (
          <p className="mt-1.5 text-xs text-danger">
            {errors.productId.message}
          </p>
        )}
      </div>
      <Input
        label="Имя"
        placeholder="Иван"
        autoComplete="name"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        placeholder="ivan@example.com"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Телефон"
        type="tel"
        placeholder="+7 (999) 000-00-00"
        autoComplete="tel"
        {...register("phone")}
        error={errors.phone?.message}
      />
      {serverError && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        <Bell className="size-4" />
        Сообщить о поступлении
      </Button>
    </form>
  );
}
