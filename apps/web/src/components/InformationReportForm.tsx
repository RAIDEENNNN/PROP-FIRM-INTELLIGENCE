"use client";

import { useState } from "react";
import { hasPersistenceApi, persistenceFetch } from "../lib/persistence-api";

const categories = ["prop_firm", "broker", "spread", "rule", "payout", "review", "availability", "other"];

export function InformationReportForm() {
  const [reportedPage, setReportedPage] = useState("");
  const [reportedCompany, setReportedCompany] = useState("");
  const [category, setCategory] = useState("other");
  const [explanation, setExplanation] = useState("");
  const [supportingUrl, setSupportingUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!hasPersistenceApi()) {
      setStatus("Report submission is temporarily unavailable. Please email hello@myfundedscope.com with the page, issue and supporting source.");
      return;
    }

    try {
      setLoading(true);
      await persistenceFetch("/persistence/information-reports", {
        method: "POST",
        body: JSON.stringify({
          reportedPage,
          reportedCompany,
          category,
          explanation,
          supportingUrl
        })
      });
      setStatus("Report submitted. It is now in the admin moderation queue.");
      setReportedPage("");
      setReportedCompany("");
      setExplanation("");
      setSupportingUrl("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to submit report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <label className="text-sm font-bold text-slate-300">
        Page or URL with the problem
        <input value={reportedPage} onChange={(event) => setReportedPage(event.target.value)} required className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="/prop-firms/ftmo or full URL" />
      </label>
      <label className="text-sm font-bold text-slate-300">
        Company / broker / firm
        <input value={reportedCompany} onChange={(event) => setReportedCompany(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="FTMO, Exness, FundingPips..." />
      </label>
      <label className="text-sm font-bold text-slate-300">
        Category
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white">
          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-bold text-slate-300">
        What is wrong?
        <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} required minLength={10} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="Explain the incorrect field and what should be reviewed." />
      </label>
      <label className="text-sm font-bold text-slate-300">
        Supporting source URL
        <input value={supportingUrl} onChange={(event) => setSupportingUrl(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-white" placeholder="https://official-source.example/rules" />
      </label>
      <button disabled={loading} className="rounded-2xl bg-white px-6 py-4 font-black text-void disabled:opacity-60">
        {loading ? "Submitting..." : "Submit to moderation queue"}
      </button>
      {status ? <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">{status}</p> : null}
    </form>
  );
}
