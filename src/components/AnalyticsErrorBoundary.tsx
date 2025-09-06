'use client'

import React from 'react'

interface AnalyticsErrorBoundaryProps {
  children: React.ReactNode
}

interface AnalyticsErrorBoundaryState {
  hasError: boolean
}

export default class AnalyticsErrorBoundary extends React.Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): AnalyticsErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development, but don't break the app
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics component error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Analytics failed to load, render nothing
      return null
    }

    return this.props.children
  }
}