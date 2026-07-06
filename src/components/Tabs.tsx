"use client";

import { useState } from "react";
import { PatientForm } from "@/components/forms/PatientForm";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { ContactForm } from "@/components/forms/ContactForm";

const TABS = [
  { id: "patient", label: "Patient Support" },
  { id: "volunteer", label: "Volunteer" },
  { id: "contact", label: "Contact Us" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Tabs() {
  const [active, setActive] = useState<TabId>("patient");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Support options"
        className="flex gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/10"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={
              "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm " +
              (active === t.id
                ? "bg-white text-teal-700 shadow-sm dark:bg-white/15 dark:text-teal-300"
                : "text-foreground/60 hover:text-foreground")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "patient" && <PatientForm />}
        {active === "volunteer" && <VolunteerForm />}
        {active === "contact" && <ContactForm />}
      </div>
    </div>
  );
}
