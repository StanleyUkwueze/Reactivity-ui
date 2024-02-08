// import { useEffect, useState } from 'react';
// import { Button, Grid, Header } from "semantic-ui-react";
// import { observer } from "mobx-react-lite";
// import PhotoUploadWidgetDropzone from '../../app/common/imageUpload/PhotoWidgetDropzone';
// import PhotoWidgetCropper from '../../app/common/imageUpload/PhotoWidgetCropper';

// interface Props {
//     loading: boolean;
//     uploadPhoto: (file: Blob) => void;
// }

// export default observer(function PhotoUploadWidget({ loading, uploadPhoto }: Props) {
//     const [files, setFiles] = useState<any>([]);
//     const [cropper, setCropper] = useState<Cropper>();

//     function onCrop() {
//         if (cropper) {
//             cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!))
//         }
//     }

//     useEffect(() => {
//         return () => {
//             files.forEach((file: any) => URL.revokeObjectURL(file.preview))
//         }
//     }, [files]);

//     return (
//         <>
//             <Grid>
//                 <Grid.Row />
//                 <Grid.Column width={4}>
//                     <Header color='teal' sub content='Step 1 - Add Photo' />
//                     <PhotoUploadWidgetDropzone setFiles={setFiles} />
//                 </Grid.Column>
//                 <Grid.Column width={1} />
//                 <Grid.Column width={4}>
//                     <Header sub color='teal' content='Step 2 - Resize image' />
//                     {files && files.length > 0 &&
//                         <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
//                     }

//                 </Grid.Column>
//                 <Grid.Column width={1} />
//                 <Grid.Column width={4}>
//                     <Header sub color='teal' content='Step 3 - Preview & Upload' />
//                     <div className="img-preview" style={{ minHeight: 200, overflow: 'hidden' }} />
//                     {files && files.length > 0 && (
//                         <>
//                             <Button.Group widths={2}>
//                                 <Button loading={loading} onClick={onCrop} positive icon='check' />
//                                 <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
//                             </Button.Group>
//                         </>
//                     )}
//                 </Grid.Column>
//             </Grid>
//         </>
//     )
// })

import { useState } from 'react';
import { useStore } from "../../app/stores/store";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import ProfileEditForm from "./ProfileEditForm";
import { observer } from 'mobx-react-lite';

export default observer(function ProfileAbout() {
    const { profileStore } = useStore();
    const { isCurrentUser, profile } = profileStore;
    const [editMode, setEditMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width='16'>
                    <Header
                        floated='left'
                        icon='user'
                        content={`About ${profile?.displayName}`} />
                        {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)}
                        />)}
                </Grid.Column>
                <Grid.Column width='16'>
                    {editMode ? <ProfileEditForm setEditMode={setEditMode} /> :
                        <span style={{ whiteSpace: 'pre-wrap' }}>{profile?.bio}</span>}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})