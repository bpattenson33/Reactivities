import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponet from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} =  useStore();
  
useEffect(() => {
    activityStore.loadingActivities();
  }, [activityStore]) //ensures it only runs one time. 
 

  if (activityStore.loadingInitial) return <LoadingComponet content='Loading the App!' />
  return (
    <> {/*//in place of a div or <Fragment></Fragment>*/} 
      <NavBar />
         <Container style={{marginTop: '7em'}}> 
            <ActivityDashboard />            
        </Container>    
    </>
  );
}

export default observer(App);
