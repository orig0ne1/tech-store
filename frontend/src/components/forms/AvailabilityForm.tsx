"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";
import { z } from "zod";
import { getProducts } from "@/lib/products";
import { createAvailabilityRequest } from "@/lib/requests";
import { getErrorMessage } from "@/lib/api";
import { useLocale } from "@/context/LocaleProvider";
import type { Dictionary } from "@/lib/i18n";
import {
  createEmailSchema,
  createNameSchema,
  createPhoneSchema,
} from "@/lib/schemas";
import type { ProductSummary } from "@/types/product";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { SuccessState } from "../ui/SuccessState";

function buildSchema(t: Dictionary) {
  return z.object({
    name: createNameSchema(t),
    email: createEmailSchema(t),
    phone: createPhoneSchema(t),
    productId: z.string().min(1, t.validation.selectProduct),
  });
}

type AvailabilityFormValues = z.infer<ReturnType<typeof buildSchema>>;

export function AvailabilityForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("productId");
  const { t } = useLocale();
  const availabilitySchema = useMemo(() => buildSchema(t), [t]);

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
      .catch((error) => setProductsError(getErrorMessage(error, t)));
  }, [t]);

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
      setServerError(getErrorMessage(error, t));
    }
  };

  if (success) {
    return (
      <SuccessState
        title={t.availability.successTitle}
        description={t.availability.successDescription}
        action={
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t.availability.submitAgain}
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
          {t.common.productLabel}
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
            <option value="">{t.common.selectProduct}</option>
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
        label={t.common.name}
        placeholder={t.common.namePlaceholder}
        autoComplete="name"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label={t.common.email}
        type="email"
        placeholder={t.common.emailPlaceholder}
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label={t.common.phone}
        type="tel"
        placeholder={t.common.phonePlaceholder}
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
        {t.common.notifyMe}
      </Button>
    </form>
  );
}
