export interface User{

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