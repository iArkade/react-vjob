import type { UserProfile } from '@/types/user';

export interface UserContextValue {
  user: UserProfile | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}
