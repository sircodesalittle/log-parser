import React from 'react'
import loadable from '@loadable/component'

const Dropzone = loadable(() => import('./Dropzone'))

const LoadableDropzone = ({setZipList}) => {
  return (
    <Dropzone setZipList={setZipList}></Dropzone>
  )
}

export default LoadableDropzone