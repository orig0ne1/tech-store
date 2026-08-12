"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { z } from "zod";
import { createCustomerRequest } from "@/lib/requests";
import { getErrorMessage } from "@/lib/api";
import { useLocale } from "@/context/LocaleProvider";
import type { Dictionary } from "@/lib/i18n";
import {
  createEmailSchema,
  createMessageSchema,
  createNameSchema,
  createPhoneSchema,
} from "@/lib/schemas";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { SuccessState } from "../ui/SuccessState";
import { cn } from "@/lib/utils";

type RequestFormValues = z.infer<ReturnType<typeof buildSchema>>;

function buildSchema(t: Dictionary) {
  return z.object({
    name: createNameSchema(t),
    email: createEmailSchema(t),
    phone: createPhoneSchema(t),
    message: createMessageSchema(t),
  });
}

interface RequestFormProps {
  className?: string;
  defaultMessage?: string;
}

export function RequestForm({ className, defaultMessage = "" }: RequestFormProps) {
  const { t } = useLocale();
  const requestSchema = useMemo(() => buildSchema(t), [t]);
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
      setServerError(getErrorMessage(error, t));
    }
  };

  if (success) {
    return (
      <SuccessState
        title={t.request.successTitle}
        description={t.request.successDescription}
        action={
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t.common.sendAnother}
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
      <div>
        <label
          htmlFor="request-message"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {t.common.message}
        </label>
        <textarea
          id="request-message"
          rows={4}
          placeholder={t.common.messagePlaceholder}
          className="w-full resize-none rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm transition-all focus:border-transparent focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
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
        {t.common.submitRequestButton}
      </Button>
    </form>
  );
}
