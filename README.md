# AI Code Generator

A modern, responsive web application that integrates with Claude API, Google Gemini API, and Stackblitz to provide intelligent code generation with document processing and real-time preview capabilities.

## Features

### 🚀 Core Functionality
- **Smart Document Processing**: Upload PDFs, Word documents, or text files for AI-powered summarization
- **Prompt Enhancement**: Google Gemini Pro intelligently enhances prompts with technical specifications and best practices
- **Claude Code Generation**: Advanced AI generates production-ready HTML, CSS, and JavaScript
- **Live Code Preview**: Stackblitz integration for real-time code editing and testing
- **Download & Copy**: Easy code export with one-click download and clipboard copy

### 🎨 Design & UX
- **Mobile-First Responsive Design**: Optimized for all device sizes
- **WCAG Accessibility Compliance**: Proper contrast, semantic HTML, and keyboard navigation
- **Dark Mode Support**: System-aware theme switching
- **Smooth Animations**: Subtle micro-interactions and loading states
- **Toast Notifications**: Real-time feedback for user actions

### 🛠 Technical Features
- **Next.js 13+**: Modern React framework with App Router
- **Tailwind CSS**: Utility-first styling with design system
- **TypeScript**: Full type safety throughout the application
- **API Integration**: Secure backend endpoints for all external services
- **Error Handling**: Comprehensive error states and fallbacks

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys for Claude and Groq (see setup instructions below)

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see API Setup section)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Setup

### Required Environment Variables

Create a `.env.local` file in the root directory and add your API keys:

```env
# Claude API Configuration
CLAUDE_API_KEY=your_claude_api_key_here

# Google Gemini API Configuration  
GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

#### Claude API Key
1. Visit [Anthropic's website](https://www.anthropic.com)
2. Sign up for a Claude API account
3. Navigate to your API dashboard
4. Generate a new API key
5. Add it to your `.env.local` file as `CLAUDE_API_KEY`

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Navigate to your API dashboard
4. Create a new API key
5. Add it to your `.env.local` file as `GEMINI_API_KEY`

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── claude/            # Claude API integration
│   │   ├── gemini/            # Google Gemini API integration
│   │   └── upload/            # File upload handling
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main application page
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── DocumentUpload.tsx     # Document upload component
│   ├── PromptEditor.tsx       # Prompt editing interface
│   ├── CodeGenerator.tsx      # Code generation interface
│   ├── ThemeProvider.tsx      # Theme management
│   └── ThemeToggle.tsx        # Dark mode toggle
├── lib/
│   └── utils.ts               # Utility functions
└── hooks/
    └── use-toast.ts           # Toast notification hook
```

## Key Components

### DocumentUpload
- Drag & drop file upload
- File type validation (PDF, Word, Text)
- Progress indicators
- Document processing with Google Gemini API

### PromptEditor  
- Rich text editing for prompts
- AI-powered prompt enhancement
- Real-time character and word count
- Enhancement status indicators

### CodeGenerator
- Claude API integration for code generation
- Tabbed code view (HTML, CSS, JavaScript)
- Copy to clipboard functionality
- Download all files feature
- Stackblitz integration for live preview

## API Endpoints

### POST /api/claude
Generates code using Claude API
- **Body**: `{ prompt: string }`
- **Response**: `{ success: boolean, code: { html: string, css: string, js: string } }`

### POST /api/gemini
Processes text using Google Gemini API
- **Body**: `{ text: string, action: 'summarize' | 'enhance' }`
- **Response**: `{ success: boolean, processedText: string }`

### POST /api/upload
Handles file uploads and text extraction
- **Body**: FormData with file
- **Response**: `{ success: boolean, extractedText: string, filename: string }`

## Customization

### Styling
- Colors and themes can be customized in `tailwind.config.ts`
- Global styles are in `app/globals.css`
- Component-specific styles use Tailwind utility classes

### API Integration
- API endpoints are in the `app/api/` directory
- Each service has its own route handler
- Environment variables are used for API keys

### Components
- All components are in the `components/` directory
- UI components follow shadcn/ui conventions
- Custom components are modular and reusable

### Features
- Add new features by creating components and API routes
- Follow the existing patterns for consistency
- Update the UI to include new functionality

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Make sure to set the required environment variables in your production environment:
- `CLAUDE_API_KEY`
- `GEMINI_API_KEY`

### Deployment Platforms
This application can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Any platform supporting Node.js

## Usage Limits & Considerations

- **API Rate Limits**: Both Claude and Gemini APIs have rate limits. Monitor usage in production.
- **File Size Limits**: Current limit is 10MB for uploaded files. Adjust in `/api/upload/route.ts` if needed.
- **Security**: API keys are server-side only and never exposed to the client.
- **Cost**: Monitor API usage as both services have usage-based pricing.

## Browser Support

- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+

## Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast mode support
- Screen reader compatibility
- Focus management

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new functionality
3. Include proper error handling
4. Test across different devices and browsers
5. Update documentation for new features

## License

This project is provided as-is for educational and development purposes. Please check the terms of service for Claude API, Groq API, and Stackblitz for commercial usage.

## Support

For issues related to:
- **Claude API**: Check Anthropic's documentation
- **Google Gemini API**: Check Google AI documentation
- **Stackblitz**: Check Stackblitz's documentation
- **This Application**: Review the code comments and component documentation

## Future Enhancements

- [ ] Support for more file formats (PowerPoint, Excel)
- [ ] Code templates and presets
- [ ] User authentication and project saving
- [ ] Version control integration
- [ ] Advanced code analysis and suggestions
- [ ] Multi-language code generation
- [ ] Collaborative editing features