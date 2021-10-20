import React from 'react';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router';
import HomePage from '../../features/activities/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {

  const location = useLocation();
  
  return (
    <> {/*//in place of a div or <Fragment></Fragment>*/} 
     <Route exact path='/'  component={HomePage} />
     <Route 
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{marginTop: '7em'}}> 
                <Route exact path='/'  component={HomePage} />  
                <Route exact path='/activities'  component={ActivityDashboard} /> {/* highlighted in blue because its an observer */}
                <Route path='/activities/:id'  component={ActivityDetails} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />          
            </Container>    
          </>
        )}
     />      
    </>
  );
}

export default observer(App);  //DON'T FORGET TO SET TO OBSERVER FOR THE STATE MANAGEMENT
