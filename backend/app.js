import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

// =========================================
// 1. SZABLON WIADOMOŚCI HTML
// =========================================

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char]);
}

function buildContactEmail({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  // <br> zamiast white-space:pre-wrap, bo np. Outlook ignoruje pre-wrap
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

  return `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="format-detection" content="email=no">
      <title>Nowa wiadomość - Kancelaria Notarialna</title>
    </head>

    <body style="
      margin:0;
      padding:35px 12px;
      background-color:#f2ece1;
      font-family:Arial,Helvetica,sans-serif;
      color:#574e4e;
    ">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
              style="
                max-width:660px;
                background-color:#ffffff;
                border:1px solid #e5dccd;
              ">

              <!-- Górny pasek -->
              <tr>
                <td height="6" style="background-color:#7f2336;"></td>
              </tr>

              <!-- Nagłówek -->
              <tr>
                <td align="center" style="padding:45px 30px 38px;">

                  <p style="
                    margin:0;
                    font-family:Georgia,serif;
                    font-size:12px;
                    letter-spacing:3px;
                    text-transform:uppercase;
                    color:#6f5b2f;
                  ">
                    Kancelaria Notarialna
                  </p>

                  <h1 style="
                    margin:24px 0 16px;
                    font-family:Georgia,serif;
                    font-size:29px;
                    font-weight:normal;
                    line-height:1.35;
                    color:#7f2336;
                  ">
                    Nowa wiadomość
                  </h1>

                  <table role="presentation" width="55" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td height="2" style="background-color:#d5b77f;"></td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Dane nadawcy -->
              <tr>
                <td style="padding:0 35px 34px;">

                  <!-- Nagłówek: imię i nazwisko -->
                  <h2 style="
                    margin:0 0 12px;
                    text-align:center;
                    font-family:Georgia,serif;
                    font-size:21px;
                    font-weight:normal;
                    color:#000000;
                  ">
                    Imię i nazwisko
                  </h2>

                  <!-- Chmurka: samo imię i nazwisko -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="
                      background-color:#f9f6f0;
                      border:1px solid #e9e1d5;
                    ">
                    <tr>
                      <td style="
                        padding:18px 26px;
                        text-align:center;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:15px;
                        line-height:1.6;
                        color:#000000;
                      ">
                        ${safeName}
                      </td>
                    </tr>
                  </table>

                  <!-- Nagłówek: adres e-mail -->
                  <h2 style="
                    margin:25px 0 12px;
                    text-align:center;
                    font-family:Georgia,serif;
                    font-size:21px;
                    font-weight:normal;
                    color:#000000;
                  ">
                    Adres e-mail
                  </h2>

                  <!-- Chmurka: sam adres e-mail -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="
                      background-color:#f9f6f0;
                      border:1px solid #e9e1d5;
                    ">
                    <tr>
                      <td style="
                        padding:18px 26px;
                        text-align:center;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:15px;
                        line-height:1.6;
                        color:#000000;
                      ">
                        <span style="
                          color:#000000;
                          text-decoration:none;
                        ">${safeEmail}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Nagłówek: treść zapytania -->
                  <h2 style="
                    margin:35px 0 15px;
                    text-align:center;
                    font-family:Georgia,serif;
                    font-size:21px;
                    font-weight:normal;
                    color:#000000;
                  ">
                    Treść zapytania
                  </h2>

                  <!-- Chmurka: treść zapytania -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                    style="
                      border:1px solid #e9e1d5;
                      background-color:#f9f6f0;
                    ">
                    <tr>
                      <td align="left" style="
                        padding:25px 26px;
                        text-align:left;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:14px;
                        line-height:1.6;
                        color:#574e4e;
                        overflow-wrap:anywhere;
                        word-break:break-word;
                      ">${safeMessage}</td>
                    </tr>
                  </table>

                  <!-- Przycisk odpowiedzi -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td align="center" style="padding:30px 0 5px;">

                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td align="center" style="
                              background-color:#7f2336;
                              border-radius:3px;
                            ">
                              <a href="mailto:${safeEmail}"
                                style="
                                  display:inline-block;
                                  padding:15px 30px;
                                  font-family:Arial,Helvetica,sans-serif;
                                  font-size:14px;
                                  font-weight:bold;
                                  color:#ffffff;
                                  text-decoration:none;
                                ">
                                Odpowiedz na wiadomość
                              </a>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Stopka z informacją o formularzu -->
              <tr>
                <td align="center" style="
                  padding:22px 25px;
                  background-color:#f6f1e9;
                  border-top:1px solid #e5dccd;
                ">

                  <p style="
                    margin:0;
                    font-size:11px;
                    line-height:1.8;
                    color:#6f5b2f;
                  ">
                    Nowa wiadomość pochodzi z formularza kontaktowego na stronie notariusz.wladyslawski.pl.
                  </p>

                </td>
              </tr>

              <!-- Dolny pasek -->
              <tr>
                <td height="5" style="background-color:#7f2336;"></td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}


// =========================================
// 2. APLIKACJA EXPRESS
// =========================================

// Wyklucza spacje, @ oraz znaki <>"' (dodatkowa ochrona przed wstrzykiwaniem do HTML)
const EMAIL_REGEX = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

export function createApp({
  resendClient,
  allowedOrigin = process.env.ALLOWED_ORIGIN,
} = {}) {
  // Bez tego `cors` z origin: undefined przepuszcza wszystkie originy
  if (!allowedOrigin) {
    throw new Error('Missing ALLOWED_ORIGIN configuration.');
  }

  const app = express();

  // Aplikacja stoi za proxy (Render, Railway, Nginx, Cloudflare...),
  // więc bez tego req.ip to adres proxy, a nie użytkownika.
  // Liczba = ile proxy jest przed aplikacją. Można nadpisać zmienną TRUST_PROXY.
  app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 1));

  // Produkcja: prawdziwy klient Resend.
  // Testy: możliwość wstrzyknięcia klienta testowego.
  const mailer =
    resendClient ??
    (process.env.RESEND_API_KEY
      ? new Resend(process.env.RESEND_API_KEY)
      : null);

  // Zabezpieczenia
  app.use(helmet());

  app.use(cors({
    origin: allowedOrigin,
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type'],
  }));

  app.use(express.json({ limit: '10kb' }));

  // Ograniczenie liczby wysyłanych wiadomości
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // Błędy walidacji (4xx/5xx) nie zużywają limitu
    skipFailedRequests: true,
    // Odpowiedź w JSON-ie, żeby front mógł ją normalnie sparsować
    message: {
      success: false,
      message: 'Zbyt wiele prób. Spróbuj ponownie później.',
    },
  });

  // =========================================
  // 3. HEALTH CHECK
  // =========================================

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // =========================================
  // 4. FORMULARZ KONTAKTOWY
  // =========================================

  app.post('/api/contact', limiter, async (req, res) => {
    try {
      const { name, email, message, botcheck } = req.body ?? {};

      // Honeypot: ciche odrzucenie botów
      if (typeof botcheck === 'string' && botcheck.trim() !== '') {
        console.warn('Honeypot triggered from IP:', req.ip);

        return res.json({
          success: true,
          message: 'Wiadomość została wysłana.',
        });
      }

      // Walidacja typów
      if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof message !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Prosimy sprawdzić poprawność formularza.',
        });
      }

      // Czyszczenie danych raz, na początku.
      // W imieniu usuwamy znaki nowej linii i tabulatory (ochrona tematu maila).
      const cleanName = name.replace(/[\r\n\t]+/g, ' ').trim();
      const cleanEmail = email.trim();
      const cleanMessage = message.trim();

      // Walidacja wartości po oczyszczeniu
      if (
        cleanName.length < 2 ||
        cleanName.length > 100 ||
        cleanEmail.length > 254 ||
        !EMAIL_REGEX.test(cleanEmail) ||
        cleanMessage.length < 10 ||
        cleanMessage.length > 5000
      ) {
        return res.status(400).json({
          success: false,
          message: 'Prosimy sprawdzić poprawność formularza.',
        });
      }

      // Sprawdzenie konfiguracji poczty
      if (
        !mailer ||
        !process.env.MAIL_FROM ||
        !process.env.MAIL_TO
      ) {
        console.error('Missing email configuration.');

        return res.status(500).json({
          success: false,
          message: 'Wysyłanie wiadomości jest chwilowo niedostępne.',
        });
      }

      // Wysyłanie wiadomości przez Resend
      const { data, error } = await mailer.emails.send({
        from: process.env.MAIL_FROM,
        to: [process.env.MAIL_TO],
        replyTo: cleanEmail,

        subject: `Nowa wiadomość z formularza kontaktowego – ${cleanName}`,

        // Wersja tekstowa
        text: [
          `Imię i nazwisko: ${cleanName}`,
          `Adres e-mail: ${cleanEmail}`,
          '',
          'Treść zapytania:',
          cleanMessage,
        ].join('\n'),

        // Wersja HTML w kolorach kancelarii
        html: buildContactEmail({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
        }),
      });

      // Błąd Resend
      if (error) {
        console.error('Resend error:', error);

        return res.status(502).json({
          success: false,
          message: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.',
        });
      }

      console.log('Email sent:', data?.id);

      return res.status(200).json({
        success: true,
        message: 'Wiadomość została wysłana.',
      });

    } catch (error) {
      console.error('Contact API error:', error);

      return res.status(500).json({
        success: false,
        message: 'Wystąpił błąd serwera.',
      });
    }
  });

  return app;
}