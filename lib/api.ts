import { AuthResponse, ApiScanResponse } from "@/types/api";

const API_BASE = '/api';

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(email: string, password: string, full_name: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
  }

  static async scanFile(file: File): Promise<ApiScanResponse> {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Scan failed');
    }

    return response.json();
  }

  static async getScan(scanId: string): Promise<unknown> {
    return this.request(`/scan/${scanId}`, {
      method: 'GET',
    });
  }

  static async getVersion(): Promise<string> {
    const response = await fetch(`${API_BASE}/version`);
    return response.text();
  }
}
