import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { company } from "../data/content";
import Reveal from "./Reveal";

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

export default function Contact() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

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

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-white py-28 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Contact information */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-[12px] font-medium tracking-[0.24em] text-[#6b7280] uppercase">
                <span className="h-px w-8 bg-[#b4823c]" aria-hidden="true" />
                Contact
              </p>
              <h2 id="contact-heading" className="font-display text-3xl font-semibold tracking-tight text-[#0e1f30] sm:text-4xl">
                Parlons de votre projet.
              </h2>
              <p className="mt-6 text-[15.5px] leading-relaxed text-[#3a3f47]">
                Une question, un devis, une expertise à planifier&nbsp;? Notre équipe répond
                directement.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-6">
              <Reveal delay={80}>
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-[#b4823c]" aria-hidden="true" />
                  <span className="text-[14.5px] leading-relaxed text-[#12151a]">
                    {company.addressLine1}, {company.addressLine2}, {company.country}
                  </span>
                </li>
              </Reveal>
              <Reveal delay={140}>
                <li className="flex items-start gap-4">
                  <Phone size={18} className="mt-0.5 shrink-0 text-[#b4823c]" aria-hidden="true" />
                  <a href={`tel:${company.phoneHref}`} className="text-[14.5px] text-[#12151a] hover:text-[#0e1f30]">
                    {company.phone}
                  </a>
                </li>
              </Reveal>
              <Reveal delay={200}>
                <li className="flex items-start gap-4">
                  <Mail size={18} className="mt-0.5 shrink-0 text-[#b4823c]" aria-hidden="true" />
                  <a href={`mailto:${company.email}`} className="text-[14.5px] text-[#12151a] hover:text-[#0e1f30]">
                    {company.email}
                  </a>
                </li>
              </Reveal>
            </ul>

            <Reveal delay={260}>
              <div className="mt-10 aspect-[4/3] w-full overflow-hidden border border-[#e4e2dd] grayscale">
                <iframe
                  title="Localisation de FEL DRONE — El Tarf, Algérie"
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
              <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field
                  label="Nom complet"
                  id="name"
                  value={values.name}
                  onChange={handleChange("name")}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  label="Téléphone (optionnel)"
                  id="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange("phone")}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <Field
                  label="Objet"
                  id="subject"
                  value={values.subject}
                  onChange={handleChange("subject")}
                  error={errors.subject}
                />
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-2 block text-[13px] font-medium text-[#0e1f30]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={values.message}
                    onChange={handleChange("message")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="w-full border border-[#d8d5cd] bg-transparent px-4 py-3 text-[14.5px] text-[#12151a] outline-none transition-colors focus:border-[#0e1f30]"
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 flex items-center gap-1.5 text-[13px] text-[#a13b2c]">
                      <AlertCircle size={14} /> {errors.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-[#0e1f30] px-8 py-4 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-[#15304a]"
                  >
                    Envoyer la demande
                  </button>
                  <p className="mt-4 text-[12.5px] leading-relaxed text-[#6b7280]">
                    L'envoi ouvre votre messagerie avec le message pré-rempli à destination de{" "}
                    {company.email}. Vous pouvez également nous joindre directement par téléphone.
                  </p>
                  {status === "success" && (
                    <p className="mt-4 flex items-center gap-2 text-[13.5px] font-medium text-[#1d6b3f]">
                      <CheckCircle2 size={16} /> Votre messagerie s'est ouverte avec la demande pré-remplie.
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
  autoComplete,
}: {
  label: string;
  id: keyof FormState;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-[#0e1f30]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full border border-[#d8d5cd] bg-transparent px-4 py-3 text-[14.5px] text-[#12151a] outline-none transition-colors focus:border-[#0e1f30]"
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-[13px] text-[#a13b2c]">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}
