import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { v4 as uuidv4 } from "uuid";
import { Activities } from "../layout/model/activity";

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
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
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
      //console.log(activities);
      activities.forEach((activity) => {
        this.setActivity(activity);
        console.log(activity);
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
    activity.date = activity.date.split("T")[0];
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
    this.loading = true;
    activity.id = uuidv4();

    try {
      await agent.Activities.create(activity);

      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: Activities) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
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
}
