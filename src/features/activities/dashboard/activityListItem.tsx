import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label } from "semantic-ui-react";
import { Activities } from "../../../app/layout/model/activity";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
interface Props {
  activity: Activities;
}

export default function ActivityListItem({ activity }: Props) {
  const { activityStore } = useStore();
  const [target, setTarget] = useState("");

  const { deleteActivity, loading } = activityStore;
  function handleDelteActivity(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }
  return (
    <Item key={activity.id}>
      <Item.Content>
        <Item.Header as="a">{activity.title}</Item.Header>
        <Item.Meta>{activity.date}</Item.Meta>
        <Item.Description>
          <div>{activity.description}</div>
          <div>
            {activity.city}, {activity.venue}
          </div>
        </Item.Description>

        <Item.Extra>
          <Button
            as={Link}
            to={`/activities/${activity.id}`}
            floated="right"
            content="View"
            color="blue"
          />
          <Button
            name={activity.id}
            loading={loading && target === activity.id}
            onClick={(e) => handleDelteActivity(e, activity.id)}
            floated="right"
            content="Delete"
            color="red"
          />
          <Label content={activity.category} />
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}
