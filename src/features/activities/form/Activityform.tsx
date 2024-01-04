import { ChangeEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams } from "react-router-dom";
import { Activities } from "../../../app/layout/model/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/form/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();

  const {
    selectedActivity,
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] = useState<Activities | undefined>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: null,
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required!"),
    description: Yup.string().required("The activity description is required!"),
    city: Yup.string().required(),
    category: Yup.string().required(),
    venue: Yup.string().required(),
    date: Yup.string().required("Date is required!"),
  });
  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity));
  }, [id, loadActivity]);

  function handleFormSubmit(activity: Activities) {
    if (!activity!.id) {
      activity!.id = uuidv4();
      createActivity(activity!).then(() =>
        navigate(`/activities/${activity!.id}`)
      );
    } else {
      updateActivity(activity!).then(() =>
        navigate(`/activities/${activity!.id}`)
      );
    }
  }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;
  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity!}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isSubmitting, isValid, dirty }) => (
          <Form className="" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />

            <MyTextArea placeholder="Description" name="description" rows={3} />
            <MySelectInput
              placeholder="Category"
              name="category"
              options={categoryOptions}
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to={"/activities"}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
