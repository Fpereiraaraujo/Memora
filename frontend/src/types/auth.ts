export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'HOST' | 'ADMIN';
  status?: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  token: string;
  role: 'HOST' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
}
