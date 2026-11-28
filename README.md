# Kancelaria Notarialna – strona internetowa

## 1. Opis projektu

Projekt strony internetowej Kancelarii Notarialnej Zbigniewa Władysławskiego.

Strona została zaprojektowana jako responsywna witryna typu one-page, z dodatkowymi podstronami zawierającymi politykę prywatności oraz stronę błędu 404.

Główne funkcjonalności:

- prezentacja informacji o kancelarii,
- sekcje informacyjne dotyczące usług notarialnych,
- formularz kontaktowy i wysyłka wiadomości z formularza za pośrednictwem Resend,
- backend Node.js obsługujący formularz kontaktowy,
- osobna podstrona z polityką prywatności,no jes
- dedykowana strona błędu 404 informująca o próbie wejścia na nieistniejący adres URL,
- responsywny układ dostosowany do urządzeń mobilnych, tabletów i komputerów.

## 2. Technologie

Projekt wykorzystuje:

- Astro – framework do budowy stron internetowych,
- Tailwind CSS – stylowanie i układ elementów,
- JavaScript – obsługa interakcji i formularza,
- Node.js – backend obsługujący formularz kontaktowy,
- Resend – obsługa wysyłki wiadomości e-mail z formularza kontaktowego.

Szczegółowa lista zależności znajduje się w plikach `package.json` projektu oraz backendu.

## 3. Wymagania

Do uruchomienia projektu wymagane są:

- Node.js,
- npm.

## 4. Instalacja i uruchomienie

Po rozpakowaniu projektu należy otworzyć terminal w jego głównym katalogu i wykonać:

```bash
npm install
```

Następnie uruchomić serwer deweloperski strony:

```bash
npm run dev
```

Strona będzie dostępna pod adresem:

[http://localhost:4321](http://localhost:4321)

### Uruchomienie backendu

Backend obsługujący formularz kontaktowy znajduje się w katalogu `backend/`. Jest to osobna aplikacja napisana w Node.js, odpowiedzialna za obsługę formularza kontaktowego oraz wysyłkę wiadomości e-mail za pośrednictwem Resend.

Aby uruchomić backend, należy otworzyć osobny terminal, przejść do katalogu `backend/` i wykonać:

```bash
npm install
npm start
```

Backend należy uruchomić niezależnie od serwera deweloperskiego strony internetowej.

Podczas pracy lokalnej powinny działać jednocześnie frontend oraz backend, aby formularz kontaktowy mógł prawidłowo wysyłać wiadomości.

## 5. Budowanie wersji produkcyjnej

Aby przygotować stronę do wdrożenia, należy wykonać w głównym katalogu projektu:

```bash
npm run build
```

Gotowa wersja produkcyjna strony zostanie wygenerowana w katalogu `dist/`.

Podgląd wersji produkcyjnej można uruchomić poleceniem:

```bash
npm run preview
```

Backend jest osobną aplikacją i wymaga niezależnego uruchomienia w środowisku produkcyjnym.

## 6. Formularz kontaktowy – konfiguracja Resend

Formularz kontaktowy korzysta z usługi Resend do wysyłania wiadomości e-mail.

Backend obsługujący formularz znajduje się w katalogu `backend/`. Do jego działania wymagane jest odpowiednie skonfigurowanie zmiennych środowiskowych.

W projekcie znajduje się plik `.env.example`, zawierający przykładowe zmienne środowiskowe wymagane do konfiguracji formularza.

Przed uruchomieniem formularza w środowisku produkcyjnym należy:

1. Skonfigurować konto Resend.
2. Zweryfikować domenę nadawcy w usłudze Resend.
3. Wygenerować klucz API.
4. Utworzyć własny plik `.env` na podstawie `.env.example` i uzupełnić go właściwymi danymi.
5. Skonfigurować backend zgodnie z wymaganiami środowiska produkcyjnego.
6. Upewnić się, że frontend wysyła żądania do prawidłowego adresu backendu.

**Uwaga:** plik `.env` zawierający rzeczywiste dane dostępowe nie powinien być umieszczany w repozytorium ani przekazywany w publicznie dostępnym archiwum.

## 7. Struktura projektu

Najważniejsze katalogi:

- `src/components/` – komponenty strony,
- `src/layouts/` – układy stron,
- `src/pages/` – strony i podstrony,
- `src/styles/` – globalne style,
- `src/lib/` – logika pomocnicza,
- `backend/` – backend Node.js obsługujący formularz kontaktowy i wysyłkę wiadomości e-mail,
- `public/` – pliki statyczne, grafiki i zasoby.

## 8. Podstrony

- `/` – strona główna kancelarii,
- `/polityka-prywatnosci` – podstrona z polityką prywatności,
- `/404` – strona błędu 404 wyświetlana w przypadku wejścia na nieistniejący adres URL.

## 9. Informacje dotyczące wdrożenia

Przed wdrożeniem produkcyjnym należy:

- skonfigurować zmienne środowiskowe,
- skonfigurować usługę Resend i domenę nadawcy,
- uruchomić backend Node.js znajdujący się w katalogu `backend/`,
- zapewnić dostępność backendu dla strony internetowej,
- sprawdzić poprawność działania formularza kontaktowego,
- sprawdzić działanie strony błędu 404,
- sprawdzić działanie strony na urządzeniach mobilnych i desktopowych,
- skonfigurować domenę i hosting,
- skonfigurować środowisko uruchomieniowe backendu,
- zweryfikować treść polityki prywatności pod kątem rzeczywistej konfiguracji wdrożenia.

Backend powinien być uruchomiony jako osobna usługa, niezależnie od statycznej wersji strony internetowej.

## 10. Uwagi końcowe

Projekt przekazywany jest w postaci kodu źródłowego.

Wszelkie dane dostępowe, klucze API oraz konfiguracja środowiska produkcyjnego powinny zostać uzupełnione przez podmiot odpowiedzialny za wdrożenie.
