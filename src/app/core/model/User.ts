export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;          
  username: string;     
  email: string;        
  password: string;     
  name?: string;        
  role: UserRole;       
  enabled?: boolean; 
  created_at?: string;  
}

export interface UserResponse {
  id: string,
  name: string,
  email: string,
  username: string,
  role: UserRole
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
}