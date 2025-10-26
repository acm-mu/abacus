import Editor from "@monaco-editor/react";
import { useRef, useContext, useState} from "react" 
import type { editor } from 'monaco-editor';
import DropDownMenu from '../../components/DropDownMenu';
import DropDownItem from '../../components/DropDownItem';
import './IDE.scss'
import { TEMPLATE_CODE } from './IDEStarterCode'

const IDE = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState(TEMPLATE_CODE['python']);
  const [language, setLanguage] = useState('python');
  
  const onMount = (editor: editor.IStandaloneCodeEditor) => { 
    editorRef.current = editor; 
    editor.focus(); 
  }

  const languageOptions = ["python", "java"];
  const selectLanguage = (language: string) => { 
    setLanguage(language); 
    setValue(TEMPLATE_CODE[language]);
  }
  
  return (
    <>
      <div className="IDEExecutables">
          <DropDownMenu
              buttonText={`Language: ${language}`}   
              content={ <>
                { 
                  languageOptions.map(item => <DropDownItem key={item} onClick={() => selectLanguage(item)}>
                    {item}
                  </DropDownItem>)
                }
              </>}
            />
            <div className="executeCode"> 
              <button className="executeCode-btn" onClick={() => console.log("button clicked")}> 
                Execute Code
              </button>
            </div>
      </div>
      <div className="IDEMain">
        <div className="IDEContainer">
          <Editor
            theme="vs-dark"
            language={language}
            onMount={onMount}
            defaultValue="//Write Code here"
            value={value}
            onChange={(value) => setValue(value || "")}
          />
        </div>
        <div className="IDEResults"> 
            <
        </div> 
      </div>
    </>
  );
};

export default IDE;