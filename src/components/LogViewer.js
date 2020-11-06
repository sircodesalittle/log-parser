import React, { useState } from 'react'
import { LazyLog } from 'react-lazylog';
import {
    Button,
    TagInput
} from "@blueprintjs/core";

const LogViewer = ({logList}) => {

    const [ quickSearchTags, setQuickSearchTags] = useState(() => {
        const savedTags = localStorage.getItem('savedTags')
        if (savedTags)
            return JSON.parse(savedTags)
        return []
    })

    const getText = () => {
        var allText = "Upload a zip file to begin"
        if (logList.length !== 0)
            allText = ""
        logList.forEach((logItem) => {
            allText += logItem.content
        })
        
        return allText
    }

    const handleClear = () => {
        setQuickSearchTags([])
        localStorage.setItem("savedTags", JSON.stringify([]));
    }

    const handleChange = (values) => {
        setQuickSearchTags(values)
        localStorage.setItem("savedTags", JSON.stringify(values));
    }

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
        <div className="full-height" style={{marginBottom: 10}}>
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
                <LazyLog extraLines={1} enableSearch text={getText()} caseInsensitive />
            </div>
        </div>
    )
}

export default LogViewer