import React from 'react';
import {Card, CardTitle, CardText, Textfield, CardActions, Button, Icon} from 'react-mdl';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import Draggable from 'react-draggable';

// stateless :D
const Note = ({ x, y, id, handleStop, text, actionClick, deleteClick }) => (
             <Draggable
                 key={id}
                 handle=".draggablePart"
                 defaultPosition={{x: x, y: y}}
                 zIndex={id}
                 onStop={handleStop}>
                <Card className="note" data-id={id} shadow={0}>
                    
                    <CardTitle 
                        className="draggablePart"
                        expand>
                    </CardTitle>
                    
                    <CardText>
                        <Textfield
                            style={{display: 'none'}}
                            className="textfield"
                            label="Write your note..."
                            onChange={() => {}} />
                        <div 
                            style={{marginLeft: '8px'}}
                            className="cardText">
                            {text}
                        </div>
                    </CardText>
                    
                    <CardActions
                        data-id={id}
                        border 
                        style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff'}}>
                        <Button 
                            onClick={actionClick}
                            colored 
                            style={{color: '#000'}}>
                            Edit Note
                        </Button>
                        <div className="mdl-layout-spacer"></div>
                        <Icon onClick={deleteClick} name="delete" style={{color: '#000'}} />
                    </CardActions>
                    
                </Card>
            </Draggable>
)

module.exports = Note;