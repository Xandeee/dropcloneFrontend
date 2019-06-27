import React, { Component } from 'react';
import api from '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import { MdInsertDriveFile } from 'react-icons/md';

import logo from '../../assets/droplogo.svg';
import './styles.css';

class Box extends Component {
  state = { box: {} }

  async componentDidMount() {
    this.subscribeToNewFiles();
    const box = this.props.match.params.id;
    const response = await api.get(`boxes/${box}`)

    this.setState({ box: response.data });

  };

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://dropclone2-backend.herokuapp.com');

    io.emit('connectRoom', box);

    io.on('file', data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      })
    })
  }

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;

    const { files } = this.state.box;

    return (
      <div id="box-container">
        <header>
          <img src={logo} alt=""/>
            <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <h4>Arraste arquivos ou clique aqui</h4>
            </div>
          )}
        </Dropzone>

        <ul>
          {files && files.map(file => (
            <li key={file._id}>
              <a className="fileInfo" href={file.url} target="_blank">
                <MdInsertDriveFile size={24} color="A5cfff" />
                <strong>{file.title}</strong>
              </a>
                <span>há {distanceInWords(file.createdAt, new Date(), {
                  locale: pt
                  })}
                </span>
            </li>
          ))}
        </ul>
      </div>

    );
  }
}

export default Box;