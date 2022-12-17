import { atom } from "recoil";

export const usernameAtom = atom({
  key: "usernameAtom",
  default: sessionStorage.getItem("username") || "",
});

export const roomNameAtom = atom({
  key: "roomNameAtom",
  default: "room",
});
