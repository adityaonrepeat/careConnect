"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { volunteerSchema, type VolunteerInput, AVAILABILITY } from "@/lib/schemas";
import { submitForm } from "@/lib/submitForm";
import { Field, inputClassName } from "@/components/ui/Field";
import { SuccessBanner } from "@/components/ui/SuccessBanner";

const MAX_REASON = 1000;

export function VolunteerForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerInput>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: { availability: "Flexible", website: "", profession: "" },
  });

  const [done, setDone] = useState<{ refId: string; name: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const reasonLen = (watch("reason") ?? "").length;

  async function onSubmit(values: VolunteerInput) {
    setServerError(null);
    const res = await submitForm("volunteer", values);
    if (!res.ok || !res.refId) {
      setServerError(res.error ?? "Something went wrong. Please try again.");
      return;
    }
    setDone({ refId: res.refId, name: values.name });
    reset();
  }

  if (done) {
    return (
      <SuccessBanner title="Application received" refId={done.refId} onReset={() => setDone(null)}>
        <p>
          Thank you for registering as a volunteer with Jarurat Care Foundation, {done.name.split(" ")[0]}.
          Your application has been received and our team will contact you if there&apos;s a
          suitable opportunity.
        </p>
      </SuccessBanner>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="v-name" required error={errors.name?.message}>
          <input id="v-name" className={inputClassName} placeholder="e.g. Aditya Singh" {...register("name")} />
        </Field>
        <Field label="Email" htmlFor="v-email" required error={errors.email?.message}>
          <input id="v-email" type="email" className={inputClassName} placeholder="you@example.com" {...register("email")} />
        </Field>
        <Field label="Phone" htmlFor="v-phone" required error={errors.phone?.message}>
          <input id="v-phone" type="tel" className={inputClassName} placeholder="+91 98765 43210" {...register("phone")} />
        </Field>
        <Field label="City" htmlFor="v-city" required error={errors.city?.message}>
          <input id="v-city" className={inputClassName} placeholder="e.g. Mumbai" {...register("city")} />
        </Field>
      </div>

      <Field label="Profession" htmlFor="v-profession" error={errors.profession?.message}>
        <input id="v-profession" className={inputClassName} placeholder="e.g. Nurse, Designer, Student" {...register("profession")} />
      </Field>

      <Field label="Skills / expertise" htmlFor="v-skills" required error={errors.skills?.message}>
        <input id="v-skills" className={inputClassName} placeholder="e.g. counselling, fundraising, social media" {...register("skills")} />
      </Field>

      <Field label="Availability" htmlFor="v-availability" required error={errors.availability?.message}>
        <div className="flex flex-wrap gap-2" id="v-availability">
          {AVAILABILITY.map((a) => (
            <label
              key={a}
              className="cursor-pointer rounded-lg border border-black/10 px-4 py-2 text-sm transition has-checked:border-teal-500 has-checked:bg-teal-500/10 has-checked:font-medium has-checked:text-teal-700 dark:border-white/15 dark:has-checked:text-teal-300"
            >
              <input type="radio" value={a} className="sr-only" {...register("availability")} />
              {a}
            </label>
          ))}
        </div>
      </Field>

      <Field
        label="Why do you want to volunteer?"
        htmlFor="v-reason"
        required
        error={errors.reason?.message}
        hint={`${reasonLen}/${MAX_REASON}`}
      >
        <textarea
          id="v-reason"
          rows={4}
          maxLength={MAX_REASON}
          className={inputClassName}
          placeholder="A sentence or two about what draws you to Jarurat Care."
          {...register("reason")}
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
        {isSubmitting ? "Submitting…" : "Register as volunteer"}
      </button>
    </form>
  );
}
