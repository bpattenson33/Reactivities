import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponet from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

export default observer (function ActivityDashboard() {
    const {activityStore} = useStore();  
    const {loadingActivities, activityRegistry} = activityStore; 
  
    useEffect(() => {   
        if(activityRegistry.size <= 1) loadingActivities();
    }, [activityRegistry.size, loadingActivities]) //ensures it only runs one time.  

     if (activityStore.loadingInitial) return <LoadingComponet content='Loading the App!' />
    return (
        <><Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>    
        </Grid>                
        </>
    )
})