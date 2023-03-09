import axios from "axios";
import { config } from "../config";
import { TUser } from "../types/user.type";

export const baseAuth = {
  isAuthenticated: false,
  async signin(callback: (user: TUser) => void) {
    try {
      const { data } = await axios.get<TUser>(config.backendUrl + "/profile");
      // TODO: validate data via zod
      baseAuth.isAuthenticated = true;
      callback(data);
    } catch (err) {
      console.error(err);
      // TODO: handle error
    }
  },
  signout(callback: VoidFunction) {
    // TODO: handle sign-out
    baseAuth.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};
