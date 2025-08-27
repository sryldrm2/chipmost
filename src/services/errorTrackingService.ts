// Hata İzleme Servisi (Sentry Mock)
// Gerçek uygulamada Sentry, Crashlytics gibi servisler kullanılır

export interface ErrorLog {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  userId?: string;
  screen?: string;
  action?: string;
  metadata?: Record<string, any>;
}

class ErrorTrackingService {
  private errorLogs: ErrorLog[] = [];
  private isInitialized = false;

  // Servisi başlat
  init() {
    if (this.isInitialized) return;
    
    // Global hata yakalayıcı
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError(event.error || new Error(event.message), {
          screen: 'unknown',
          action: 'window_error',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      });

      // Promise rejection yakalayıcı
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(new Error(event.reason), {
          screen: 'unknown',
          action: 'unhandled_promise_rejection',
          metadata: {
            reason: event.reason
          }
        });
      });
    }

    this.isInitialized = true;
    console.log('🔍 Hata izleme servisi başlatıldı');
  }

  // Hatayı yakala ve kaydet
  captureError(error: Error, context?: {
    screen?: string;
    action?: string;
    userId?: string;
    metadata?: Record<string, any>;
  }) {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      userId: context?.userId,
      screen: context?.screen,
      action: context?.action,
      metadata: context?.metadata
    };

    // Konsola yazdır
    console.error('🚨 Hata yakalandı:', {
      message: errorLog.message,
      screen: errorLog.screen,
      action: errorLog.action,
      timestamp: errorLog.timestamp
    });

    // Lokal olarak sakla
    this.errorLogs.push(errorLog);
    this.saveToLocalStorage();

    // Gerçek uygulamada burada Sentry API'sine gönderilir
    // this.sendToSentry(errorLog);
  }

  // Manuel hata oluştur (test için)
  captureMessage(message: string, context?: {
    screen?: string;
    action?: string;
    userId?: string;
    metadata?: Record<string, any>;
  }) {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message,
      userId: context?.userId,
      screen: context?.screen,
      action: context?.action,
      metadata: context?.metadata
    };

    console.log('📝 Manuel hata mesajı:', errorLog);
    this.errorLogs.push(errorLog);
    this.saveToLocalStorage();
  }

  // Hata loglarını getir
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  // Hata loglarını temizle
  clearErrorLogs() {
    this.errorLogs = [];
    this.saveToLocalStorage();
  }

  // Hata istatistikleri
  getErrorStats() {
    const total = this.errorLogs.length;
    const today = new Date().toDateString();
    const todayCount = this.errorLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    ).length;

    return {
      total,
      today: todayCount,
      byScreen: this.groupByScreen(),
      byAction: this.groupByAction()
    };
  }

  // Ekrana göre grupla
  private groupByScreen() {
    const groups: Record<string, number> = {};
    this.errorLogs.forEach(log => {
      const screen = log.screen || 'unknown';
      groups[screen] = (groups[screen] || 0) + 1;
    });
    return groups;
  }

  // Aksiyona göre grupla
  private groupByAction() {
    const groups: Record<string, number> = {};
    this.errorLogs.forEach(log => {
      const action = log.action || 'unknown';
      groups[action] = (groups[action] || 0) + 1;
    });
    return groups;
  }

  // Hata ID'si oluştur
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Local storage'a kaydet
  private saveToLocalStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('chipmost_error_logs', JSON.stringify(this.errorLogs));
      }
    } catch (error) {
      console.warn('Hata logları kaydedilemedi:', error);
    }
  }

  // Local storage'dan yükle
  loadFromLocalStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('chipmost_error_logs');
        if (saved) {
          this.errorLogs = JSON.parse(saved);
          console.log(`📚 ${this.errorLogs.length} hata logu yüklendi`);
        }
      }
    } catch (error) {
      console.warn('Hata logları yüklenemedi:', error);
    }
  }

  // Test hatası oluştur
  simulateError(screen: string, action: string) {
    const testError = new Error(`Simüle hata: ${action} işlemi sırasında`);
    this.captureError(testError, {
      screen,
      action,
      metadata: {
        isSimulated: true,
        testTime: new Date().toISOString()
      }
    });
  }
}

// Singleton instance
export const errorTrackingService = new ErrorTrackingService();

// Servisi otomatik başlat
errorTrackingService.init();
errorTrackingService.loadFromLocalStorage();

// Export default
export default errorTrackingService;

