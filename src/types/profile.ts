export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  role?: string;
  supportLink?: string;    
}