import { Injectable } from "@angular/core";
import { User } from "./models/user.model";

@Injectable({
  providedIn: 'root'
})
export abstract class AuthenticationService {
  public abstract signIn(email: string, password: string): Promise<User>;
  public abstract signOut(): Promise<void>;
  public abstract getCurrentUser(): User | null;
}
