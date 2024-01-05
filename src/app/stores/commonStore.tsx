import { makeAutoObservable } from "mobx";
import { ServerError } from "../layout/model/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = null;
  isAppLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | null) => {
    if (token) localStorage.setItem("jwt", token);
    this.token;
  };
  setApploaded = () => {
    this.isAppLoaded = true;
  };
}
