# Course Outline Builder

A modern React application for creating and managing course outlines with an intuitive drag-and-drop interface.

## Features

- **Interactive Course Builder**: Create structured course modules with drag-and-drop functionality
- **Module Management**: Add, edit, and delete course modules
- **Content Organization**: Support for links, uploads, and various content types
- **Search & Filter**: Find specific modules and content quickly
- **Responsive Design**: Works seamlessly across different screen sizes
- **Real-time Navigation**: Dynamic outline with active module tracking

## Tech Stack

- **Frontend**: React 19.1.0 with Vite
- **Drag & Drop**: @dnd-kit for smooth interactions
- **Styling**: CSS with modern design patterns
- **Code Quality**: ESLint + Prettier for consistent formatting

## Steps to Run Project Locally

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application will automatically reload when you make changes

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── components/
│   ├── modules/     # Course builder components
│   └── ui/          # Reusable UI components
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── utils/           # Utility functions and helpers
└── constants/       # Application constants
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting
5. Submit a pull request

## License

This project is private and proprietary.