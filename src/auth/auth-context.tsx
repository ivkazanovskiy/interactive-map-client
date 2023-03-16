import React from "react";
import { TCredentials } from "../types/credentials.type";
import { TUser } from "../types/user.type";
import { baseAuth } from "./base-auth";

interface AuthContextType {
  user: TUser | null;
  signin: (callback: VoidFunction) => Promise<void> | void;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let [user, setUser] = React.useState<TUser | null>(null);

  let signin = (callback: VoidFunction) => {
    if (!localStorage.getItem("at")) return;

    return baseAuth.signin((user: TUser) => {
      setUser(user);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return baseAuth.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => React.useContext<AuthContextType>(AuthContext);
