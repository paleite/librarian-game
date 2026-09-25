import { sections } from "@/game/catalog/sections";

export default function Home() {
  const firstFloorSections = sections.filter((section) => section.floor === 1).length;
  const secondFloorSections = sections.filter((section) => section.floor === 2).length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-6 py-16 sm:px-10">
      <section className="max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Bootstrap build
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          Librarian Game
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Sort thousands of scattered volumes into an arcane library. Progress will
          turn a manual classification problem into an increasingly automated
          logistics system.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Sections" value={sections.length} />
        <Stat label="First floor" value={firstFloorSections} />
        <Stat label="Second floor" value={secondFloorSections} />
      </section>

      <section className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6">
        <h2 className="text-xl font-semibold">Current milestone</h2>
        <p className="mt-2 text-[var(--muted)]">
          Static-export foundation is ready. The next implementation slice is the
          canonical book catalog, deterministic run generation, and the first
          playable sorting interaction.
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value}</p>
    </article>
  );
}
