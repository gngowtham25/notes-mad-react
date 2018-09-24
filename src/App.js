import React, { Component } from 'react';
import './App.css';
import Nav from './components/Nav';
import List from './components/List';
import Note from './components/Note';
import axios from 'axios';
import urlFor from './helpers/urlFor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      showNote: false,
      notes: [],
      note: {},
      newTag: false,
      error: '',
      versionId: '',
      displayNoteData : {}
    };
  }

  notifyError = (errData) => {
    toast(errData);
  }

  notifySuccess = () => {
    toast("Saved", { autoClose: 1000 })
  }

  toggleNote = () => {
    let displayNoteData = {title : '', content : ''}
    this.setState({
      showNote: ! this.state.showNote,
      note: {},
      displayNoteData: displayNoteData
    })
  }

  getNotes = () => {
    axios.get(urlFor('notes/'))
    .then((res) => this.setState({notes: res.data}) )
    .catch((err) => console.log(err.response.data.message) );
  }

  getNote = (id) => {
    axios.get(urlFor(`notes/${id}/`))
    .then((res) => {
      let versionId = res.data.versions[res.data.versions.length-1]._id
      this.switchVersion(versionId, res.data)
     })
    .catch((err) => console.log(err.response.data.message) );
  }

  switchVersion = (versionId, note) => {
    let newNoteData = note.versions.filter((eachVersion) => {
      if(eachVersion._id === versionId){
        return eachVersion
      }
    })[0];
    this.setState({versionId:versionId, displayNoteData:newNoteData, showNote: true, note:note})
  }

  populateVersions = () => {
    var optionArr = [];
    if(this.state.note.versions){
      for (let i = 0; i < this.state.note.versions.length; i++) {
        optionArr.push(<option key={i} value={this.state.note.versions[i]._id}>Version {this.state.note.versions[i].versionNumber}</option>)
      }
    }
    return optionArr;
  }

  performSubmissionRequest = (data, id) => {
    if (id) {
      return axios.put(urlFor(`notes/${id}/`), data);
    } else {
      return axios.post(urlFor('notes/'), data);
    }
  }

  submitNote = (data, id) => {
    this.performSubmissionRequest(data, id)
    .then((res) => {
      this.notifySuccess()
      let versionId = res.data.versions[res.data.versions.length-1]._id
      this.switchVersion(versionId, res.data)
    })
    .catch((err) => {
      let errors = err.response.data;
      if (errors.message) {
        this.notifyError(errors.message)
        this.setState({ error: errors.message });
      } else {
        this.notifyError("Missing Data")
        this.setState({ error: "Missing Data" });
      }
    });
  }

  deleteNote = (id) => {
    const newNotesState = this.state.notes.filter((note) => note._id !== id );
    axios.delete(urlFor(`notes/${id}/`) )
    .then((res) => this.setState({ notes: newNotesState }) )
    .catch((err) => console.log(err.response.data.message) );
  }
  
  resetError = () => {
    this.setState({ error: '' });
  }

  render() {
    const { showNote, notes, note, versionId, displayNoteData } = this.state;

    return (
      <div className="App">
        <ToastContainer />
        <Nav toggleNote={this.toggleNote} showNote={showNote} />
        <br />
        { showNote ?
            <Note
              note={note}
              submitNote={this.submitNote}
              versionId={versionId}
              switchVersion={this.switchVersion}
              populateVersions={this.populateVersions}
              displayNoteData={displayNoteData}
            />
            :
            <List 
              getNotes={this.getNotes}
              notes={notes}
              getNote={this.getNote}
              deleteNote={this.deleteNote}
            /> }
      </div>
    );
  }
}

export default App;
