/**
 * Basic Monitoring & Error Tracking
 * 
 * Tracks:
 * - JavaScript errors
 * - Performance metrics
 * - Resource loading errors
 * - User interactions (optional)
 */

interface ErrorInfo {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class BasicMonitor {
  private errors: ErrorInfo[] = [];
  private metrics: PerformanceMetric[] = [];
  private maxErrors = 10; // Keep last 10 errors
  private maxMetrics = 20; // Keep last 20 metrics

  constructor() {
    this.init();
  }

  private init() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Track resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && (event.target as HTMLElement).tagName) {
        const target = event.target as HTMLElement;
        if (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK') {
          this.trackError({
            message: `Resource loading error: ${target.tagName} ${(target as HTMLImageElement).src || (target as HTMLLinkElement).href}`,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
        }
      }
    }, true);

    // Track performance metrics on page load
    if (document.readyState === 'complete') {
      this.trackPerformance();
    } else {
      window.addEventListener('load', () => {
        this.trackPerformance();
      });
    }
  }

  private trackError(error: ErrorInfo) {
    this.errors.push(error);
    
    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('🚨 Error tracked:', error);
    }

    // In production, you could send to an error tracking service
    // Example: sendToErrorService(error);
  }

  private trackPerformance() {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics: PerformanceMetric[] = [
        {
          name: 'domContentLoaded',
          value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          timestamp: Date.now(),
        },
        {
          name: 'loadComplete',
          value: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: Date.now(),
        },
        {
          name: 'firstByte',
          value: navigation.responseStart - navigation.fetchStart,
          timestamp: Date.now(),
        },
      ];

      metrics.forEach(metric => {
        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
          this.metrics.shift();
        }
      });

      if (import.meta.env.DEV) {
        console.log('📊 Performance metrics:', metrics);
      }
    }
  }

  // Public API
  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public clearErrors() {
    this.errors = [];
  }

  public clearMetrics() {
    this.metrics = [];
  }

  // Health check
  public healthCheck(): { status: 'healthy' | 'degraded'; errors: number; metrics: number } {
    const recentErrors = this.errors.filter(
      e => Date.now() - e.timestamp < 60000 // Last minute
    );

    return {
      status: recentErrors.length > 5 ? 'degraded' : 'healthy',
      errors: this.errors.length,
      metrics: this.metrics.length,
    };
  }
}

// Initialize monitoring
let monitor: BasicMonitor | null = null;

if (typeof window !== 'undefined') {
  monitor = new BasicMonitor();

  // Expose to window for debugging (dev only)
  if (import.meta.env.DEV) {
    (window as any).__monitor = monitor;
  }
}

export default monitor;
