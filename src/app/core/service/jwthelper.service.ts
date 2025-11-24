import { Injectable } from '@angular/core';

interface JwtPayload {
  sub?: string;        // userId (subject)
  id?: string;         // hoặc id
  exp?: number;        // expiry time (seconds)
  iat?: number;        // issued at time
  email?: string;
  [key: string]: any;  // other claims
}

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {

  /**
   * Decode JWT token để lấy payload
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        console.error('Invalid JWT format');
        return null;
      }
      
      // Decode phần payload (base64url)
      const payload = parts[1];
      const decoded = this.base64UrlDecode(payload);
      
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Kiểm tra token có hết hạn chưa
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    
    if (!payload || !payload.exp) {
      return true; // Không có exp → coi như hết hạn
    }
    
    // exp là timestamp tính bằng giây, Date.now() tính bằng milliseconds
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expiryTime;
  }

  /**
   * Lấy username từ token
   */
  getUsernameFromToken(token: string): string | null {
  const payload = this.decodeToken(token);
  return payload?.sub || null;
}

  /**
   * Lấy email từ token
   */
  getEmailFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.email || null;
  }

  /**
   * Kiểm tra token có hợp lệ không (có format đúng và chưa hết hạn)
   */
  isTokenValid(token: string | null): boolean {
    if (!token) return false;
    
    // Kiểm tra format
    const payload = this.decodeToken(token);
    if (!payload) return false;
    
    // Kiểm tra expiry
    return !this.isTokenExpired(token);
  }

  /**
   * Lấy thời gian còn lại của token (milliseconds)
   */
  getTokenRemainingTime(token: string): number {
    const payload = this.decodeToken(token);
    
    if (!payload || !payload.exp) {
      return 0;
    }
    
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();
    const remaining = expiryTime - currentTime;
    
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Helper: Decode base64url string
   */
  private base64UrlDecode(str: string): string {
    // Base64url → Base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Thêm padding nếu cần
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid base64url string');
      }
      base64 += '='.repeat(4 - pad);
    }
    
    // Decode base64
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
}