import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../layout/model/serverError";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem("jwt");
  isAppLoaded = false;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("jwt", token);
        } else {
          localStorage.removeItem("jwt");
        }
      }
    );
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
