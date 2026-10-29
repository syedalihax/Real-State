import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App Error Boundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="section container">
          <div className="form-card" style={{ maxWidth: 520, margin: "48px auto" }}>
            <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
            <p style={{ marginBottom: 18 }}>The page hit an unexpected error. Please refresh and try again.</p>
            <button className="btn block" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
