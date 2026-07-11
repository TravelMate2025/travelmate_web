import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  /** When provided, render this instead of the full error screen on failure. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
  componentStack?: string;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error boundary caught:", error, info);
    this.setState({ componentStack: info.componentStack ?? undefined });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 px-6">
          <p className="text-lg font-semibold text-gray-800">Something went wrong.</p>
          {this.state.errorMessage && (
            <p className="text-sm text-red-600 max-w-md text-center">{this.state.errorMessage}</p>
          )}
          {this.state.componentStack && (
            <details className="max-w-lg w-full">
              <summary className="text-xs text-gray-500 cursor-pointer">Component stack</summary>
              <pre className="text-xs text-gray-400 overflow-auto mt-1 whitespace-pre-wrap">{this.state.componentStack}</pre>
            </details>
          )}
          <button
            className="px-4 py-2 bg-[#023E8A] text-white rounded-lg"
            onClick={() => {
              this.setState({ hasError: false, componentStack: undefined });
              window.location.href = "/";
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AppErrorBoundary;
