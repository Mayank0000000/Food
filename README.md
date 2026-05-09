# FooD 🍔

A modern, feature-rich food delivery and restaurant booking mobile application built with React Native and Expo.

## Features

- **Authentication**: Secure login/signup with biometric authentication support
- **Menu Explorer**: Browse restaurant menu with categories, filters, and search
- **Order Management**: Place orders, track delivery in real-time, and view order history
- **Dine-In Booking**: Reserve tables with date/time selection
- **AI Chat Assistant**: Get food recommendations and support via AI-powered chat
- **Multi-language Support**: Localized content for different languages
- **Location Services**: Real-time delivery tracking with maps integration
- **Notifications**: Push notifications for order updates and promotions
- **Bookmarks**: Save favorite menu items
- **Address Management**: Store and manage multiple delivery addresses
- **Profile Management**: Edit profile, manage settings, and preferences
- **Deep Linking**: Support for app navigation via URLs

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Redux Toolkit
- **UI Components**: Custom components with React Native Reanimated
- **Maps**: Expo Maps & React Native Maps
- **Authentication**: Expo Local Authentication (biometric)
- **Notifications**: Expo Notifications
- **Chat**: React Native Gifted Chat
- **Storage**: AsyncStorage
- **API Integration**: Axios
- **AI Services**: Groq

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for testing on physical devices)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd food
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with required API keys:
   - **GitHub Token**: For data storage (create at https://github.com/settings/tokens)
   - **OpenRouteService API Key**: For maps and directions (get at https://openrouteservice.org/dev/#/signup)
   - **AI API Keys**: Choose one or more:
     - Groq API (https://console.groq.com/keys) - RECOMMENDED, FREE & Fast

## Running the App

Start the development server:
```bash
npm start
```

Then choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

### Platform-specific commands:
```bash
npm run ios      # Run on iOS
npm run android  # Run on Android
npm run web      # Run on web browser
```

## Project Structure

```
├── app/                    # File-based routing screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation screens
│   └── ...                # Other screens (chat, tracking, etc.)
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── home/             # Home screen components
│   ├── menu/             # Menu-related components
│   ├── orders/           # Order components
│   ├── settings/         # Settings components
│   └── ui/               # Generic UI components
├── services/             # API and service integrations
├── store/                # Redux store and slices
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
├── utils/                # Utility functions
├── styles/               # Style definitions
├── types/                # TypeScript type definitions
├── constants/            # App constants
├── config/               # Configuration files
└── assets/               # Images, fonts, and other assets
```

## Key Features Implementation

### Authentication
- Email/password authentication
- Biometric authentication (fingerprint/face ID)
- Secure token storage
- Example users available in `example-users.json`

### Data Storage
- GitHub-based backend for data persistence
- JSON files stored in GitHub repository
- Real-time data synchronization

### AI Chat
- Multiple AI provider support (Groq)
- Context-aware food recommendations
- Natural language order assistance

### Order Tracking
- Real-time delivery tracking
- Map integration with route visualization
- Push notifications for order status updates

### Localization
- Multi-language support
- Dynamic content translation
- Language selector in settings

## Configuration

### Deep Linking
The app supports deep linking with the `food://` scheme. Configure your links in `app.json`.

### Notifications
Push notifications are configured for order updates and promotions. Permissions are requested on first launch.

### Location Services
Location permissions are required for delivery tracking and address management.

## Development

### Code Quality Tools

The project uses ESLint, Prettier, and TypeScript for code quality and consistency.

#### Linting
```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Strict mode (CI) - fails on warnings
npm run lint:check
```

#### Formatting
```bash
# Format all files with Prettier
npm run format

# Check if files are formatted
npm run format:check
```

#### Type Checking
```bash
# Run TypeScript type checking
npm run type-check
```

### VS Code Setup

For the best development experience, install these extensions:
- **ESLint** (`dbaeumer.vscode-eslint`) - Real-time linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting

The project includes VS Code settings for automatic formatting and linting on save.

### Code Style Guide

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Line Length**: 120 characters max
- **Trailing Commas**: Required in multi-line

See `docs/ESLINT_SETUP.md` for complete ESLint documentation.

## Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## Environment Variables

See `.env.example` for all required environment variables. Key configurations:

- **GitHub Integration**: For data storage backend
- **Maps API**: For location and routing features
- **AI Services**: For chat assistant functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


