import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../../app/layout/LoadingComponent";
import { useStore } from "../../../../app/stores/store";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ActivityDetailedHeader from "./activityDetailedHeader";
import ActivityDetailedInfo from "./activityDetailedInfo";
import ActivityDetailedChat from "./activityDetailedChat";
import ActivityDetailedSideBar from "./activityDetailedSideBar";

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const {
    selectedActivity: activity,
    loadActivity,
    loadingInitial,
  } = activityStore;
  const { id } = useParams();

  useEffect(() => {
    if (id) loadActivity(id);
  }, [id, loadActivity]);
  if (loadingInitial || !activity)
    return <LoadingComponent content="Loading activity..." />;
  return (
    // <Card fluid>
    //   <img src={`/assets/categoryImages/${selectedActivity?.category}.jpg`} />
    //   <Card.Content>
    //     <Card.Header>{selectedActivity?.title}</Card.Header>
    //     <Card.Meta>
    //       <span>{selectedActivity?.date}</span>
    //     </Card.Meta>
    //     <Card.Description>{selectedActivity?.description}</Card.Description>
    //   </Card.Content>
    //   <Card.Content extra>
    //     <Button.Group widths="2">
    //       <Button
    //         as={Link}
    //         to={`/manage/${id}`}
    //         basic
    //         color="blue"
    //         content="Edit"
    //       />
    //       <Button
    //         as={Link}
    //         to="/activities"
    //         basic
    //         color="grey"
    //         content="Cancel"
    //       />
    //     </Button.Group>
    //   </Card.Content>
    // </Card>

    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>

      <Grid.Column width={6}>
        <ActivityDetailedSideBar activity={activity} />
      </Grid.Column>
    </Grid>
  );
});
