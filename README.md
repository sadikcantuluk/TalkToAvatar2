# TalkToAvatar - React Native App

A mobile application that allows users to create and interact with AI avatars using text-to-speech, travel assistant, and avatar-to-video features.

## 🚀 Project Structure

```
TalkToAvatar/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Header.js
│   │   ├── AvatarCard.js
│   │   ├── LoadingDots.js
│   │   └── index.js
│   ├── screens/            # App screens
│   │   ├── SplashScreen.js
│   │   ├── WelcomeScreen.js
│   │   ├── SelectAvatarScreen.js
│   │   ├── CreateCustomAvatarScreen.js
│   │   ├── DashboardScreen.js
│   │   └── index.js
│   ├── navigation/         # Navigation setup
│   │   └── AppNavigator.js
│   └── constants/          # App constants (theme, images, etc.)
│       ├── theme.js
│       ├── images.js
│       └── index.js
├── assets/                 # Images and static files
│   ├── logo.png
│   ├── yusuf.jpg
│   └── eda.jpg
├── App.js                  # Main app entry
└── package.json
```

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
- **iOS**: Press `i` or scan QR code with Expo Go app
- **Android**: Press `a` or scan QR code with Expo Go app
- **Web**: Press `w`

## 🎨 Features Implemented

### ✅ Screens Created:
1. **Splash Screen** - Animated logo with loading indicator
2. **Welcome Screen** - Carousel showcasing app features
3. **Select Avatar Screen** - Choose from default avatars or create custom
4. **Create Custom Avatar Screen** - Upload photo and create personalized avatar
5. **Dashboard (TTS Mode)** - Main screen with text-to-speech functionality

### ✅ Reusable Components:
- **Button** - Flexible button with variants (primary, secondary, outline, ghost)
- **Input** - Text input with label, icons, and validation
- **Header** - App bar with back button and title
- **AvatarCard** - Avatar selection card with image and details
- **LoadingDots** - Animated loading indicator

### ✅ Navigation:
- React Navigation configured with stack navigation
- Smooth transitions between screens
- Proper navigation flow from Splash → Welcome → Avatar Selection → Dashboard

## 🎯 Next Steps

To complete the app functionality, you'll need to:

1. **Install dependencies** (already added to package.json):
   - React Navigation
   - Expo Image Picker
   - Vector Icons

2. **Implement API integrations**:
   - OpenAI API for TTS and STT
   - Google Gemini API for custom avatar generation
   - Fal.ai API for avatar-to-video conversion

3. **Add remaining modes**:
   - Travel Assistant mode
   - Avatar to Video mode

4. **Implement features**:
   - Voice recording (STT)
   - Audio playback
   - Avatar animation during speech
   - Video generation and playback
   - History/past outputs

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_key_here
GOOGLE_AI_API_KEY=your_gemini_key_here
FAL_API_KEY=your_fal_key_here
```

## 📱 Screens Overview

### Splash Screen
- Displays app logo
- Animated loading indicator
- Auto-navigates to Welcome after 3 seconds

### Welcome Screen
- Horizontal carousel showing 3 app modes
- Language selector
- Page indicators
- Get Started / Skip buttons

### Select Avatar Screen
- Grid layout of default avatars
- Create custom avatar button
- Selected avatar highlighted with check mark
- Continue button to proceed

### Create Custom Avatar Screen
- Three-step process: Upload → Loading → Confirmation
- Image picker integration
- Avatar name input
- Preview and accept/recreate options

### Dashboard (TTS Mode)
- Avatar display with select button
- Output name input
- Text input with voice recording option
- Voice and language selection
- Create/Play button
- Past audio history access

## 🎨 Design System

### Colors
- Primary: `#137fec`
- Secondary: `#A626D3`
- Background Dark: `#101922`
- Text Light: `#F0F0F0`

### Components
All components follow a consistent design system with:
- Rounded corners
- Glassmorphism effects
- Smooth animations
- Dark theme optimized

## 📝 Notes

- Built with Expo for cross-platform compatibility
- Uses React Navigation for navigation
- Implements modern React patterns and hooks
- Responsive design for various screen sizes
- Optimized for dark mode

## 🤝 Contributing

This project is part of the TalkToAvatar mobile application. Follow the coding standards and component patterns established in the existing codebase.

