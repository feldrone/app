import { team } from "../data/content";
import Reveal from "./Reveal";

/**
 * Leadership & Expertise — company-first, not person-first.
 * Deliberately minimal: name, role, one line of context. No biographies,
 * no timelines, no invented titles. FEL DRONE remains the subject; people
 * are presented strictly as a trust signal supporting the brand.
 */
export default function Leadership() {
  return (
    <section id="direction" aria-labelledby="leadership-heading" className="bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-[12px] font-medium tracking-[0.24em] text-[#6b7280] uppercase">
                <span className="h-px w-8 bg-[#b4823c]" aria-hidden="true" />
                Direction
              </p>
              <h2 id="leadership-heading" className="font-display text-3xl font-semibold tracking-tight text-[#0e1f30] sm:text-4xl">
                Leadership &amp; Expertise
              </h2>
              <p className="mt-6 text-[15.5px] leading-relaxed text-[#3a3f47]">
                Une gouvernance resserrée, appuyée sur une expertise aéronautique et technique
                directement engagée dans les opérations de l'entreprise.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-[#e4e2dd] border-t border-b border-[#e4e2dd]">
              {team.map((member, i) => (
                <Reveal key={member.name} delay={i * 80} as="div">
                  <li className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:gap-8">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#e4e2dd] font-display text-[13px] font-semibold tracking-wide text-[#0e1f30]"
                      aria-hidden="true"
                    >
                      {member.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-[17px] font-semibold text-[#0e1f30]">{member.name}</h3>
                        <span className="text-[13px] font-medium tracking-wide text-[#b4823c]">{member.role}</span>
                      </div>
                      <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-[#3a3f47]">{member.note}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
