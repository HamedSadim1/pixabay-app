import React, { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import StatusCard from "@/components/ui/StatusCard";

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
          <StatusCard
            tone="warning"
            icon="warning"
            title="Something went wrong"
            message="An unexpected error occurred. Please try refreshing the page."
            actions={
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                <Icon name="rotateRight" /> Reload Page
              </Button>
            }
            className="mx-auto max-w-md"
          />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
