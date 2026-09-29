export interface AccessActivity {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userAvatarBg: string;
  action: string;
  module: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
}
