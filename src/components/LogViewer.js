import React from 'react'
import { LazyLog } from 'react-lazylog';

const LogViewer = ({logList}) => {
    const getText = () => {
        var allText = "Upload a zip file to begin"
        if (logList.length != 0)
            allText = ""
        logList.map((logItem) => {
            allText += logItem.content
        })
        
        return allText
    }
    return (
        <div className="full-height">
            <div style={{ height: '100%', width: '100%' }}>
                <LazyLog extraLines={1} enableSearch text={getText()} caseInsensitive />
            </div>
        </div>
    )
}

export default LogViewer