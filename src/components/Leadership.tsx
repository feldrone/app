import { team } from "../data/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Leadership & expertise — company-first, not person-first.
 * Deliberately minimal: name, role, one line of context. No biographies,
 * no timelines, no invented titles. People appear strictly as a trust
 * signal supporting the brand. New members can be appended to
 * `data/content.ts → team`; this layout adapts to 1..N entries.
 */
export default function Leadership() {
  return (
    <section id="direction" aria-labelledby="leadership-heading" className="bg-white py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHeading
              id="leadership-heading"
              eyebrow="Direction"
              title="Leadership & expertise"
              lede="Une gouvernance resserrée, appuyée sur une expertise aéronautique et technique directement engagée dans les opérations."
            />
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="border-t border-line">
              {team.map((member, i) => (
                <Reveal key={member.name} as="li" delay={i * 80} className="border-b border-line">
                  <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:gap-7">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center border border-line bg-paper font-display text-[14px] font-semibold tracking-wide text-navy-900"
                      aria-hidden="true"
                    >
                      {member.initials}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
                        <h3 className="text-[17px] font-semibold tracking-tight text-navy-900">
                          {member.name}
                        </h3>
                        <span className="whitespace-nowrap text-[12.5px] font-medium tracking-[0.08em] text-signal-600 uppercase">
                          {member.role}
                        </span>
                      </div>
                      {member.note && (
                        <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
                          {member.note}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-mute">
              Les rôles ci-dessus reflètent les fonctions exercées au sein de la société.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
