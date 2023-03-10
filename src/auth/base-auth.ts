import axios from "axios";
import { config } from "../config";
import { TUser } from "../types/user.type";

export const baseAuth = {
  async signin(callback: (user: TUser) => void) {
    try {
      const { data, config: c1 } = await axios.get<TUser>(
        config.backendUrl + "/profile",
      );
      // TODO: validate data via zod
      callback(data);
    } catch (err) {
      console.error(err);
      // TODO: handle error
    }
  },
  async signout(callback: VoidFunction) {
    await axios
      .get<undefined>(config.backendUrl + "/auth/sign-out", {
        headers: { Authorization: `Bearer ${localStorage.getItem("rt")}` },
      })
      // TODO: handle error
      .catch(console.error);

    delete axios.defaults.headers["Authorization"];
    // TODO: validate data via zod
    localStorage.removeItem("at");
    localStorage.removeItem("rt");
    callback();
  },
};
