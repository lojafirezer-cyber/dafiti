import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="text-center px-6 max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-2">Algo deu errado</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/checkout';
              }}
              className="px-6 py-2.5 bg-[#22c55e] text-white rounded-lg text-sm font-semibold hover:bg-[#16a34a] transition-colors"
            >
              Voltar ao checkout
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
