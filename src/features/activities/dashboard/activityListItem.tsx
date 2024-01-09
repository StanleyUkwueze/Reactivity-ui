import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activities } from "../../../app/layout/model/activity";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";
interface Props {
  activity: Activities;
}

export default function ActivityListItem({ activity }: Props) {
  return (
    // <Item key={activity.id}>
    //   <Item.Content>
    //     <Item.Header as="a">{activity.title}</Item.Header>
    //     <Item.Meta>{activity.date}</Item.Meta>
    //     <Item.Description>
    //       <div>{activity.description}</div>
    //       <div>
    //         {activity.city}, {activity.venue}
    //       </div>
    //     </Item.Description>

    //     <Item.Extra>
    //       <Button
    //         as={Link}
    //         to={`/activities/${activity.id}`}
    //         floated="right"
    //         content="View"
    //         color="blue"
    //       />
    //       <Button
    //         name={activity.id}
    //         loading={loading && target === activity.id}
    //         onClick={(e) => handleDelteActivity(e, activity.id)}
    //         floated="right"
    //         content="Delete"
    //         color="red"
    //       />
    //       <Label content={activity.category} />
    //     </Item.Extra>
    //   </Item.Content>
    // </Item>

    <Segment.Group>
      <Segment>
        {activity.isCancelled && (
          <Label
            attached="top"
            color="red"
            content="Cancelled"
            style={{ textAlign: "center" }}
          />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              style={{ marginBottom: 3 }}
              size="tiny"
              circular
              src="/assets/user.png"
            />

            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted By {activity.hostUserName}
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    You are hosting this activity!
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && (
                <Item.Description>
                  <Label basic color="green">
                    {activity.isCancelled
                      ? "This event is cancelled, you can no longer attend."
                      : " You are going to this activity!"}
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>

      <Segment>
        <span>
          <Icon name="clock" />
          {format(activity.date!, "dd MMM yyy h:mm aa")}
          <Icon name="marker" />
          {activity.venue}
        </span>
      </Segment>

      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{activity.description} </span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          color="teal"
          floated="right"
          content="View"
        />
      </Segment>
    </Segment.Group>
  );
}
