export type TSession = {
  id: number;
  name: string;
  userList: { id: number; isAccepted: boolean }[];
};
