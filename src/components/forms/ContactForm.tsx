"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { submitForm } from "@/lib/submitForm";
import { Field, inputClassName } from "@/components/ui/Field";
import { SuccessBanner } from "@/components/ui/SuccessBanner";

const MAX_MESSAGE = 1000;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: "" },
  });

  const [done, setDone] = useState<{ refId: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const msgLen = (watch("message") ?? "").length;

  async function onSubmit(values: ContactInput) {
    setServerError(null);
    const res = await submitForm("contact", values);
    if (!res.ok || !res.refId) {
      setServerError(res.error ?? "Something went wrong. Please try again.");
      return;
    }
    setDone({ refId: res.refId });
    reset();
  }

  if (done) {
    return (
      <SuccessBanner title="Message sent" refId={done.refId} onReset={() => setDone(null)}>
        <p>
          Thank you for contacting Jarurat Care Foundation. We&apos;ve received your message and
          will get back to you within <strong>24-48 hours</strong>.
        </p>
      </SuccessBanner>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="c-name" required error={errors.name?.message}>
          <input id="c-name" className={inputClassName} placeholder="e.g. Aditya Singh" {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="c-email" required error={errors.email?.message}>
          <input id="c-email" type="email" className={inputClassName} placeholder="you@example.com" {...register("email")} />
        </Field>
      </div>

      <Field label="Subject" htmlFor="c-subject" required error={errors.subject?.message}>
        <input id="c-subject" className={inputClassName} placeholder="What is this about?" {...register("subject")} />
      </Field>

      <Field
        label="Message"
        htmlFor="c-message"
        required
        error={errors.message?.message}
        hint={`${msgLen}/${MAX_MESSAGE}`}
      >
        <textarea
          id="c-message"
          rows={5}
          maxLength={MAX_MESSAGE}
          className={inputClassName}
          placeholder="How can we help?"
          {...register("message")}
        />
      </Field>

      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" {...register("website")} />

      {serverError && (
        <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus:ring-2 focus:ring-teal-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
