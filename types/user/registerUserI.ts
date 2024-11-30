export interface registerUserI {
  name: string;
  email: string;
  password: string;
  role?: 'user';
  status?: 'active';
}
