# Our Winter Love Story 💕

A beautiful Progressive Web App (PWA) for creating memorable romantic adventures with your partner. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- **8 Progressive Levels** - Sequential gameplay with story-driven challenges
- **6 Mini-Games** - Word scramble, photo hunt, memory match, trivia, mad libs, and color matching
- **Photo Uploads** - Capture memories with automatic compression
- **Memory Book** - Final compilation of all photos, stories, and moments
- **Offline Support** - Works without internet after initial load
- **Mobile-First** - Optimized for phones and tablets
- **Fully Customizable** - Easy configuration via JSON file

## 🚀 Quick Start

### Installation

\`\`\`bash
# Clone or download this repository
cd LoveApp

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Visit http://localhost:5173 to see your app!

### Build for Production

\`\`\`bash
# Create production build
npm run build

# Preview production build
npm run preview
\`\`\`

## 🎨 Customization

Edit \`src/data/config.json\` to personalize your experience:

\`\`\`json
{
  "appTitle": "Our Winter Love Story",
  "partnerName": "My Love",
  "playlist": {
    "embedUrl": "your-spotify-or-apple-music-url"
  },
  "levels": [
    {
      "title": "Your Level Title",
      "storyText": "Your romantic message...",
      "miniGame": { ... },
      "rewards": { ... }
    }
  ]
}
\`\`\`

### What You Can Customize

- ✏️ App title and partner name
- 📝 Story text for each level
- 🎮 Mini-game content (questions, scrambled words, etc.)
- 📍 Locations, times, and dress codes
- 💌 Secret messages and rewards
- 🎵 Music playlist URL

## 🎮 Mini-Games

1. **Word Scramble** - Unscramble romantic messages
2. **Photo Hunt** - Upload photos based on a checklist
3. **Memory Match** - Match pairs in a card game
4. **Trivia** - Answer questions about your relationship
5. **Mad Libs** - Create silly stories together
6. **Color Match** - Match colors to discover locations

## 📱 Mobile Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click!

### Install on Phone

1. Visit your deployed URL on mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen"
4. App will install like a native application

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Workbox** - PWA support
- **browser-image-compression** - Photo optimization

## 📂 Project Structure

\`\`\`
src/
├── components/
│   ├── UI/              # Reusable UI components
│   ├── MiniGames/       # Game components
│   └── Levels/          # Level screens
├── utils/               # Helper functions
├── data/
│   └── config.json      # APP CONFIGURATION
└── App.jsx              # Main component
\`\`\`

## 🎯 Features Checklist

✅ Progressive level unlocking  
✅ Photo upload with compression  
✅ localStorage progress saving  
✅ Offline PWA capabilities  
✅ Responsive mobile design  
✅ Confetti animations  
✅ Memory book compilation  
✅ Easy customization  

## 🤝 Contributing

Feel free to fork and customize for your own romantic adventures!

## 📄 License

This project is open source and available for personal use.

## 💕 Made With Love

Created to make special moments even more memorable.

---

**Need help?** Check out the [walkthrough.md](docs/walkthrough.md) for detailed documentation.
