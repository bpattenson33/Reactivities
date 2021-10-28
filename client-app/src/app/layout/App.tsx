import React from 'react';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router';
import HomePage from '../../features/activities/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/error/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/error/NotFound';
import ServerError from '../../features/error/ServerError';

function App() {

  const location = useLocation();
  
  return (
    <> {/*//in place of a div or <Fragment></Fragment>*/} 
    <ToastContainer position='bottom-right' hideProgressBar />
     <Route exact path='/'  component={HomePage} />
     <Route 
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{marginTop: '7em'}}> 
            <Switch>
                <Route exact path='/'  component={HomePage} />  
                <Route exact path='/activities'  component={ActivityDashboard} /> {/* highlighted in blue because its an observer */}
                <Route path='/activities/:id'  component={ActivityDetails} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} /> 
                <Route path='/errors' component={TestErrors} /> 
                <Route path='/server-error' component={ServerError} /> 
                <Route component={NotFound} />      
              </Switch>               
            </Container>    
          </>
        )}
     />      
    </>
  );
}

export default observer(App);  //DON'T FORGET TO SET TO OBSERVER FOR THE STATE MANAGEMENT
