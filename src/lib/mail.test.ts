
import { describe, it, expect, vi, afterEach } from 'vitest';
import { sendEmail } from './mail';

describe('sendEmail', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createFormData() {
    const formData = new FormData();

    formData.set('name', 'Jan Kowalski');
    formData.set('email', 'jan@example.com');
    formData.set('message', 'To jest przykładowa wiadomość testowa.');
    formData.set('botcheck', '');

    return formData;
  }

  it('powinien wysłać poprawne dane do API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: true,
            message: 'Wiadomość została wysłana.',
          }),
          { status: 200 }
        )
      );

    const result = await sendEmail(createFormData());

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toContain('/api/contact');
    expect(options?.method).toBe('POST');

    const payload = JSON.parse(options?.body as string);

    expect(payload.name).toBe('Jan Kowalski');
    expect(payload.email).toBe('jan@example.com');
    expect(payload.botcheck).toBe('');
  });

  it('powinien zwrócić sukces po poprawnej odpowiedzi API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          message: 'Wiadomość została wysłana.',
        }),
        { status: 200 }
      )
    );

    const result = await sendEmail(createFormData());

    expect(result).toEqual({
      success: true,
      message: 'Wiadomość została wysłana.',
    });
  });

  it('powinien obsłużyć błąd API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          message: 'Nieprawidłowe dane.',
        }),
        { status: 400 }
      )
    );

    const result = await sendEmail(createFormData());

    expect(result.success).toBe(false);
    expect(result.message).toBe('Nieprawidłowe dane.');
  });

  it('powinien obsłużyć błąd połączenia z backendem', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new Error('Network error')
    );

    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await sendEmail(createFormData());

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      'Nie udało się połączyć z serwerem. Spróbuj ponownie później.'
    );

    consoleSpy.mockRestore();
  });

  it('powinien obsłużyć odpowiedź API bez pola message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: true }),
        { status: 200 }
      )
    );

    const result = await sendEmail(createFormData());

    expect(result.success).toBe(true);
    expect(result.message).toBe('Wiadomość została wysłana.');
  });
});
