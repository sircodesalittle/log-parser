import React from 'react'
import loadable from '@loadable/component'

const LogViewer = loadable(() => import('./LogViewer'))

const LoadableLogViewer = ({logList}) => {
  return (
    <div className="full-height">
      <LogViewer logList={logList}></LogViewer>
    </div>
  )
}

export default LoadableLogViewer