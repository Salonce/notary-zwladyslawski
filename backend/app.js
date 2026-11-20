
import express from 'express';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Contact form
app.post('/api/contact', limiter, async (req, res) => {
  try {
    const { name, email, message, botcheck } = req.body ?? {};

    // Honeypot: silently accept bot submissions without sending email
    if (typeof botcheck === 'string' && botcheck.trim() !== '') {
      return res.json({
        success: true,
        message: 'Wiadomość została wysłana.',
      });
    }

    // Validate input
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      name.trim().length < 2 ||
      name.length > 100 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      message.trim().length < 10 ||
      message.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: 'Prosimy sprawdzić poprawność formularza.',
      });
    }

    if (!process.env.RESEND_API_KEY ||
        !process.env.MAIL_FROM ||
        !process.env.MAIL_TO) {
      console.error('Missing email environment variables.');

      return res.status(500).json({
        success: false,
        message: 'Wysyłanie wiadomości jest chwilowo niedostępne.',
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: [process.env.MAIL_TO],
      replyTo: email.trim(),
      subject: `Wiadomość z formularza od ${name.trim()}`,
      text: [
        `Imię i nazwisko: ${name.trim()}`,
        `Adres e-mail: ${email.trim()}`,
        '',
        'Treść zapytania:',
        message.trim(),
      ].join('\n'),
    });

    if (error) {
      console.error('Resend error:', error);

      return res.status(502).json({
        success: false,
        message: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.',
      });
    }

    console.log('Email sent:', data.id);

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

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
