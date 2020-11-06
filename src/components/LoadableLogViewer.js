import React from 'react'
import loadable from '@loadable/component'

const LogViewer = loadable(() => import('./LogViewer'))

const LoadableLogViewer = ({logList, setLogList}) => {
  return (
    <div className="full-height">
      <LogViewer logList={logList} setLogList={setLogList}></LogViewer>
    </div>
  )
}

export default LoadableLogViewer