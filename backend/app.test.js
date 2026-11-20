
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';

import request from 'supertest';
import { createApp } from './app.js';

describe('Contact API', () => {
  let app;
  let sendEmail;

  beforeEach(() => {
    process.env.MAIL_FROM = 'test@example.com';
    process.env.MAIL_TO = 'recipient@example.com';

    sendEmail = vi.fn().mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    });

    app = createApp({
      resendClient: {
        emails: {
          send: sendEmail,
        },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const validMessage = {
    name: 'Jan Kowalski',
    email: 'jan@example.com',
    message: 'To jest przykładowa wiadomość testowa.',
    botcheck: '',
  };

  it('powinien zwrócić status OK dla health check', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('powinien wysłać wiadomość z poprawnymi danymi', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send(validMessage);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('powinien odrzucić niepoprawny adres e-mail', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        ...validMessage,
        email: 'to-nie-jest-email',
      });

    expect(response.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('powinien odrzucić zbyt krótką wiadomość', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        ...validMessage,
        message: 'Krótka',
      });

    expect(response.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('powinien odrzucić puste imię', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        ...validMessage,
        name: '',
      });

    expect(response.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('powinien ignorować zgłoszenie z wypełnionym honeypotem', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        ...validMessage,
        botcheck: 'Jestem botem',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('powinien zwrócić błąd, gdy Resend zgłosi problem', async () => {
    sendEmail.mockResolvedValueOnce({
      data: null,
      error: { message: 'Test error' },
    });

    const response = await request(app)
      .post('/api/contact')
      .send(validMessage);

    expect(response.status).toBe(502);
    expect(response.body.success).toBe(false);
  });

  it('powinien ograniczyć liczbę wysyłanych żądań', async () => {
    for (let i = 0; i < 5; i++) {
      const response = await request(app)
        .post('/api/contact')
        .send(validMessage);

      expect(response.status).toBe(200);
    }

    const response = await request(app)
      .post('/api/contact')
      .send(validMessage);

    expect(response.status).toBe(429);
  });

  it('powinien odrzucić wiadomość dłuższą niż 5000 znaków', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        ...validMessage,
        message: 'A'.repeat(5001),
      });

    expect(response.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('powinien odrzucić imię dłuższe niż 100 znaków', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        ...validMessage,
        name: 'A'.repeat(101),
      });

    expect(response.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('powinien zwrócić 500, gdy brakuje konfiguracji Resend', async () => {
    const originalMailFrom = process.env.MAIL_FROM;

    delete process.env.MAIL_FROM;

    try {
      const response = await request(app)
        .post('/api/contact')
        .send(validMessage);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(sendEmail).not.toHaveBeenCalled();
    } finally {
      process.env.MAIL_FROM = originalMailFrom;
    }
  });
});
