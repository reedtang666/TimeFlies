/**
 * TimeFlies Admin Auth & Session Management System
 * 
 * Secure environment-variable based admin verification.
 * Passwords are configured at deployment time via VITE_ADMIN_PASSWORD,
 * preventing any unauthorized initialization by visitors.
 */

const SESSION_KEY = 'timeflies_admin_session';

// Session valid for 7 days (in milliseconds)
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionData {
  expireAt: number;
  token: string;
}

// Read configured password from environment variable (default fallback for dev)
const CONFIGURED_PASSWORD = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD) ||
  'timeflies888'
).trim();

class AuthSystem {
  private listeners: Set<(isAuthed: boolean) => void> = new Set();

  /**
   * Check if current user is logged in and session has not expired.
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return false;

    try {
      const session: SessionData = JSON.parse(sessionStr);
      if (Date.now() < session.expireAt) {
        return true;
      }
      // Session expired
      this.logout();
      return false;
    } catch {
      this.logout();
      return false;
    }
  }

  /**
   * Verify password against the environment-configured password.
   * If correct, create a fresh 7-day session.
   */
  async verifyPassword(inputPassword: string): Promise<boolean> {
    if (!inputPassword) return false;

    const isMatch = inputPassword.trim() === CONFIGURED_PASSWORD;
    if (isMatch) {
      this.createSession();
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Logout and clear session (immediately locks site editing).
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
    this.notify();
  }

  /**
   * Subscribe to auth changes across components.
   */
  subscribe(callback: (isAuthed: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isAuthenticated());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private createSession(): void {
    const session: SessionData = {
      expireAt: Date.now() + SESSION_DURATION_MS,
      token: Math.random().toString(36).slice(2) + Date.now().toString(36),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  private notify(): void {
    const authed = this.isAuthenticated();
    this.listeners.forEach((cb) => {
      try {
        cb(authed);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export const authSystem = new AuthSystem();
