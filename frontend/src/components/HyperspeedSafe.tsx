import React from 'react';
import Hyperspeed from './Hyperspeed';

interface HyperspeedSafeProps {
  effectOptions: any;
}

interface HyperspeedSafeState {
  hasError: boolean;
}

class HyperspeedErrorBoundary extends React.Component<
  HyperspeedSafeProps,
  HyperspeedSafeState
> {
  constructor(props: HyperspeedSafeProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): HyperspeedSafeState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error) {
    console.error('Hyperspeed disabled:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="hyperspeed-fallback" />;
    }

    return <Hyperspeed effectOptions={this.props.effectOptions} />;
  }
}

export default function HyperspeedSafe(props: HyperspeedSafeProps) {
  return <HyperspeedErrorBoundary {...props} />;
}