// src/main.jsx
window.alert('MAIN.JSX IS RUNNING');
document.body.style.backgroundColor = 'red';
console.log('🚀 Main.jsx executing check...');
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/routes.jsx";
import "./index.css";

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Application error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

console.log('🚀 Attempting to find root and render...');
const root = document.getElementById("root");
console.log('Root element:', root);

if (!root) {
    console.error('❌ FATAL: Root element not found!');
} else {
    try {
        ReactDOM.createRoot(root).render(
            <React.StrictMode>
                <ErrorBoundary>
                    <AppRouter />
                </ErrorBoundary>
            </React.StrictMode>
        );
        console.log('✅ Render called successfully');
    } catch (err) {
        console.error('❌ FATAL: Error during render:', err);
    }
}
