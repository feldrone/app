import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import { company } from "../data/content";
import { PREFILL_EVENT } from "../utils/quote";
import Reveal from "./Reveal";
import { cn } from "../utils/cn";

const API_ENDPOINT = "/api/quote";

const SERVICE_OPTIONS = [
  "Topographie & photogrammétrie",
  "Suivi & inspection de chantier",
  "Maintenance & diagnostic drone",
  "Thermographie",
  "Agriculture",
  "Vente",
  "Location",
  "Autre",
] as const;

type FormValues = {
  name: string;
  phone: string;
  email: string;
  company: string;
  wilaya: string;
  service: string;
  message: string;
  website: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;
type Status = "idle" | "submitting" | "success" | "error" | "offline";

const EMPTY: FormValues = {
  name: "",
  phone: "",
  email: "",
  company: "",
  wilaya: "",
  service: "",
  message: "",
  website: "",
};

function digits(v: string) {
  return (v.match(/\d/g) ?? []).length;
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  if (!name) errors.name = "Merci d'indiquer votre nom.";
  else if (name.length < 2 || name.length > 80) errors.name = "Entre 2 et 80 caractères.";

  const phone = values.phone.trim();
  if (!phone) errors.phone = "Un numéro nous permet de vous rappeler.";
  else if (!/^[+0-9][0-9 ().+/–-]{5,19}$/.test(phone) || digits(phone) < 8 || digits(phone) > 15)
    errors.phone = "Numéro invalide — ex. +213 6 61 61 33 99.";

  const email = values.email.trim();
  if ((email && !/^[^\\s@]+@[^\\s@]+\.[^\\s@]{2,}$/.test(email)) || email.length > 120)
    errors.email = "Format d'email invalide.";

  const companyVal = values.company.trim();
  if (companyVal && companyVal.length > 120) errors.company = "120 caractères maximum.";

  const wilaya = values.wilaya.trim();
  if (!wilaya) errors.wilaya = "Indiquez la wilaya du besoin.";
  else if (wilaya.length < 2 || wilaya.length > 80) errors.wilaya = "Entre 2 et 80 caractères.";

  if (!values.service) errors.service = "Sélectionnez un service.";

  const message = values.message.trim();
  if (!message) errors.message = "Précisez votre besoin — quelques détails utiles.";
  else if (message.length < 15) errors.message = "Quelques mots de plus (15 caractères minimum).";
  else if (message.length > 3000) errors.message = "3 000 caractères maximum.";

  return errors;
}

export default function Contact() {
  const uid = useId();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };
  const blur = (field: keyof FormValues) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((er) => ({ ...er, [field]: validate(values)[field] }));
  };

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const service = (e as CustomEvent<string>).detail;
      setStatus("idle");
      setValues((v) => ({ ...v, service: (SERVICE_OPTIONS as readonly string[]).includes(service) ? service : "Autre" }));
      setErrors((er) => ({ ...er, service: undefined }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const showErrors = (next: FieldErrors) => {
    setErrors(next);
    const first = (["name", "phone", "wilaya", "email", "company", "service", "message"] as const).find((f) => next[f]);
    if (first) document.getElementById(idOf(first))?.focus();
  };

  const idOf = (field: keyof FormValues) => `${uid}-${field}`;

  const mailtoHref = () => {
    const subject = `Demande ${values.service || "d'informations"} — ${values.name || "(site FEL DRONE)"}`;
    const body = [
      `Nom : ${values.name}`,
      `Téléphone : ${values.phone}`,
      values.company ? `Société : ${values.company}` : null,
      `Wilaya du besoin : ${values.wilaya}`,
      values.email ? `Email : ${values.email}` : null,
      `Service demandé : ${values.service}`,
      "",
      `Précisions utiles :`,
      values.message,
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validate(values);
    if (Object.keys(validation).length > 0) {
      setTouched({ name: true, phone: true, wilaya: true, email: true, company: true, service: true, message: true });
      showErrors(validation);
      return;
    }
    setStatus("submitting");
    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 12000);
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim() || null,
          company: values.company.trim() || null,
          wilaya: values.wilaya.trim(),
          service: values.service,
          message: values.message.trim(),
          website: values.website,
        }),
        signal: controller.signal,
      });
      window.clearTimeout(timer);

      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { id?: string } | null;
        setReference(data?.id ? data.id.slice(0, 8).toUpperCase() : null);
        setStatus("success");
        setValues(EMPTY);
        setTouched({});
        setErrors({});
      } else if (res.status === 429) {
        setStatus("error");
        setErrors({ message: "Trop d'envois récents — réessayez dans une minute." });
      } else if (res.status === 404 || res.status === 405) {
        setStatus("offline");
      } else {
        const data = (await res.json().catch(() => null)) as { fields?: FieldErrors } | null;
        if (data?.fields && Object.keys(data.fields).length > 0) {
          setStatus("error");
          showErrors(data.fields);
        } else {
          setStatus("error");
        }
      }
    } catch {
      setStatus("offline");
    }
    statusRef.current?.scrollIntoView({ block: "nearest" });
  };

  const field = (name: keyof FormValues) => ({
    id: idOf(name),
    name,
    onChange: set(name),
    onBlur: blur(name),
    "aria-invalid": Boolean(touched[name] && errors[name]) || undefined,
    "aria-describedby": errors[name] && touched[name] ? `${idOf(name)}-error` : undefined,
  });

  const whatsappHref = `https://wa.me/${company.phoneHref.replace(/\+/g, "")}?text=${encodeURIComponent(
    `Bonjour FEL DRONE — ${values.service ? `demande ${values.service}` : "demande d'informations"} — ${values.wilaya ? `wilaya ${values.wilaya}` : ""}`,
  )}`;

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-paper py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-mute sm:text-[12px]">
                <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
                Contact & devis
              </p>
              <h2 id="contact-heading" className="font-display text-[1.9rem] leading-[1.12] font-medium tracking-tight text-navy-900 sm:text-[2.4rem]">
                Parlons de votre projet.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
                Devis sur étude, tarification selon la mission. Formulaire avec nom, téléphone,
                société, wilaya du besoin, service demandé, précisions utiles — la demande part
                dans le système FEL DRONE.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <span className="text-[14px] leading-relaxed text-ink">
                  {company.addressLine1}, {company.addressLine2}, {company.country}
                  <span className="block text-[12px] text-mute">Plus Code {company.plusCode} — Aïn El Assel</span>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={`tel:${company.phoneHref}`} className="group text-[14px] text-ink transition-colors hover:text-navy-900">
                  {company.phone}
                  <span className="block text-[12px] text-mute group-hover:text-ink-soft">ligne directe — horaires ouvrés — À compléter</span>
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={`mailto:${company.email}`} className="text-[14px] break-all text-ink transition-colors hover:text-navy-900">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-[14px] text-ink transition-colors hover:text-navy-900">
                  WhatsApp — {company.phone}
                  <span className="block text-[12px] text-mute">Message pré-rempli selon le service et la wilaya</span>
                </a>
              </li>
            </ul>

            <Reveal delay={160}>
              <div className="no-print mt-12 aspect-[4/3] w-full overflow-hidden border border-line grayscale transition-[filter] duration-500 hover:grayscale-0">
                <iframe
                  title="Localisation FEL DRONE — Q9JM+542, Aïn El Assel, Wilaya d'El Tarf, Algérie"
                  src="https://www.google.com/maps?q=Q9JM%2B542%20A%C3%AFn%20El%20Assel&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <div ref={statusRef} id="quote-form" className="border border-line bg-white p-7 shadow-[0_32px_64px_-48px_rgba(14,31,48,0.35)] sm:p-10">
                {status === "success" ? (
                  <div role="status" className="flex flex-col items-start gap-4 py-6">
                    <CheckCircle2 size={34} className="text-success" aria-hidden="true" />
                    <h3 className="font-display text-[1.5rem] font-medium tracking-tight text-navy-900">
                      Demande enregistrée{reference ? <> — réf. <span className="font-mono text-[1.05em]">{reference}</span></> : ""}.
                    </h3>
                    <p className="max-w-md text-[14px] leading-relaxed text-ink-soft">
                      Votre demande est consignée et transmise à l&apos;équipe. Aucun email
                      n&apos;est prétendu envoyé tant que la livraison n&apos;est pas confirmée
                      côté serveur. Besoin urgent ? Appelez le{" "}
                      <a className="font-medium text-navy-900 underline decoration-signal-600 decoration-2 underline-offset-4" href={`tel:${company.phoneHref}`}>
                        {company.phone}
                      </a>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide text-navy-700 uppercase transition-colors hover:text-navy-900"
                    >
                      Envoyer une autre demande
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-7 gap-y-7 sm:grid-cols-2">
                      <TextField label="Nom" required {...field("name")} error={touched.name ? errors.name : undefined} autoComplete="name" placeholder="Prénom et nom" />
                      <TextField label="Téléphone" required {...field("phone")} error={touched.phone ? errors.phone : undefined} type="tel" inputMode="tel" autoComplete="tel" placeholder="+213 …" hint="Indicatif +213." />
                      <TextField label="Société" {...field("company")} error={touched.company ? errors.company : undefined} autoComplete="organization" placeholder="Société (facultatif)" />
                      <TextField label="Wilaya du besoin" required {...field("wilaya")} error={touched.wilaya ? errors.wilaya : undefined} autoComplete="address-level1" placeholder="Ex. El Tarf, Annaba…" />
                      <TextField label="Email (facultatif)" {...field("email")} error={touched.email ? errors.email : undefined} type="email" inputMode="email" autoComplete="email" placeholder="vous@exemple.dz" />
                      <div>
                        <label htmlFor={idOf("service")} className="mb-2 block text-[13px] font-medium text-navy-900">
                          Service demandé <span className="text-signal-600" aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <select
                            {...field("service")}
                            value={values.service}
                            className={cn(
                              "w-full appearance-none border-0 border-b bg-transparent px-0.5 py-3 pr-8 text-[14px] text-ink outline-none transition-colors focus:border-navy-900",
                              touched.service && errors.service ? "border-error" : "border-line-strong",
                              !values.service && "text-mute",
                            )}
                          >
                            <option value="" disabled>
                              Choisir un service…
                            </option>
                            {SERVICE_OPTIONS.map((option) => (
                              <option key={option} value={option} className="text-ink">
                                {option}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={15} className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-mute" aria-hidden="true" />
                        </div>
                        {touched.service && errors.service && <FieldError id={`${idOf("service")}-error`}>{errors.service}</FieldError>}
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor={idOf("message")} className="mb-2 block text-[13px] font-medium text-navy-900">
                          Précisions utiles <span className="text-signal-600" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          {...field("message")}
                          rows={5}
                          maxLength={3000}
                          placeholder="Lieu précis, période souhaitée, surface, livrables attendus — ce qui permet de chiffrer juste. Sur devis."
                          className={cn(
                            "w-full resize-y border-0 border-b bg-transparent px-0.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-mute focus:border-navy-900",
                            touched.message && errors.message ? "border-error" : "border-line-strong",
                          )}
                        />
                        <div className="mt-2 flex items-start justify-between gap-4">
                          {touched.message && errors.message ? <FieldError id={`${idOf("message")}-error`}>{errors.message}</FieldError> : <span />}
                          <span className="text-[11.5px] text-mute tabular-nums" aria-hidden="true">
                            {values.message.length}/3000
                          </span>
                        </div>
                      </div>

                      <div className="sr-only" aria-hidden="true">
                        <label htmlFor={idOf("website")}>Ne pas remplir</label>
                        <input id={idOf("website")} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={status === "submitting"}
                          className="inline-flex w-full items-center justify-center gap-2 bg-navy-900 px-8 py-4 text-[14px] font-medium tracking-wide text-white shadow-[0_16px_32px_-18px_rgba(14,31,48,0.65)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-navy-800 active:translate-y-px disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                        >
                          {status === "submitting" ? (
                            <>
                              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                              Envoi en cours…
                            </>
                          ) : (
                            <>
                              Envoyer ma demande
                              <ArrowRight size={16} aria-hidden="true" />
                            </>
                          )}
                        </button>
                        <p className="mt-4 max-w-xl text-[12px] leading-relaxed text-mute">
                          Champs <span className="text-signal-600">*</span> requis. Demande enregistrée dans le système FEL DRONE, transmise à l&apos;équipe — utilisée uniquement pour vous répondre. Aucune allégation d&apos;email envoyé sans confirmation serveur.
                        </p>

                        {status === "error" && !Object.values(errors).some(Boolean) && (
                          <p role="alert" className="mt-4 flex items-start gap-2 border border-error/30 bg-error/5 px-4 py-3 text-[13px] leading-relaxed text-ink">
                            <AlertCircle size={15} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
                            L&apos;envoi a échoué — serveur non confirmé. Réessayez ou appelez{" "}
                            <a className="font-medium underline decoration-signal-600 decoration-2 underline-offset-4" href={`tel:${company.phoneHref}`}>
                              {company.phone}
                            </a>
                            .
                          </p>
                        )}
                        {status === "offline" && (
                          <div role="alert" className="mt-4 border border-line-strong bg-paper px-4 py-4 text-[13px] leading-relaxed text-ink">
                            <p className="flex items-start gap-2 font-medium text-navy-900">
                              <AlertCircle size={15} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                              Formulaire momentanément indisponible — rien n&apos;a été envoyé.
                            </p>
                            <p className="mt-2 text-ink-soft">Votre message est prêt : envoyez-le par email pré-rempli ou appelez le {company.phone}.</p>
                            <div className="mt-3 flex flex-wrap gap-3">
                              <a href={mailtoHref()} className="inline-flex items-center gap-2 bg-navy-900 px-5 py-2.5 text-[13px] font-medium tracking-wide text-white transition-colors hover:bg-navy-800">
                                <Mail size={14} aria-hidden="true" />
                                Envoyer par email
                              </a>
                              <button type="button" onClick={() => setStatus("idle")} className="inline-flex items-center px-2 py-2.5 text-[13px] font-medium text-navy-700 underline decoration-signal-600 decoration-2 underline-offset-4 transition-colors hover:text-navy-900">
                                Réessayer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-[12.5px] text-error">
      <AlertCircle size={14} aria-hidden="true" /> {children}
    </p>
  );
}

function TextField({
  label,
  id,
  name,
  type = "text",
  error,
  hint,
  required = false,
  ...rest
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  error?: string;
  hint?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> & { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onBlur: () => void }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-navy-900">
        {label} {required && <span className="text-signal-600" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-required={required || undefined}
        {...rest}
        className={cn(
          "w-full border-0 border-b bg-transparent px-0.5 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-mute focus:border-navy-900",
          error ? "border-error" : "border-line-strong",
        )}
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : hint ? <p className="mt-2 text-[11.5px] text-mute">{hint}</p> : null}
    </div>
  );
}
