import React, { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "./Button";
import Icon from "./Icon";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="mx-auto max-w-md border border-safelight bg-safelight/10 p-6 text-center">
            <div className="mb-2 text-3xl text-safelight">
              <Icon name="warning" />
            </div>
            <h2 className="mb-2 font-display text-lg uppercase tracking-[0.03em] text-paper">
              Something went wrong
            </h2>
            <p className="mb-5 font-mono text-xs text-muted">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              <Icon name="rotateRight" /> Reload Page
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
