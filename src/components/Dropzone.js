import React from 'react'

import { FileInput } from "@blueprintjs/core";
var JSZip = require("jszip");

const FileDropzone = ({setZipList}) => {

  async function getZipFilesContent (data) {
    const zipContent = []
    const promises = []
    const zip = (await JSZip.loadAsync(data))
    zip.forEach(async (relativePath, file) => {
      const promise = file.async('string')
      promises.push(promise)
      zipContent.push({
        file: relativePath,
        content: await promise
      })
    })
  
    await Promise.all(promises)
    return zipContent
  }

  const onDrop = (file) => {
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = async () => {
      const binaryStr = reader.result
      var zipContent = await getZipFilesContent(binaryStr)
      setZipList(zipContent)
      console.log(zipContent)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <FileInput text="Choose a file to get started..." onInputChange={(e) => {
          onDrop(e.target.files[0])
          e.target.value = null   // reset the input
        }} />
    </div>
  )
}

export default FileDropzone