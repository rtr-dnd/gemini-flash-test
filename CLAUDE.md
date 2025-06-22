# Claude Development Guidelines

## Code Quality Standards

### Linting and Formatting
- **IMPORTANT**: After generating or modifying any code, ALWAYS run `npm run lint:fix` to ensure proper formatting and fix any linting issues
- This command should be executed automatically after any code changes to maintain consistent code style
- Fix any ESLint errors before considering the task complete

### Development Workflow
1. Write/modify code
2. Run `npm run lint:fix` 
3. Fix any remaining errors manually if needed
4. Verify the code builds and runs correctly

## Project Structure
- Next.js 15 application with TypeScript
- Tailwind CSS for styling
- API routes for backend functionality
- Gemini 2.5 Flash Lite integration for AI-powered suggestions

## Testing
- Run tests with: (to be determined based on project setup)
- Ensure all tests pass before committing changes

## Environment Variables
- Store sensitive data like API keys in `.env.local`
- Required environment variables:
  - `GOOGLE_AI_API_KEY`: Your Google Gemini API key for search results generation
- Never commit API keys or secrets to the repository