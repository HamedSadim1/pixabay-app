# Pixabay App

[![CI](https://github.com/HamedSadim1/pixabay-app/actions/workflows/ci.yml/badge.svg)](https://github.com/HamedSadim1/pixabay-app/actions/workflows/ci.yml)

Een moderne React applicatie voor het zoeken naar afbeeldingen via Pixabay API, bekijken van blog posts en community interacties met een prachtig glasmorfisme design.

## 🚀 Features

- **Glasmorfisme UI**: Moderne glazen effecten met backdrop blur
- **Afbeelding zoeken**: Pixabay API integratie met filters (type, orientatie, kleur, minimale afmetingen) en zoekgeschiedenis
- **Blog posts**: Toon en beheer blog content
- **Locatie services**: Geolocation functionaliteit
- **Responsive design**: Werkt perfect op alle apparaten
- **TypeScript**: Volledig getypeerd voor betere ontwikkelervaring
- **Error boundaries**: Betere error handling en gebruikerservaring

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling met glasmorfisme effecten
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📦 Installation

1. Clone de repository:

   ```bash
   git clone <repository-url>
   cd pixabay-app
   ```

2. Installeer dependencies:

   ```bash
   npm install
   ```

3. Maak een `.env` bestand (of kopieer het template):

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_PIXABAY_API_KEY=jouw_pixabay_api_key
   VITE_PIXABAY_BASE_URL=https://pixabay.com/api/
   ```

4. Start de development server:

   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie (output naar `dist` folder)
- `npm run preview` - Preview productie build lokaal
- `npm run lint` - Draai ESLint over het hele project
- `npm run lint:fix` - Draai ESLint en fix automatisch wat mogelijk is
- `npm run typecheck` - TypeScript type check (`tsc --noEmit`)
- `npm run format` - Format alle bestanden met Prettier
- `npm run format:check` - Controleer of alles geformat is (gebruikt in CI)

## 🛡️ Developer Tooling

- **ESLint 9** - Strikt geconfigureerd (flat config): geen `any`, geen ongebruikte imports/variabelen, type-only imports, en meer
- **Prettier** - Consistente formatting, geïntegreerd met ESLint via `eslint-config-prettier`
- **Husky + lint-staged** - Git hooks: bij elke commit worden gestagde bestanden automatisch geformat en gelint
- **Commitlint** - Commit messages moeten voldoen aan [Conventional Commits](https://www.conventionalcommits.org/) (bv. `feat:`, `fix:`, `chore:`)
- **GitHub Actions** - CI workflow die lint, formatting-check, typecheck en build draait op elke pull request

## 📁 Project Structure

```bash
src/
├── api/                          # API client modules
│   ├── geocoding.ts              # Reverse geocoding API
│   └── pixabay.ts                # Pixabay API client
├── components/                   # Components georganiseerd per feature
│   ├── blog/                     # Blog-gerelateerde componenten
│   │   ├── AuthorHeader.tsx      # Auteur header
│   │   ├── BlogPost.tsx          # Blog post weergave
│   │   └── SinglePost.tsx        # Individuele post view
│   ├── image/                    # Afbeelding zoeken & galerij
│   │   ├── FilterPanel.tsx       # Zoekfilters
│   │   ├── ImageDetail.tsx       # Afbeelding detail view
│   │   ├── ImageList.tsx         # Afbeelding galerij
│   │   ├── ImageSearch.tsx       # Hoofd zoekinterface
│   │   ├── ImageStats.tsx        # Afbeelding statistieken
│   │   ├── SearchHistory.tsx     # Zoekgeschiedenis
│   │   └── TagList.tsx           # Tag weergave
│   ├── layout/                   # App shell componenten
│   │   ├── ErrorBoundary.tsx     # Error boundary
│   │   ├── Navbar.tsx            # Navigatie component
│   │   └── SprocketStrip.tsx     # Decoratieve strip
│   ├── ui/                       # Herbruikbare UI componenten
│   │   ├── Avatar.tsx            # Gebruikersavatar
│   │   ├── Button.tsx            # Button component
│   │   ├── DataField.tsx         # Data veld weergave
│   │   ├── Frame.tsx             # Decoratieve frame
│   │   ├── Icon.tsx              # Icon wrapper
│   │   ├── MetaLabel.tsx         # Metadata label
│   │   ├── Spinner.tsx           # Laad state component
│   │   └── StatusCard.tsx        # Status kaart
│   ├── Geolocation.tsx           # Locatie services (pagina-level)
│   ├── Home.tsx                  # Home pagina (pagina-level)
│   ├── LocationMap.tsx           # Leaflet map component
│   └── UserCard.tsx              # Gebruikersprofiel kaart
├── config/                       # Configuratie
│   └── api.ts                    # API configuratie & env validatie
├── constants/                    # Applicatie constanten
│   ├── buttonStyles.ts           # Button stijlen
│   ├── filters.ts                # Filter type definities
│   ├── icons.ts                  # Icon mapping
│   ├── mockData.ts               # Mock data voor posts/comments
│   ├── navLinks.ts               # Navigatie links
│   ├── routeLoaders.ts           # Lazy route loaders
│   ├── routes.ts                 # Route paden
│   └── ui.ts                     # UI constanten en opties
├── hooks/                        # Custom React hooks
│   ├── useDebouncedValue.ts      # Debounced waarde hook
│   ├── useGeolocation.ts         # Geolocation hook
│   ├── useReverseGeocode.ts      # Reverse geocoding hook
│   ├── useSearch.ts              # Zoekfunctionaliteit hook
│   ├── useShareFeedback.ts       # Share feedback hook
│   └── useToggle.ts              # Boolean toggle hook
├── models/                       # TypeScript interfaces
│   └── IPixabay.tsx              # Pixabay API types
├── utils/                        # Hulpprogramma's
│   ├── cn.ts                     # Classname merge utility
│   ├── env.ts                    # Environment validatie
│   ├── error.ts                  # Foutafhandeling
│   ├── format.ts                 # Formattering utilities
│   ├── geo.ts                    # Geocoördinaat utilities
│   └── share.ts                  # Deel functionaliteit
├── App.tsx                       # Hoofd app component
└── main.tsx                      # Entry point
```

### 🔗 Path Alias

Dit project gebruikt een `@/` alias voor absolute imports vanuit `src/`:

```typescript
// ❌ Diep relatief pad
import { Hit } from "../../models/IPixabay";

// ✅ Schoon en leesbaar
import { Hit } from "@/models/IPixabay";
```

De alias is geconfigureerd in `tsconfig.json` en `vite.config.ts`.

## 🧪 Code Quality

Dit project volgt moderne React best practices:

- **Error Boundaries**: Voor graceful error handling
- **Custom Hooks**: Voor herbruikbare logica
- **TypeScript**: Voor type safety
- **Environment Validation**: Voor configuration checks
- **Component Composition**: Voor maintainable UI
- **Constants**: Voor centralized configuration
- **Strikte linting**: ESLint regels worden afgedwongen bij elke commit en in CI

## 🔒 Environment Variables

Zorg ervoor dat je de volgende environment variables instelt in een `.env` bestand:

```env
VITE_PIXABAY_API_KEY=jouw_pixabay_api_key_hier
VITE_PIXABAY_BASE_URL=https://pixabay.com/api/
```

**API Key verkrijgen:**

1. Ga naar [pixabay.com](https://pixabay.com/)
2. Maak een gratis account aan
3. Ga naar je account settings
4. Kopieer je API key
5. Plak deze in het `.env` bestand

## 🚨 Error Handling

De app bevat comprehensive error handling:

- API fouten worden gracefully afgehandeld
- Error boundaries vangen JavaScript fouten op
- Loading states worden consistent weergegeven
- Gebruikersvriendelijke foutmeldingen

## 📱 Responsive Design

De app is volledig responsive en werkt op:

- Desktop computers
- Tablets
- Mobiele telefoons

## 🎨 Styling

- **Glasmorfisme**: Moderne glazen effecten
- **Dark theme**: Donkere achtergrond voor oogcomfort
- **Consistent spacing**: Gebruik van Tailwind's spacing scale
- **Hover effects**: Subtiele animaties voor interactiviteit

## 🤝 Contributing

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/amazing-feature`)
3. Commit je changes met een [Conventional Commit](https://www.conventionalcommits.org/) message (bv. `git commit -m "feat: add amazing feature"`)
4. Push naar de branch (`git push origin feature/amazing-feature`)
5. Open een Pull Request — de CI workflow draait automatisch lint, typecheck en build

> **Let op:** De commit-msg hook vereist een conventionele commit message (`feat:`, `fix:`, `chore:`, ...). Een message zoals "Add amazing feature" wordt geweigerd. Pre-commit worden je gestagde bestanden automatisch geformat (Prettier) en gelint (ESLint).

## 🙏 Acknowledgments

- [Pixabay](https://pixabay.com/) voor de gratis image API
- [React](https://reactjs.org/) voor het UI framework
- [Vite](https://vitejs.dev/) voor de snelle build tool
- [Tailwind CSS](https://tailwindcss.com/) voor het utility-first CSS framework

---

Gemaakt met ❤️ voor de Webframeworks cursus
