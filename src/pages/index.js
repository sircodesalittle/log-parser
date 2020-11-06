import React, { useState } from 'react';
import { Card } from "@blueprintjs/core";
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider
} from "@blueprintjs/core";
import FileDropzone from '../components/Dropzone'
import LoadableLogViewer from '../components/LoadableLogViewer';

export default function Index() {
  const [ logList, setLogList] = useState([])

  function resetApp() {
    setLogList([])
  }

  return (
    <div className="bp3-dark full-height">
      <Navbar className={Classes.DARK}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Log Parser</NavbarHeading>
          <NavbarDivider />
          <FileDropzone setZipList={setLogList}></FileDropzone>
        </NavbarGroup>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button icon="refresh" className="bp3-minimal" intent="danger" text="Clear" onClick={resetApp}/>
        </Navbar.Group>
      </Navbar>
      <Card className="full-height" style={{marginBottom: 10}}>
        <LoadableLogViewer logList={logList}></LoadableLogViewer>
      </Card>
    </div>
  );
}
