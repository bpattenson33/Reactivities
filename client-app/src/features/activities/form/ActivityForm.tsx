import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivytForm() {
    const {activityStore} = useStore();   

    const {selectedActivity, closeForm, createActivity, updateActivity, loading} = activityStore;
    
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        activity.id ? updateActivity(activity) : createActivity(activity);       
    }

    // passing in the type from onChange click event from the form element.  Need this otherwise form field is read only
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
            const{name, value} = event.target;
            setActivity({...activity, [name]: value})
    }
    
    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} required />
                <Form.TextArea placeholder='Desciption' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input placeholder='Date' type='date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City'value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/> 
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='submit' content='Cancel' />
            </Form>
        </Segment>
        )   
    
})