import React from 'react'
import "./FileDialog.scss"

type FileDialogProps = {
  file: File | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  control: (file: File | undefined) => JSX.Element;
}

const FileDialog = (props: FileDialogProps): JSX.Element => {
  return (
    <div className="file_dialog">
      <div className="message">
        {props.control(props.file)}
      </div>
      <input type="file" name="file" onChange={props.onChange} />
    </div>
  )
}

export default FileDialog