"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  patientSchema,
  type PatientInput,
  PATIENT_TYPES,
  SUPPORT_OPTIONS,
  CONTACT_METHODS,
} from "@/lib/schemas";
import { submitForm } from "@/lib/submitForm";
import { Field, inputClassName } from "@/components/ui/Field";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import { EmergencyBanner } from "@/components/EmergencyBanner";

const MAX_DESC = 1000;

export function PatientForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: { preferredContact: "Phone", website: "" },
  });

  const [done, setDone] = useState<{ refId: string; name: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const descLen = (watch("description") ?? "").length;

  async function onSubmit(values: PatientInput) {
    setServerError(null);
    const res = await submitForm("patient", values);
    if (!res.ok || !res.refId) {
      setServerError(res.error ?? "Something went wrong. Please try again.");
      return;
    }
    setDone({ refId: res.refId, name: values.name });
    reset();
  }

  if (done) {
    return (
      <SuccessBanner
        title="Request received"
        refId={done.refId}
        onReset={() => setDone(null)}
      >
        <p>
          Thank you, {done.name.split(" ")[0]}. A member of the Jarurat Care Foundation team
          will review your request and contact you within <strong>24-48 hours</strong> via
          your preferred method.
        </p>
        <p className="mt-2 text-foreground/60">
          If this is a medical emergency, please contact your local emergency services
          immediately. Questions? Email{" "}
          <a className="text-teal-600 underline dark:text-teal-400" href="mailto:Priyanka.joshi@jarurat.care">
            Priyanka.joshi@jarurat.care
          </a>
          .
        </p>
      </SuccessBanner>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <EmergencyBanner />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" required error={errors.name?.message}>
          <input id="name" className={inputClassName} placeholder="e.g. Aditya Singh" {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email?.message}>
          <input id="email" type="email" className={inputClassName} placeholder="you@example.com" {...register("email")} />
        </Field>
        <Field label="Phone" htmlFor="phone" required error={errors.phone?.message}>
          <input id="phone" type="tel" className={inputClassName} placeholder="+91 98765 43210" {...register("phone")} />
        </Field>
        <Field label="City" htmlFor="city" required error={errors.city?.message}>
          <input id="city" className={inputClassName} placeholder="e.g. Mumbai" {...register("city")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Who needs support?" htmlFor="patientType" required error={errors.patientType?.message}>
          <select id="patientType" className={inputClassName} defaultValue="" {...register("patientType")}>
            <option value="" disabled>Select…</option>
            {PATIENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Support needed" htmlFor="supportNeeded" required error={errors.supportNeeded?.message}>
          <select id="supportNeeded" className={inputClassName} defaultValue="" {...register("supportNeeded")}>
            <option value="" disabled>Select…</option>
            {SUPPORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field
        label="Brief description"
        htmlFor="description"
        required
        error={errors.description?.message}
        hint={`${descLen}/${MAX_DESC}`}
      >
        <textarea
          id="description"
          rows={4}
          maxLength={MAX_DESC}
          className={inputClassName}
          placeholder="Tell us a little about the situation and how we can help."
          {...register("description")}
        />
      </Field>

      <Field label="Preferred contact method" htmlFor="preferredContact" required error={errors.preferredContact?.message}>
        <div className="flex flex-wrap gap-2" id="preferredContact">
          {CONTACT_METHODS.map((m) => (
            <label
              key={m}
              className="cursor-pointer rounded-lg border border-black/10 px-4 py-2 text-sm transition has-checked:border-teal-500 has-checked:bg-teal-500/10 has-checked:font-medium has-checked:text-teal-700 dark:border-white/15 dark:has-checked:text-teal-300"
            >
              <input type="radio" value={m} className="sr-only" {...register("preferredContact")} />
              {m}
            </label>
          ))}
        </div>
      </Field>

      
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

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
        {isSubmitting ? "Submitting…" : "Submit request"}
      </button>
    </form>
  );
}
