export interface IUser {
  _id: string;
  name: string;
  email: string;
  token?: string;
}
 
export interface ISignupData {
  name: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}