//import Monster from './monster';
import ReactDOM from 'react-dom';
import React from 'react';
import {Card, CardTitle, CardText, CardActions, Button, FABButton, 
        CardMenu, IconButton, Grid, Cell, Icon, Textfield} from 'react-mdl';
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

class Board extends React.Component {
    
    constructor() {
        super();
        this.addNote = this.addNote.bind(this, '');
        this.handleStop = this.handleStop.bind(this);
        this.actionClick = this.actionClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        // create our array either from local storage or initilize it
        var array = ('notes' in localStorage) ? JSON.parse(localStorage.notes) : [];
        this.state = {
            notes: array,
            nextId: (array.length !== 0) ? array[array.length - 1].id + 1 : 0
        }
    }
    
    // triggers on a notes action button (save note or edit note)
    actionClick(e) {
        const { notes } = this.state;
        var parent = e.target.parentElement.parentElement;
        var id = parseInt(parent.dataset.id);
        var tf = parent.getElementsByClassName('textfield')[0];
        var text = parent.getElementsByClassName('cardText')[0];
        var icon = parent.children[2].children[2]
        var button = parent.children[2].children[0];
        
        // configure for editing
        if (tf.style.display === 'none') {
            tf.style.display = 'flex';
            icon.innerHTML = 'save';
            button.innerHTML = 'Save Note';
            tf.MaterialTextfield.change(text.innerHTML);
            text.innerHTML = "";
            icon.style.display = 'none';
        }
        // configure for saving
        else {
            icon.innerHTML = 'delete';
            button.innerHTML = 'Edit Note';
            text.innerHTML = tf.MaterialTextfield.input_.value;
            tf.MaterialTextfield.change('');
            tf.style.display = 'none';
            
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].id === id) {
                    notes[i].text = text.innerHTML;
                    break;
                }
            }
            icon.style.display = 'flex';
            this.updateNotes(notes);
        }
    }
    
    updateNotes(notes) {
        this.setState({notes: notes});
        localStorage['notes'] = JSON.stringify(notes);
    }
    
    deleteClick(e) {
        const { notes } = this.state;
        var parent = e.target.parentElement.parentElement;
        var id = parseInt(parent.dataset.id);
        console.log("ID: " + id);
        var newNotes = [];
        console.log("old notes:");
        console.log(notes);
        for (var i = 0; i < notes.length; i++) {
            if (notes[i].id !== id) {
                newNotes.push(notes[i]);
            }
        }
        console.log("new notes:");
        console.log(newNotes);
        this.updateNotes(newNotes);
    }
    
    // triggers when a drags stop in order to update the data's position values
    // to the state and to local storage
    handleStop(e) {
        // don't register stop drag on button clicks
        if (!e.target.classList.contains('mdl-button')) {
            const { notes } = this.state;
            const id = parseInt(e.target.parentElement.dataset.id);
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].id === id) {
                    const rect = e.target.parentElement.getBoundingClientRect();
                    notes[i].x = rect.left;
                    notes[i].y = rect.top;
                    this.updateNotes(notes);
                    // exit early if can
                    break;
                }
            }
        }
    }
    
    render() {
        const { notes } = this.state;
        return (
            <div>
                
                <div id="addButton">
                    <FABButton 
                        style={{backgroundColor: "#598C4A"}}
                        onClick={this.addNote}
                        colored 
                        ripple>
                        <Icon name="add" />
                    </FABButton>
                </div>

                <div id="note-list">
                    {notes.map( (note, i) => <Note 
                                                 deleteClick={this.deleteClick}
                                                 actionClick={this.actionClick}
                                                 handleStop={this.handleStop} 
                                                 key={i} {...note} />)}
                </div>
                
            </div>
        )
    }
    
    // - 50 to make sure sticky note is in frame of the window
    getRandomX() {
        return Math.ceil(Math.random(0,1) * (window.innerWidth - 150));
    }
    getRandomY() {
        return Math.ceil(Math.random(0,1) * (window.innerHeight - 150));
    }
    
    addNote(text) {
        //get data
        var { notes, nextId } = this.state;
        //update notes   
        notes.push({id: nextId, text: text, 
                    x: this.getRandomX(), y: this.getRandomY()});
        // update state and local storage
        this.setState({notes: notes, nextId: nextId + 1});
        localStorage['notes'] = JSON.stringify(notes);
    }
};

ReactDOM.render(<Board />, document.getElementById('content'));