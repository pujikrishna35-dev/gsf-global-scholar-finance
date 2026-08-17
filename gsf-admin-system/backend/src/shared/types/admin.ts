export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'LoanManager' | 'Counselor';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}
