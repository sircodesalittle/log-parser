import React, { useState, useEffect, useCallback } from 'react'
import { LazyLog } from 'react-lazylog';
import {
    Button,
    ButtonGroup,
    TagInput,
    Tree,
    Icon
} from "@blueprintjs/core";

const LogViewer = ({logList, setLogList}) => {

    const [ quickSearchTags, setQuickSearchTags] = useState(() => {
        const savedTags = localStorage.getItem('savedTags')
        if (savedTags)
            return JSON.parse(savedTags)
        return []
    })

    const [ hiddenFileExt, sethiddenFileExt] = useState(() => {
        const hiddenFiles = localStorage.getItem('hiddenFileExt')
        if (hiddenFiles)
            return JSON.parse(hiddenFiles)
        return ['pcap']
    })

    const [ hiddenLogNames, setHiddenLogNames ] = useState([])

    const setNodeData = (nodeData) => {
        var allNodes = zipNode.nodes
        const targetNodeIndex = zipNode.nodes.forEach((item, index) => { if (item.id === nodeData.id) return index})
        allNodes[targetNodeIndex] = nodeData
        setZipNode({nodes: allNodes})
    }

    const handleNodeClick = (nodeData, _nodePath, e) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            forEachNode(zipNode.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;

        setNodeData(nodeData)
    };

    const handleNodeCollapse = (nodeData) => {
        nodeData.isExpanded = false;
        setNodeData(nodeData)
    };

    const handleNodeExpand = (nodeData) => {
        nodeData.isExpanded = true;
        setNodeData(nodeData)
    };

    const forEachNode = (nodes, callback) => {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            forEachNode(node.childNodes, callback);
        }
    }

    const [ zipNode, setZipNode ] = useState({nodes: []})
    const [logText, setLogText] = useState("Upload a zip file to begin")

    const handleHideShowClick = useCallback((logItem) => {
        var fileIndex = hiddenLogNames.indexOf(logItem.file)
        if ( fileIndex === -1) {
            setHiddenLogNames([...hiddenLogNames, logItem.file])
        } else {
            var hiddenList = hiddenLogNames.filter((logName) => logName !== logItem.file)
            if (hiddenList.length === logList.length)
                setLogText('All files are hidden')
            setHiddenLogNames(hiddenList)
        }
    }, [hiddenLogNames, logList.length])

    const hideAllFiles = () => {
        var hidden = []
        logList.forEach((logItem) => {
            hidden.push(logItem.file)
        })
        setHiddenLogNames(hidden)
        setLogText('All files are hidden')
    }

    const showAllFiles = () => {
        setHiddenLogNames([])
    }

    useEffect(() => {
        var sideBarNodes = []
        var folders = []
        var folderNodes = []

        logList.forEach((logItem, index) => {
            var extension = logItem.file.split('.')[1]
            if (hiddenFileExt.indexOf(extension) === -1) {
                var pathSplit = logItem.file.split('/')
                var hasFolder = false
                var label = ''
                var opts = {}
                if (hiddenLogNames.indexOf(logItem.file) === -1)
                    opts['icon'] = 'eye-open'
                else
                    opts['icon'] = 'eye-off'
                if (pathSplit.length > 1) {
                    if (folders.indexOf(pathSplit[0]) === -1) {
                        // No folder, so make one
                        var folderNodesLength = sideBarNodes.push(
                            {
                                id: index * 10,
                                hasCaret: true,
                                label: pathSplit[0],
                                icon: "folder-open",
                                isExpanded: true,
                                childNodes: [
                                    {
                                        id: index,
                                        label: pathSplit[1],
                                        icon: 'document',
                                        secondaryLabel: (
                                            <Icon {...opts} onClick={() => { 
                                                handleHideShowClick(logItem)
                                            }} />
                                        ),
                                    }
                                ]
                            }
                        )
                        folders.push(pathSplit[0])
                        folderNodes.push(sideBarNodes[folderNodesLength - 1])

                    } else {
                        // Already have a folder, so find it and add the node
                        var folderNode = folderNodes[folders.indexOf(pathSplit[0])]
                        folderNode.childNodes.push(
                            {
                                id: index,
                                label: pathSplit[1],
                                icon: 'document',
                                secondaryLabel: (
                                    <Icon {...opts} onClick={() => { 
                                        handleHideShowClick(logItem)
                                    }} />
                                ),
                            }
                        )
                    }
                    
                } else {
                    // Leaf node
                    label = pathSplit[0]
                    var sideNode = {
                        id: index,
                        hasCaret: hasFolder,
                        label: label,
                        icon: 'document',
                        secondaryLabel: (
                            <Icon {...opts} onClick={() => { 
                                handleHideShowClick(logItem)
                            }} />
                        ),
                    }
                    sideBarNodes.push(sideNode)
                }
            }
        })
        setZipNode({nodes: sideBarNodes})
    }, [logList, hiddenLogNames, handleHideShowClick, hiddenFileExt])

    useEffect(() => {
        var allText = logText
        if (logList.length !== 0)
            allText = ""
        logList.forEach((logItem) => {
            var extension = logItem.file.split('.')[1]
            if (hiddenFileExt.indexOf(extension) === -1 && hiddenLogNames.indexOf(logItem.file) === -1)
                allText += logItem.content
        })

        setLogText(allText)
    }, [hiddenLogNames, logList, logText, hiddenFileExt])

    const handleClear = () => {
        setQuickSearchTags([])
        localStorage.setItem("savedTags", JSON.stringify([]));
    }

    const handleChange = (values) => {
        setQuickSearchTags(values)
        localStorage.setItem("savedTags", JSON.stringify(values));
    }

    const handleClearExt = () => {
        sethiddenFileExt([])
        localStorage.setItem("hiddenFileExt", JSON.stringify([]));
    }

    const handleChangeExt = (values) => {
        let newValues = values.map((item) => {
            return item.replace('.', '').toLowerCase()
        })
        sethiddenFileExt(newValues)
        localStorage.setItem("hiddenFileExt", JSON.stringify(values));
    }

    const extClearButton = (
        <Button
            icon={"cross"}
            minimal={true}
            onClick={handleClearExt}
        />
    );

    const clearButton = (
        <Button
            icon={"cross"}
            minimal={true}
            onClick={handleClear}
        />
    );

    const setSearch = (searchText) => {
        var input = document.getElementsByName('search')[0]
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, searchText);

        var ev2 = new Event('input', { bubbles: true});
        input.dispatchEvent(ev2);
        var toggleButton = document.getElementsByClassName('react-lazylog-searchbar-filter')[0]
        toggleButton.dispatchEvent(new Event('click', { bubbles: true}))
    }

    const getTagProps = (_v, index) => ({
        onClick: () => {
            setSearch(quickSearchTags[index])
        },
        interactive: true
    });

    return (
        <div className="full-height page-wrapper">
            <div className='row full-height'>
                <div className='column full-height' style={{overflow: 'auto'}}>
                    <ButtonGroup>
                        <Button icon="eye-open" onClick={showAllFiles}>Show All</Button>
                        <Button icon="eye-off" onClick={hideAllFiles}>Hide all</Button>
                    </ButtonGroup>
                    <p className={'bp3-text-small'} style={{marginTop: 15}}>File extensions to ignore</p>
                    <TagInput
                        onChange={handleChangeExt}
                        placeholder="Add file extensions to ignore..."
                        rightElement={extClearButton}
                        values={hiddenFileExt}
                    />
                    <Tree
                        contents={zipNode.nodes}
                        onNodeClick={handleNodeClick}
                        onNodeCollapse={handleNodeCollapse}
                        onNodeExpand={handleNodeExpand}
                    >
                    </Tree>
                </div>

                <div className='double-column full-height' style={{ marginLeft: 10 }}>
                    <div className="full-height" style={{marginBottom: 10 }}>
                        <p>Add tag and click it to quick filter</p>
                        <TagInput
                            style={{ maxWidth: 300}}
                            onChange={handleChange}
                            placeholder="Add quick search tags..."
                            rightElement={clearButton}
                            tagProps={getTagProps}
                            values={quickSearchTags}
                        />
                        
                        <div style={{ marginTop: 10, height: '100%', width: '100%' }}>
                            <LazyLog 
                                extraLines={1} 
                                enableSearch 
                                text={logText} 
                                caseInsensitive 
                                selectableLines={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogViewer