import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { v4 as uuidv4 } from "uuid";
import { Activities } from "../layout/model/activity";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../layout/model/profile";

export default class ActivityStore {
  activityRegistry = new Map<string, Activities>();
  selectedActivity: Activities | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];

        return activities;
      }, {} as { [key: string]: Activities[] })
    );
  }
  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.detail(id);
        this.setActivity(activity);
        runInAction(() => (this.selectedActivity = activity));
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };
  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setActivity = (activity: Activities) => {
    const user = store.userStore.user;

    if (user) {
      activity.isGoing = activity.attendees!.some(
        (x) => x.username === user.userName
      );

      activity.isHost = activity.hostUserName === user.userName;
      activity.host = activity.attendees!.find(
        (x) => x.username === activity.hostUserName
      );
    }

    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };
  setLoadingInitial(state: boolean) {
    this.loadingInitial = state;
  }
  //   selectActivity = (id: string) => {
  //     this.selectedActivity = this.activityRegistry.get(id);
  //   };

  //   cancelSelectedActivity = () => {
  //     this.selectedActivity = undefined;
  //   };

  //   openForm = (id?: string) => {
  //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
  //     this.editMode = true;
  //   };

  //   closeForm = () => {
  //     this.editMode = false;
  //   };

  createActivity = async (activity: Activities) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    this.loading = true;
    activity.id = uuidv4();

    try {
      await agent.Activities.create(activity);
      const newActivity = new Activities(activity);
      newActivity.hostUserName = user!.userName;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: Activities) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          const updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegistry.set(activity.id, updatedActivity);
          this.selectedActivity = updatedActivity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
        this.editMode = false;
      });
    }
  };

  updateAttendeance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.username !== user?.userName
            );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity!.isCancelled;
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };
}
