"use client";

export function BackButton({ label = "← Return to previous page" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          window.history.back();
          return;
        }
        window.location.href = "/";
      }}
      className="rounded-full border border-white/10 px-6 py-3 font-black text-white transition hover:border-electric/40"
    >
      {label}
    </button>
  );
}
