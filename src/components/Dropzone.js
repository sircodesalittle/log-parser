import React from 'react'

import { FileInput } from "@blueprintjs/core";
import untar from "js-untar";

const pako = require('pako');
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
	  
  async function getTarFilesContent (data) {
    const zipContent = []
	const promises = []
	for (var obj in data){
		const promise = data[obj].blob.text()
		promises.push(promise)
		zipContent.push({
			file: data[obj].name,
			content: await promise
			})
		console.log(zipContent)
			
		}
	await Promise.all(promises)
	return zipContent
  }  

  const onDrop = (file) => {
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    if (file.name.endsWith('zip')) {
      reader.onload = async () => {
        const binaryStr = reader.result
        console.log(binaryStr)
        var zipContent = await getZipFilesContent(binaryStr)
        setZipList(zipContent)
      }
    } else {
      // old tar.gz logs...
      reader.onload =  () => {
        const binaryStr = reader.result
        // Inflate to a Uint8Array
        let result = pako.ungzip(new Uint8Array(binaryStr));
        untar(result.buffer).then(async (extractedFiles) =>  {
          console.log(extractedFiles)
		  var zipContent = await getTarFilesContent(extractedFiles)
		  setZipList(zipContent)
        })
		
      }
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
