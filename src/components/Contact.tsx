import { useId, useRef, useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { company } from "../data/content";
import Reveal from "./Reveal";

/**
 * Contact — no backend is implied: on submit the form opens the visitor's
 * own email client with the message pre-filled (mailto), and this is stated
 * explicitly next to the action. Validation, error announcements and focus
 * management follow WAI-ARIA form guidance.
 */
type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Votre nom est requis.";
  if (!values.email.trim()) {
    errors.email = "Votre email est requis.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Format d'email invalide.";
  }
  if (values.phone && !/^[+\d][\d\s.-]{6,}$/.test(values.phone)) {
    errors.phone = "Format de téléphone invalide.";
  }
  if (!values.subject.trim()) errors.subject = "Précisez l'objet de votre demande.";
  if (!values.message.trim()) {
    errors.message = "Votre message est requis.";
  } else if (values.message.trim().length < 20) {
    errors.message = "Merci de détailler votre demande (20 caractères minimum).";
  }
  return errors;
}

const fieldOrder: (keyof FormState)[] = ["name", "email", "phone", "subject", "message"];

export default function Contact() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    const firstInvalid = fieldOrder.find((f) => validation[f]);
    if (firstInvalid) {
      document.getElementById(fieldIds[firstInvalid])?.focus();
      return;
    }

    const body = [
      `Nom : ${values.name}`,
      `Email : ${values.email}`,
      values.phone ? `Téléphone : ${values.phone}` : null,
      "",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${company.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("success");
    setValues(initialState);
  };

  // Stable unique ids (safe if the section is ever rendered twice).
  const uid = useId();
  const fieldIds: Record<keyof FormState, string> = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    phone: `${uid}-phone`,
    subject: `${uid}-subject`,
    message: `${uid}-message`,
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Contact information */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] sm:text-[12px] text-mute">
                <span className="h-px w-8 bg-signal-600" aria-hidden="true" />
                Contact
              </p>
              <h2 id="contact-heading" className="font-display text-[1.9rem] leading-[1.12] font-medium tracking-tight text-navy-900 sm:text-[2.4rem]">
                Parlons de votre projet.
              </h2>
              <p className="mt-6 text-[15.5px] leading-relaxed text-ink-soft">
                Un devis, une mise à disposition de flotte, une mission à planifier&nbsp;?
                Écrivez-nous — la réponse vient directement de l'équipe.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <span className="text-[14.5px] leading-relaxed text-ink">
                  {company.addressLine1}, {company.addressLine2}, {company.country}
                </span>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={`tel:${company.phoneHref}`} className="text-[14.5px] text-ink transition-colors hover:text-navy-900">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
                <a href={`mailto:${company.email}`} className="text-[14.5px] break-all text-ink transition-colors hover:text-navy-900">
                  {company.email}
                </a>
              </li>
            </ul>

            <Reveal delay={160}>
              <div className="no-print mt-12 aspect-[4/3] w-full overflow-hidden border border-line grayscale transition-[filter] duration-500 hover:grayscale-0">
                <iframe
                  title="Localisation de FEL DRONE — Aïn El Assel, El Tarf, Algérie"
                  src="https://www.google.com/maps?q=A%C3%AFn%20El%20Assel%2C%20El%20Tarf%2C%20Alg%C3%A9rie&output=embed"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <form ref={formRef} noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <Field
                  label="Nom complet *"
                  id={fieldIds.name}
                  value={values.name}
                  onChange={handleChange("name")}
                  error={errors.name}
                  autoComplete="name"
                  required
                />
                <Field
                  label="Email *"
                  id={fieldIds.email}
                  type="email"
                  inputMode="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  error={errors.email}
                  autoComplete="email"
                  required
                />
                <Field
                  label="Téléphone"
                  id={fieldIds.phone}
                  type="tel"
                  inputMode="tel"
                  value={values.phone}
                  onChange={handleChange("phone")}
                  error={errors.phone}
                  autoComplete="tel"
                  hint="Indicatif +213 si depuis l'étranger"
                />
                <Field
                  label="Objet *"
                  id={fieldIds.subject}
                  value={values.subject}
                  onChange={handleChange("subject")}
                  error={errors.subject}
                  placeholder="Devis, location, maintenance, mission…"
                  required
                />
                <div className="sm:col-span-2">
                  <label htmlFor={fieldIds.message} className="mb-2 block text-[13px] font-medium text-navy-900">
                    Message *
                  </label>
                  <textarea
                    id={fieldIds.message}
                    rows={6}
                    maxLength={3000}
                    value={values.message}
                    onChange={handleChange("message")}
                    aria-required="true"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${fieldIds.message}-error` : undefined}
                    className="w-full resize-y border-0 border-b border-line-strong bg-transparent px-0.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-mute focus:border-navy-900"
                    placeholder="Décrivez le contexte, le lieu et la période souhaités."
                  />
                  {errors.message && (
                    <p id={`${fieldIds.message}-error`} role="alert" className="mt-2 flex items-center gap-1.5 text-[13px] text-error">
                      <AlertCircle size={14} aria-hidden="true" /> {errors.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-navy-900 px-8 py-4 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-navy-800"
                  >
                    Préparer mon message
                  </button>
                  <p className="mt-4 max-w-xl text-[12.5px] leading-relaxed text-mute">
                    Aucun formulaire en ligne n'est stocké sur un serveur : ce bouton ouvre
                    votre logiciel de messagerie avec un message pré-rempli à destination de{" "}
                    <span className="font-medium text-ink-soft">{company.email}</span>. Vous
                    relisez, puis envoyez. Vous pouvez aussi nous joindre directement par
                    téléphone.
                  </p>
                  {status === "success" && (
                    <p role="status" className="mt-4 flex items-center gap-2 text-[13.5px] font-medium text-success">
                      <CheckCircle2 size={16} aria-hidden="true" />
                      Votre messagerie s'est ouverte avec la demande pré-remplie. Si rien ne
                      s'est passé, écrivez-nous à {company.email}.
                    </p>
                  )}
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  hint,
  autoComplete,
  inputMode,
  placeholder,
  required = false,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-navy-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className="w-full border-0 border-b border-line-strong bg-transparent px-0.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-mute focus:border-navy-900"
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-center gap-1.5 text-[13px] text-error">
          <AlertCircle size={14} aria-hidden="true" /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[12px] text-mute">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
