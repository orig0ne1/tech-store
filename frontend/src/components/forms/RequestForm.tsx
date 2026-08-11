"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { z } from "zod";
import { createCustomerRequest } from "@/lib/requests";
import { getErrorMessage } from "@/lib/api";
import { emailSchema, messageSchema, nameSchema, phoneSchema } from "@/lib/schemas";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SuccessState } from "../ui/SuccessState";
import { cn } from "@/lib/utils";

const requestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: messageSchema,
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface RequestFormProps {
  className?: string;
  defaultMessage?: string;
}

export function RequestForm({ className, defaultMessage = "" }: RequestFormProps) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { name: "", email: "", phone: "", message: defaultMessage },
  });

  const onSubmit = async (values: RequestFormValues) => {
    setServerError(null);
    try {
      await createCustomerRequest({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        message: values.message,
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
        title="Заявка отправлена"
        description="Спасибо! Мы свяжемся с вами в ближайшее время."
        action={
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Отправить ещё одну заявку
          </button>
        }
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4", className)}
      noValidate
    >
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
      <div>
        <label
          htmlFor="request-message"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Сообщение
        </label>
        <textarea
          id="request-message"
          rows={4}
          placeholder="Расскажите, чем мы можем помочь"
          className="w-full resize-none rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-danger">{errors.message.message}</p>
        )}
      </div>
      {serverError && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}
      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        <Send className="size-4" />
        Отправить заявку
      </Button>
    </form>
  );
}
