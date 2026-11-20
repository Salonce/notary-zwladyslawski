
export interface MailResponse {
  success: boolean;
  message: string;
}

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api/contact'
  : 'https://api.wladyslawski.pl/api/contact';

export async function sendEmail(formData: FormData): Promise<MailResponse> {
  const payload = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    botcheck: String(formData.get('botcheck') ?? ''),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message ?? 'Nie udało się wysłać wiadomości.',
      };
    }

    return {
      success: true,
      message: result.message ?? 'Wiadomość została wysłana.',
    };
  } catch (error) {
    console.error('Contact form error:', error);

    return {
      success: false,
      message: 'Nie udało się połączyć z serwerem. Spróbuj ponownie później.',
    };
  }
}
