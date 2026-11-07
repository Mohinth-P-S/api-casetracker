import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1B1C1A] flex flex-col justify-center items-center px-4 py-12 font-sans">
          <div className="max-w-xl w-full bg-[#FAF8F5] border border-[#C85A32]/40 rounded-[4px] p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C85A32]/10 flex items-center justify-center text-[#C85A32]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C85A32] font-semibold block">
                  Diagnostic Alert
                </span>
                <h1 className="text-xl font-serif font-bold text-[#07241A]">
                  Client Rendering Anomaly
                </h1>
              </div>
            </div>

            <p className="text-sm text-[#5E7D6D] mb-4 leading-relaxed">
              The application encountered an unexpected runtime exception during rendering.
            </p>

            {this.state.error && (
              <div className="bg-[#F4EFEA] border border-[#E3DBD0] rounded-[4px] p-4 mb-6 font-mono text-xs text-[#C85A32] overflow-x-auto whitespace-pre-wrap">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#07241A] text-[#FAF8F5] rounded-[4px] text-xs font-mono font-medium hover:bg-[#1E3A2F] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-[#E3DBD0] text-[#1F2421] rounded-[4px] text-xs font-mono font-medium hover:bg-[#F4EFEA] transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
