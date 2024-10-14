import { ChangeEvent } from "react"

type FileDialogProps = {
  file: File | undefined,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  control: (file: File | undefined) => React.JSX.Element,
}

export default function FileDialog(props: FileDialogProps) {
  return (
    <div className='file_dialog'>
      <div className='message'>{props.control(props.file)}</div>
      <input id='sub_files_input' type='file' name='source' onChange={props.onChange} />
    </div>
  )
}