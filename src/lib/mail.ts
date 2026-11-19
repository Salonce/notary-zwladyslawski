
export interface MailResponse {
  success: boolean;
  message: string;
}

const API_URL = 'https://api.web3forms.com/submit';

export async function sendEmail(formData: FormData): Promise<MailResponse> {
  const accessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY;

  if (!accessKey) {
    console.error('Missing Web3Forms access key.');

    return {
      success: false,
      message: 'Unable to send the message. Please try again later.',
    };
  }

  // Web3Forms credentials
  formData.set('access_key', accessKey);

  // Email configuration
  formData.set('subject', 'Wiadomość z formularza kontaktowego.');
  formData.set('from_name', 'notariusz.wladyslawski.pl');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message ?? 'Failed to send message.',
      };
    }

    return {
      success: true,
      message: result.message ?? 'Message sent successfully.',
    };
  } catch (error) {
    console.error('Web3Forms error:', error);

    return {
      success: false,
      message: 'Unable to send the message. Please try again later.',
    };
  }
}
