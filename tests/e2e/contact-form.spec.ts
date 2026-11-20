
import { test, expect } from '@playwright/test';

test.describe('Formularz kontaktowy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('powinien wyświetlać formularz kontaktowy', async ({ page }) => {
    await expect(page.locator('#contact-form')).toBeVisible();

    await expect(page.locator('[name="name"]')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="message"]')).toBeVisible();

    await expect(page.locator('#contact-submit')).toBeVisible();
  });

  test('powinien pokazywać błędy przy pustym formularzu', async ({ page }) => {
    await page.locator('#contact-submit').click();

    await expect(page.locator('#form-error-summary')).toBeVisible();
    await expect(page.locator('#name-error')).toContainText(
      'Prosimy o podanie imienia i nazwiska.'
    );
    await expect(page.locator('#email-error')).toContainText(
      'Prosimy o podanie adresu e-mail.'
    );
    await expect(page.locator('#message-error')).toContainText(
      'Prosimy o wpisanie treści zapytania.'
    );
  });

  test('powinien pozwalać wpisać dane do formularza', async ({ page }) => {
    await page.locator('[name="name"]').fill('Jan Kowalski');
    await page.locator('[name="email"]').fill('jan@example.com');
    await page.locator('[name="message"]').fill(
      'To jest przykładowa wiadomość testowa.'
    );

    await expect(page.locator('[name="name"]')).toHaveValue('Jan Kowalski');
    await expect(page.locator('[name="email"]')).toHaveValue('jan@example.com');
    await expect(page.locator('[name="message"]')).toHaveValue(
      'To jest przykładowa wiadomość testowa.'
    );
  });

  test('powinien pokazać sukces po wysłaniu wiadomości', async ({ page }) => {
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Wiadomość została wysłana.',
        }),
      });
    });

    await page.locator('[name="name"]').fill('Jan Kowalski');
    await page.locator('[name="email"]').fill('jan@example.com');
    await page.locator('[name="message"]').fill(
      'To jest przykładowa wiadomość testowa.'
    );

    await page.locator('#contact-submit').click();

    await expect(page.locator('#form-success')).toBeVisible();
    await expect(page.locator('#form-success')).toContainText(
      'Dziękujemy. Wiadomość została wysłana pomyślnie.'
    );

    await expect(page.locator('[name="name"]')).toHaveValue('');
    await expect(page.locator('[name="email"]')).toHaveValue('');
    await expect(page.locator('[name="message"]')).toHaveValue('');
  });

  test('powinien pokazać błąd, gdy API odrzuci wiadomość', async ({ page }) => {
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.',
        }),
      });
    });

    await page.locator('[name="name"]').fill('Jan Kowalski');
    await page.locator('[name="email"]').fill('jan@example.com');
    await page.locator('[name="message"]').fill(
      'To jest przykładowa wiadomość testowa.'
    );

    await page.locator('#contact-submit').click();

    await expect(page.locator('#form-send-error')).toBeVisible();
    await expect(page.locator('#form-send-error')).toContainText(
      'Nie udało się wysłać wiadomości.'
    );

    await expect(page.locator('[name="name"]')).toHaveValue('Jan Kowalski');
    await expect(page.locator('[name="email"]')).toHaveValue('jan@example.com');
    await expect(page.locator('[name="message"]')).toHaveValue(
      'To jest przykładowa wiadomość testowa.'
    );
  });

test('powinien blokować przycisk podczas wysyłania', async ({ page }) => {
  let finishRequest!: () => void;

  await page.route('**/api/contact', async route => {
    await new Promise<void>(resolve => {
      finishRequest = resolve;
    });

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Wiadomość została wysłana.',
      }),
    });
  });

  await page.locator('[name="name"]').fill('Jan Kowalski');
  await page.locator('[name="email"]').fill('jan@example.com');
  await page.locator('[name="message"]').fill(
    'To jest przykładowa wiadomość testowa.'
  );

  await page.locator('#contact-submit').click();

  await expect(page.locator('#contact-submit')).toBeDisabled();
  await expect(page.locator('#contact-submit-label')).toHaveText('Wysyłanie...');

  finishRequest();

  await expect(page.locator('#form-success')).toBeVisible();
  await expect(page.locator('#contact-submit')).toBeEnabled();
});

test('powinien prawidłowo oznaczać błędne pola dla czytników ekranu', async ({ page }) => {
  await page.locator('#contact-submit').click();

  const name = page.locator('#name');
  const email = page.locator('#email');
  const message = page.locator('#message');

  // Pola z błędami powinny mieć aria-invalid="true"
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(message).toHaveAttribute('aria-invalid', 'true');

  // Każde pole powinno wskazywać swój komunikat błędu
  await expect(name).toHaveAttribute('aria-describedby', 'name-error');
  await expect(email).toHaveAttribute('aria-describedby', 'email-error');
  await expect(message).toHaveAttribute('aria-describedby', 'message-error');

  // Podsumowanie błędów powinno otrzymać fokus
  await expect(page.locator('#form-error-summary')).toBeFocused();
});

test('powinien usuwać błąd po poprawieniu danych', async ({ page }) => {
  const name = page.locator('#name');

  await page.locator('#contact-submit').click();

  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name-error')).toBeVisible();

  await name.fill('Jan Kowalski');

  await expect(name).toHaveAttribute('aria-invalid', 'false');
  await expect(page.locator('#name-error')).toBeHidden();
});
test('powinien odrzucać zbyt krótką treść zapytania', async ({ page }) => {
  await page.locator('[name="name"]').fill('Jan Kowalski');
  await page.locator('[name="email"]').fill('jan@example.com');
  await page.locator('[name="message"]').fill('Za krótka');

  await page.locator('#contact-submit').click();

  await expect(page.locator('#message-error')).toBeVisible();
  await expect(page.locator('#message-error')).toContainText(
    'Treść zapytania musi zawierać co najmniej 10 znaków.'
  );

  await expect(page.locator('#form-success')).toBeHidden();
});
});
