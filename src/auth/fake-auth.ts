export const fakeAuth = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuth.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuth.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};
