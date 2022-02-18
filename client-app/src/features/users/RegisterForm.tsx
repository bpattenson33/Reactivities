import { ErrorMessage, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, {} from 'react';
import { Button, Form, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';


export default observer(function RegisterForm() {
    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{displayName: '', username: '', email: '', password: '', error: null}}
             onSubmit={(values, {setErrors}) => userStore.register(values)            
             .catch(error => 
                setErrors({error: error})               
                )}
            validationSchema={Yup.object({
                displayName: Yup.string().required('Required'),
                username: Yup.string().required('Required'),
                email: Yup.string().required('Required'),
                password: Yup.string().required('Required')
            })}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) =>(
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign Upr' color='teal' />
                    <ErrorMessage
                        name='error' render={() => <Label style={{marginBottom:10}} basic color='red' content={errors.error} />} 
                    /> 
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextInput name='username' placeholder='Username' />                 
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />                
                    <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} 
                    positive content='Register' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})