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
import LoadableDropzone from '../components/LoadableDropzone'
import LoadableLogViewer from '../components/LoadableLogViewer';

export default function Index() {
  const [ logList, setLogList] = useState([])

  function resetApp() {
    setLogList([])
  }

  return (
    <div className="bp3-dark full-height">
      <Navbar className={Classes.DARK} style={{position:'fixed', top:0, bottom:0}}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Log Parser</NavbarHeading>
          <NavbarDivider />
          <LoadableDropzone setZipList={setLogList}></LoadableDropzone>
        </NavbarGroup>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button icon="refresh" className="bp3-minimal" intent="danger" text="Clear" onClick={resetApp}/>
        </Navbar.Group>
      </Navbar>
      <Card className="full-height" style={{paddingBottom: 100, paddingTop: 50}}>
        <LoadableLogViewer logList={logList} setLogList={setLogList}></LoadableLogViewer>
      </Card>
    </div>
  );
}
