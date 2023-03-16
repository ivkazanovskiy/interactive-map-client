import { client } from "../api/client";
import { config } from "../config";
import { TUser } from "../types/user.type";

export const baseAuth = {
  async signin(callback: (user: TUser) => void) {
    try {
      const { data } = await client.get<TUser>("/profile");
      // TODO: validate data via zod
      callback(data);
    } catch (err) {
      console.error(err);
      // TODO: handle error
    }
  },
  async signout(callback: VoidFunction) {
    await client
      .get<undefined>("/auth/sign-out", {
        headers: { Authorization: `Bearer ${localStorage.getItem("rt")}` },
      })
      // TODO: handle error
      .catch(console.error);

    delete client.defaults.headers["Authorization"];
    // TODO: validate data via zod
    localStorage.removeItem("at");
    localStorage.removeItem("rt");

    callback();
  },
};
