# Pixabay App

Een moderne React applicatie voor het zoeken naar afbeeldingen via Pixabay API, bekijken van blog posts en community interacties met een prachtig glasmorfisme design.

## 🚀 Features

- **Glasmorfisme UI**: Moderne glazen effecten met backdrop blur
- **Afbeelding zoeken**: Pixabay API integratie voor het zoeken naar afbeeldingen
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
- **React Router** - Client-side routing
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

3. Maak een `.env` bestand in de root directory:

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

## 📁 Project Structure

```bash
src/
├── components/          # Reusable UI components
│   ├── BlogPost.tsx     # Blog post display component
│   ├── FilterPanel.tsx  # Image search filters
│   ├── Geolocation.tsx  # Location services
│   ├── ImageList.tsx    # Image gallery display
│   ├── ImageSearch.tsx  # Main search interface
│   ├── Navbar.tsx       # Navigation component
│   ├── SearchHistory.tsx # Search history component
│   ├── SinglePost.tsx   # Individual post view
│   ├── UserCard.tsx     # User profile cards
│   └── ...
├── constants/           # Application constants
│   ├── navLinks.ts      # Navigation links
│   ├── types.ts         # TypeScript type definitions
│   └── ui.ts           # UI constants and options
├── hooks/               # Custom React hooks
│   └── useSearch.ts     # Search functionality hook
├── models/              # TypeScript interfaces
│   └── IPixabay.tsx     # Pixabay API types
└── App.tsx             # Main app component
```

## 🧪 Code Quality

Dit project volgt moderne React best practices:

- **Error Boundaries**: Voor graceful error handling
- **Custom Hooks**: Voor herbruikbare logica
- **TypeScript**: Voor type safety
- **Environment Validation**: Voor configuration checks
- **Component Composition**: Voor maintainable UI
- **Constants**: Voor centralized configuration

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
3. Commit je changes (`git commit -m 'Add amazing feature'`)
4. Push naar de branch (`git push origin feature/amazing-feature`)
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License.

## 🙏 Acknowledgments

- [Pixabay](https://pixabay.com/) voor de gratis image API
- [React](https://reactjs.org/) voor het UI framework
- [Vite](https://vitejs.dev/) voor de snelle build tool
- [Tailwind CSS](https://tailwindcss.com/) voor het utility-first CSS framework

---

Gemaakt met ❤️ voor de Webframeworks cursus
