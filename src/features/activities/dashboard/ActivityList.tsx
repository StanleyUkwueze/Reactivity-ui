import { Header, Item, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./activityListItem";
import { Fragment } from "react";

import { Link } from "react-router-dom";

export default observer(function ActivityList() {
  const { activityStore } = useStore();
  const { groupedActivities } = activityStore;
  return (
    <>
      {groupedActivities.map(([group, activities]) => {
        return (
          <Fragment key={group}>
            <Header sub color="teal">
              {group}
            </Header>

            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Fragment>
        );
      })}
    </>
  );
});
