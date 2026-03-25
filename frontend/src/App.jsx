import React from "react";
import AppRoutes from "./routes/AppRoutes";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, fontFamily: "sans-serif" }}>
          <h2 style={{ color: "red" }}>Erreur de rendu</h2>
          <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>
            {this.state.error?.message}
          </pre>
          <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;