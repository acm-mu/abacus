import React, { ChangeEvent } from 'react'
import './FileDialog.scss'

type FileDialogProps = {
  file: File | undefined
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  control: (file: File | undefined) => JSX.Element
}

const FileDialog = (props: FileDialogProps): JSX.Element => {
  return (
    <div id="file_dialog">
      <div className="message">{props.control(props.file)}</div>
      <input id="sub_files_input" type="file" name="source" onChange={props.onChange} />
    </div>
  )
}

export default FileDialog
