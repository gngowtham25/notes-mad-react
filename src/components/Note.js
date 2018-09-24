import React, { Component } from 'react';
import {DebounceInput} from 'react-debounce-input';


class Note extends Component {
  constructor(props) {
    super(props);
    this.state = { title: this.props.displayNoteData.title, content: this.props.displayNoteData.content, noteData: this.props.displayNoteData }
    
  }

  componentDidMount() {
    this.setState({ title: this.props.displayNoteData.title, content: this.props.displayNoteData.content, noteData: this.props.displayNoteData })
  }

  componentDidUpdate() {
    
  }

  componentWillReceiveProps(newProps) {
    this.setState({title: newProps.displayNoteData.title, content: newProps.displayNoteData.content, noteData: newProps.displayNoteData });
  }

  onFormSubmit() {
    if(this.state.title.length == 0 || this.state.content.length == 0){
      return
    }
    const formData = {
      title: this.state.title,
      content: this.state.content
    };
    this.props.submitNote(formData, this.props.note._id);
  }



  onSubmit(e) {
    e.preventDefault();
    this.onFormSubmit();
  }


  render() {
    const { note, versionId, switchVersion, populateVersions } = this.props;
    // const { noteData } = this.state
    return (
      <div>
        <div className="note-container">
          <h2>Edit This Note</h2>
          <form
            className="note-form"
            onSubmit={(e) => this.onSubmit(e)}
          >
            <div className="note-title">
              <DebounceInput
                className="note-title-input"
                type="text"
                debounceTimeout={300}
                placeholder="Note Title..."
                value={this.state.title}
                onChange={event => {
                  this.setState({title: event.target.value})
                  this.onFormSubmit()
                  }}
              />
            </div>
            <div className="note-textarea-container">
              <DebounceInput
                className="note-textarea"
                element="textarea"
                placeholder="Type Here..."
                debounceTimeout={300}
                value={this.state.content}
                onChange={event => {
                  this.setState({content: event.target.value})
                  this.onFormSubmit()
                  }}
              />
            </div>
            <input className="note-button" type="submit" value="Submit" />
          </form>
        </div>
        <div className="note-container">
          <h2>Version</h2>
          <select value={this.state.noteData._id} className="note-title-input" onChange={(e) => switchVersion(e.target.value, note)}>
            {populateVersions()}
          </select>
        </div>
      </div>
    );
  }
}

export default Note;