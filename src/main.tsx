import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'

// Enable dark/black theme by default locally.
// This adds the `dark` class to the root element so Tailwind and our CSS variable
// overrides use the black theme defined in `index.css`.
try {
	document.documentElement.classList.add('dark');
} catch (err) {
	// ignore in non-browser environments
}

createRoot(document.getElementById("root")!).render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
);
