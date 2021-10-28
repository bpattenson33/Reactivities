import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound() {
    return (
        <Segment texAlign='center'>
            <Header icon >
                <Icon name='search' />
                Ooops - can't find the dang page!
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' primary>
                    Return to activities page
                </Button>            
            </Segment.Inline>        
        </Segment>
    )}