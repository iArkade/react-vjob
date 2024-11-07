import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../state/slices/authSlice";
import { useLoginUser } from "../../api/user-request";
import { User } from "../../types/user";

export interface SignInWithPasswordParams {
     email: string;
     password: string;
}

class AuthClient {
     // async signUp(_: SignUpParams): Promise<{ error?: string }> {
     //      // Make API request

     //      // We do not handle the API, so we'll just generate a token and store it in localStorage.
     //      const token = generateToken();
     //      localStorage.setItem('custom-auth-token', token);

     //      return {};
     // }
     dispatch = useDispatch();
     loginUser = useLoginUser();

     async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
          const { email, password } = params;

          const response = await this.loginUser.mutateAsync({ email, password });
          const token = response.data.tokens;

          console.log('Login successful:', response.data);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(response.data));
          const isAuthenticated = true;

          this.dispatch(setAuthenticated({ isAuthenticated }));

          return {};
     }

     // async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
     //      return { error: 'Password reset not implemented' };
     // }

     // async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
     //      return { error: 'Update reset not implemented' };
     // }

     async getUser(): Promise<{ data?: User | null; error?: string }> {
          // Make API request

          // We do not handle the API, so just check if we have a token in localStorage.
          const token = localStorage.getItem('token');
          let savedUser = null;
          if (!token) {
               return { data: null };
          }

          return { data: savedUser };
     }

     async signOut(): Promise<{ error?: string }> {
          localStorage.removeItem('token');
          return {};
     }
}

export const authClient = new AuthClient();