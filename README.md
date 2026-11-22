
# Kancelaria Notarialna – strona internetowa

## 1. Opis projektu

Projekt strony internetowej Kancelarii Notarialnej Zbigniewa Władysławskiego.

Strona została zaprojektowana jako responsywna witryna typu one-page, z dodatkową podstroną zawierającą politykę prywatności.

Główne funkcjonalności:
- prezentacja informacji o kancelarii,
- sekcje informacyjne dotyczące usług notarialnych,
- formularz kontaktowy i wysyłka wiadomości z formularza za pośrednictwem Resend,
- osobna podstrona z polityką prywatności,
- responsywny układ dostosowany do urządzeń mobilnych, tabletów i komputerów.

## 2. Technologie

Projekt wykorzystuje:
- Astro – framework do budowy stron internetowych,
- Tailwind CSS – stylowanie i układ elementów,
- JavaScript – obsługa interakcji i formularza,
- Resend – obsługa wysyłki wiadomości e-mail z formularza kontaktowego.

Szczegółowa lista zależności znajduje się w pliku `package.json`.

## 3. Wymagania

Do uruchomienia projektu wymagane są:
- Node.js,
- npm.

## 4. Instalacja i uruchomienie

Po rozpakowaniu projektu należy otworzyć terminal w jego głównym katalogu i wykonać:

```bash
npm install
```

Następnie uruchomić serwer deweloperski:

```bash
npm run dev
```

Strona będzie dostępna pod adresem:

http://localhost:4321

## 5. Budowanie wersji produkcyjnej

Aby przygotować stronę do wdrożenia, należy wykonać:

```bash
npm run build
```

Gotowa wersja produkcyjna zostanie wygenerowana w katalogu `dist/`.

Podgląd wersji produkcyjnej można uruchomić poleceniem:

```bash
npm run preview
```


## 6. Formularz kontaktowy – konfiguracja Resend

Formularz kontaktowy korzysta z usługi Resend do wysyłania wiadomości e-mail.

Do projektu dołączono plik `.env.example`, który zawiera przykładowe zmienne środowiskowe wymagane do konfiguracji formularza.

Przed uruchomieniem formularza w środowisku produkcyjnym należy:

1. Skonfigurować konto Resend.
2. Zweryfikować domenę nadawcy w usłudze Resend.
3. Wygenerować klucz API.
4. Utworzyć własny plik `.env` na podstawie `.env.example` i uzupełnić go właściwymi danymi.

**Uwaga:** plik `.env` zawierający rzeczywiste dane dostępowe nie powinien być umieszczany w repozytorium ani przekazywany w publicznie dostępnym archiwum.


## 7. Struktura projektu

Najważniejsze katalogi:

- `src/components/` – komponenty strony,
- `src/layouts/` – układy stron,
- `src/pages/` – strony i podstrony,
- `src/styles/` – globalne style,
- `src/lib/` – logika pomocnicza, w tym obsługa wysyłki wiadomości,
- `public/` – pliki statyczne, grafiki i zasoby.

## 8. Podstrony

- `/` – strona główna kancelarii,
- `/polityka-prywatnosci` – polityka prywatności.

## 9. Informacje dotyczące wdrożenia

Przed wdrożeniem produkcyjnym należy:

- skonfigurować zmienne środowiskowe,
- sprawdzić poprawność działania formularza kontaktowego,
- skonfigurować usługę Resend i domenę nadawcy,
- sprawdzić działanie strony na urządzeniach mobilnych i desktopowych,
- skonfigurować domenę i hosting,
- zweryfikować treść polityki prywatności pod kątem rzeczywistej konfiguracji wdrożenia.

## 10. Uwagi końcowe

Projekt przekazywany jest w postaci kodu źródłowego.

Wszelkie dane dostępowe, klucze API oraz konfiguracja środowiska produkcyjnego powinny zostać uzupełnione przez podmiot odpowiedzialny za wdrożenie.
