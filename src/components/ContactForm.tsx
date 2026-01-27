import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '', // honeypot anti‑bot (nu trebuie completat de oameni)
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Honeypot: dacă acest câmp invizibil este completat, considerăm că este bot și nu trimitem nimic
    if (formData.website.trim() !== '') {
      setStatus('success'); // răspundem ca și cum ar fi reușit, dar nu trimitem mai departe
      return;
    }

    const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

    const isValidEnvValue = (value: string | undefined) =>
      typeof value === 'string' && value.trim().length > 0;

    if (!isValidEnvValue(serviceId) || !isValidEnvValue(templateId) || !isValidEnvValue(publicKey)) {
      setStatus('error');
      setErrorMessage('EmailJS nu este configurat corect. Verifică variabilele de mediu.');
      return;
    }

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: 'aurelian.epuras@gmail.com'
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage('A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-ivory-card dark:bg-navy-card border border-navy/10 dark:border-ivory-light/10 p-8 rounded-2xl space-y-6">
      <div>
        {/* Câmp honeypot invizibil pentru utilizatori, poziționat off-screen pentru boți */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        >
          <label htmlFor="website">Nu completa acest câmp</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <label htmlFor="name" className="block text-sm font-semibold text-navy dark:text-ivory-light mb-2">
          Nume *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={status === 'loading'}
          className="w-full px-4 py-3 rounded-2xl bg-ivory dark:bg-navy-deep border border-navy/20 dark:border-ivory-light/20 text-navy dark:text-ivory-light focus:border-gold-warm dark:focus:border-gold-bright focus:ring-2 focus:ring-gold-warm/20 dark:focus:ring-gold-bright/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Numele tău"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-navy dark:text-ivory-light mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={status === 'loading'}
          className="w-full px-4 py-3 rounded-2xl bg-ivory dark:bg-navy-deep border border-navy/20 dark:border-ivory-light/20 text-navy dark:text-ivory-light focus:border-gold-warm dark:focus:border-gold-bright focus:ring-2 focus:ring-gold-warm/20 dark:focus:ring-gold-bright/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-navy dark:text-ivory-light mb-2">
          Mesaj *
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={formData.message}
          onChange={handleChange}
          disabled={status === 'loading'}
          className="w-full px-4 py-3 rounded-2xl bg-ivory dark:bg-navy-deep border border-navy/20 dark:border-ivory-light/20 text-navy dark:text-ivory-light focus:border-gold-warm dark:focus:border-gold-bright focus:ring-2 focus:ring-gold-warm/20 dark:focus:ring-gold-bright/20 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Scrie mesajul tău aici..."
        ></textarea>
      </div>

      {status === 'error' && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-2xl">
          <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-2xl">
          <p className="text-sm text-green-800 dark:text-green-200">
            Mulțumesc! Mesajul a fost trimis.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 bg-gold-warm dark:bg-gold-bright text-navy hover:bg-gold-bright dark:hover:bg-gold-warm transition-all duration-300 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Trimitere...
          </span>
        ) : (
          'Trimite Mesaj'
        )}
      </button>
    </form>
  );
}
