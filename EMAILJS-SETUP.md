# Configurare EmailJS pentru Formularul de Contact

Acest ghid te va ajuta să configurezi EmailJS pentru a trimite email-uri din formularul de contact către adresa **aurelian.epuras@gmail.com**.

## Pasul 1: Creează un Cont EmailJS

1. Vizitează [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Înregistrează-te gratuit (100 de email-uri pe lună în planul gratuit)
3. Confirmă adresa de email

## Pasul 2: Adaugă un Email Service

1. În dashboard, mergi la **Email Services**
2. Click pe **Add New Service**
3. Alege providerul tău de email (Gmail, Outlook, etc.)
4. Urmează pașii pentru a conecta contul:
   - **Pentru Gmail:**
     - Click pe "Connect Account"
     - Autentifică-te cu contul Google
     - Permite accesul pentru EmailJS
   - **Pentru alte providere:**
     - Introdu detaliile SMTP

5. Salvează și notează **Service ID** (va arăta ceva de genul: `service_xxxxxxx`)

## Pasul 3: Creează un Email Template

1. În dashboard, mergi la **Email Templates**
2. Click pe **Create New Template**
3. Configurează template-ul astfel:

### Template Settings:
- **Template Name:** Contact Form Submission
- **Template ID:** (lasă-l generat automat sau creează unul personalizat)

### Template Content:
**Subject:**
```
Mesaj nou de la {{from_name}} - Site Aurelian Epuraș
```

**Content (HTML sau Text):**
```
Ai primit un mesaj nou prin formularul de contact:

Nume: {{from_name}}
Email: {{from_email}}

Mesaj:
{{message}}

---
Acest mesaj a fost trimis de pe site-ul aurelian-epuras.ro
```

### Template Parameters:
Asigură-te că template-ul folosește aceste variabile:
- `{{from_name}}` - Numele persoanei care trimite mesajul
- `{{from_email}}` - Email-ul persoanei care trimite mesajul
- `{{message}}` - Conținutul mesajului
- `{{to_email}}` - Email-ul destinatar (aurelian.epuras@aurelian.com)

### To Email Configuration:
În secțiunea **To Email**, setează:
```
aurelian.epuras@gmail.com
```

4. Click pe **Save** și notează **Template ID**

## Pasul 4: Obține Public Key

1. În dashboard, mergi la **Account** (iconița user din dreapta-sus)
2. Click pe **General** în meniu lateral
3. Găsește secțiunea **Public Key** (sau **API Keys**)
4. Copiază **Public Key** (va arăta ceva de genul: `xxxxxxxxxxxxxx`)

## Pasul 5: Configurează Variabilele de Mediu

1. Deschide fișierul `.env` din rădăcina proiectului
2. Înlocuiește placeholder-urile cu valorile tale reale:

```env
PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

**IMPORTANT:**
- Nu pune ghilimele în jurul valorilor
- Asigură-te că nu există spații în plus
- Variabilele trebuie să înceapă cu `PUBLIC_` pentru a fi accesibile în browser

## Pasul 6: Testează Formularul

1. Repornește serverul de development (dacă rulează):
   ```bash
   npm run dev
   ```

2. Navighează la pagina de contact: `http://localhost:4321/contact`

3. Completează și trimite formularul de test

4. Verifică:
   - Mesaj de succes în pagină
   - Email primit la aurelian.epuras@gmail.com
   - Dashboard EmailJS pentru statistici

## Depanare (Troubleshooting)

### Email-ul nu se trimite

**Verifică consola browserului pentru erori:**
- F12 sau Click dreapta → Inspect → Console

**Erori comune:**

#### Error: "EmailJS nu este configurat corect"
- Verifică că toate cele 3 variabile sunt setate în `.env`
- Asigură-te că au prefix-ul `PUBLIC_`
- Repornește serverul după modificarea `.env`

#### Error: "Invalid Service ID"
- Service ID-ul este greșit
- Verifică în EmailJS Dashboard → Email Services
- Copiază ID-ul exact (sensibil la majuscule/minuscule)

#### Error: "Invalid Template ID"
- Template ID-ul este greșit
- Verifică în EmailJS Dashboard → Email Templates
- Copiază ID-ul exact

#### Error: "Invalid Public Key"
- Public Key este greșit
- Verifică în EmailJS Dashboard → Account → General
- Copiază cheia exact

### Email-ul se trimite dar nu ajunge

1. **Verifică spam folder**
   - Email-urile de test pot ajunge în spam

2. **Verifică Email Service Connection**
   - Dashboard → Email Services
   - Status trebuie să fie "Connected"
   - Dacă e "Disconnected", reconectează contul

3. **Verifică Template**
   - Email-ul destinatar trebuie să fie corect în template
   - Parametrii trebuie să se potrivească cu cei din cod

### Limita de email-uri

- **Plan gratuit:** 100 email-uri/lună, 200 email-uri/zi
- Dacă depășești limita, va apărea eroare
- Upgrade la plan plătit pentru mai multe email-uri

## Securitate

✅ **Ce este safe:**
- Public Key-ul poate fi expus în frontend (de aceea se numește "public")
- Service ID și Template ID pot fi expuse

⚠️ **Ce NU trebuie expus:**
- Private Key-ul EmailJS (dacă există)
- Credențiale SMTP
- Parolele de email

## Support

Pentru probleme sau întrebări:
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- FAQ: https://www.emailjs.com/docs/faq/

## Upgrade Plan (Opțional)

Dacă ai nevoie de mai multe email-uri:
- Personal: $9/lună (1000 email-uri/lună)
- Business: $35/lună (10,000 email-uri/lună)
- Enterprise: Custom pricing

https://www.emailjs.com/pricing/

---

**Status:** ✅ Formularul de contact este configurat și gata de utilizare după completarea pașilor de mai sus!
