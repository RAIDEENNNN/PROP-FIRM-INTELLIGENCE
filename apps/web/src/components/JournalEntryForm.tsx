"use client";

import { useState } from "react";

const journalFields = ["Entry", "Exit", "Risk", "Screenshot", "Emotion", "Mistake", "Lesson", "Chart notes"];

export function JournalEntryForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  function update(field: string, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function save() {
    const hasEntry = Object.values(values).some((value) => value.trim().length > 0);

    if (!hasEntry) {
      setSaved(false);
      return;
    }

    const existing = JSON.parse(window.localStorage.getItem("fundedscope_journal_entries") ?? "[]") as Array<Record<string, string>>;
    const entry = {
      ...values,
      savedAt: new Date().toISOString()
    };

    window.localStorage.setItem("fundedscope_journal_entries", JSON.stringify([entry, ...existing].slice(0, 20)));
    setSaved(true);
  }

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {journalFields.map((field) => (
          <input
            key={field}
            value={values[field] ?? ""}
            onChange={(event) => update(field, event.target.value)}
            className="min-h-12 rounded-2xl border border-white/10 bg-void px-4 py-3 text-white outline-none transition focus:border-electric/60"
            placeholder={field}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={save}
        className="mt-5 min-h-12 w-full rounded-2xl bg-electric px-4 py-3 font-bold text-void transition hover:scale-[1.01] active:scale-[0.99]"
      >
        Save to Trader DNA
      </button>
      {saved ? (
        <p className="mt-4 rounded-2xl border border-success/25 bg-success/10 p-3 text-sm font-bold text-success">
          Saved. Sign in to keep your Trading DNA history available across devices.
        </p>
      ) : null}
    </>
  );
}
