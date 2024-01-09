import { User } from "./user";

export interface IProfile {
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
}

// export class Profile implements Profile {
//     constructor(user: User) {
//         this.username = user.username;
//         this.displayName = user.displayName;
//         this.image = user.image
//     }
// }

// export interface Photo {
//     id: string;
//     url: string;
//     isMain: boolean;
// }

// export interface UserActivity {
//     id: string;
//     title: string;
//     category: string;
//     date: Date;
// }s

export class Profile implements IProfile {
  constructor(user: User) {
    this.username = user.userName;
    this.displayName = user.displayName;
    this.image = user.image;
  }
  username: string;
  displayName: string;
  image?: string;
  bio?: string;
}

export interface Activities {
  id: string;
  titles: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUSerName: string;
  isCancelled?: boolean;
  isGoing?: boolean;
  isHost?: boolean;
  host?: Profile;
  attendees?: Profile[];
}
