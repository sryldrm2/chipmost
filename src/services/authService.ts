import type { SignInData, SignUpData, ForgotPasswordData, AuthResponse, User } from '../types/auth';

// Mock kullanıcı veritabanı
const MOCK_USERS: Record<string, User> = {
  'demo@chipmost.com': {
    id: 'user-1',
    email: 'demo@chipmost.com',
    firstName: 'Demo',
    lastName: 'Kullanıcı',
    fullName: 'Demo Kullanıcı'
  },
  'test@chipmost.com': {
    id: 'user-2',
    email: 'test@chipmost.com',
    firstName: 'Test',
    lastName: 'Kullanıcı',
    fullName: 'Test Kullanıcı'
  }
};

// Mock token'lar
const MOCK_TOKENS: Record<string, string> = {
  'demo@chipmost.com': 'mock-token-demo-12345',
  'test@chipmost.com': 'mock-token-test-67890'
};

// Mock parolalar (gerçek uygulamada hash'lenmiş olur)
const MOCK_PASSWORDS: Record<string, string> = {
  'demo@chipmost.com': 'demo123',
  'test@chipmost.com': 'test123'
};

class AuthService {
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly COOLDOWN_TIME = 30000; // 30 saniye

  private isInCooldown(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return false;
    
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    return attempts.count >= this.MAX_ATTEMPTS && timeSinceLastAttempt < this.COOLDOWN_TIME;
  }

  private getCooldownRemaining(email: string): number {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return 0;
    
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    return Math.max(0, this.COOLDOWN_TIME - timeSinceLastAttempt);
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    // Cooldown kontrolü
    if (this.isInCooldown(data.email)) {
      const remaining = this.getCooldownRemaining(data.email);
      return {
        success: false,
        error: `Çok fazla başarısız deneme. Lütfen ${Math.ceil(remaining / 1000)} saniye bekleyin.`
      };
    }

    // Kullanıcı kontrolü
    const user = MOCK_USERS[data.email];
    if (!user) {
      this.recordLoginAttempt(data.email);
      return {
        success: false,
        error: 'E-posta veya parola hatalı.'
      };
    }

    // Parola kontrolü
    if (MOCK_PASSWORDS[data.email] !== data.password) {
      this.recordLoginAttempt(data.email);
      return {
        success: false,
        error: 'E-posta veya parola hatalı.'
      };
    }

    // Başarılı giriş - deneme sayısını sıfırla
    this.loginAttempts.delete(data.email);
    
    return {
      success: true,
      user,
      token: MOCK_TOKENS[data.email],
      message: 'Giriş başarılı!'
    };
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    // E-posta zaten kayıtlı mı?
    if (MOCK_USERS[data.email]) {
      return {
        success: false,
        error: 'Bu e-posta adresi zaten kayıtlı.'
      };
    }

    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`
    };

    // Mock veritabanına ekle
    MOCK_USERS[data.email] = newUser;
    MOCK_PASSWORDS[data.email] = data.password;
    MOCK_TOKENS[data.email] = `mock-token-new-${Date.now()}`;

    return {
      success: true,
      user: newUser,
      token: MOCK_TOKENS[data.email],
      message: 'Hesap başarıyla oluşturuldu!'
    };
  }

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    // E-posta kayıtlı mı?
    if (!MOCK_USERS[data.email]) {
      return {
        success: false,
        error: 'Bu e-posta adresi sistemde kayıtlı değil.'
      };
    }

    // Mock e-posta gönderimi simülasyonu
    return {
      success: true,
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
    };
  }

  async validateToken(token: string): Promise<AuthResponse> {
    // Token'dan kullanıcıyı bul
    const email = Object.keys(MOCK_TOKENS).find(key => MOCK_TOKENS[key] === token);
    
    if (!email) {
      return {
        success: false,
        error: 'Geçersiz token.'
      };
    }

    const user = MOCK_USERS[email];
    return {
      success: true,
      user,
      token
    };
  }

  private recordLoginAttempt(email: string): void {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);
  }

  // Test için kullanıcı listesi
  getMockUsers(): User[] {
    return Object.values(MOCK_USERS);
  }
}

export const authService = new AuthService();

