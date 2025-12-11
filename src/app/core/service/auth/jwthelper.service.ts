import { Injectable } from '@angular/core';

interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class JwtHelperService {
  // Decode JWT
  decodeToken(token: string): JwtPayload | null {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');

      if (parts.length !== 3) {
        console.error('Invalid JWT format');
        return null;
      }

      // Decode payload (base64url)
      const payload = parts[1];
      const decoded = this.base64UrlDecode(payload);

      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);

    if (!payload || !payload.exp) {
      return true;
    }

    // Compare expiry time with current time
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expiryTime;
  }

  // Get username from token
  getUsernameFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.sub || null;
  }

  // Check if token is valid
  isTokenValid(token: string | null): boolean {
    if (!token) return false;

    // Check format
    const payload = this.decodeToken(token);
    if (!payload) return false;

    // Check expiry
    return !this.isTokenExpired(token);
  }

  // Get remaining time before token expiry in milliseconds
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

  // Helper method to decode base64url
  private base64UrlDecode(str: string): string {
    // Base64url → Base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

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
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  }
}
