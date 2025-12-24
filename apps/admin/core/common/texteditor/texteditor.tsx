import React from 'react'
import DefaultEditor from "react-simple-wysiwyg";
const TextEditor = () => {
    const [values, setValue] = React.useState();
  
    function onChange(e:any) {
      setValue(e.target.value);
    }
  return (
    <div>
       <DefaultEditor value={values} onChange={onChange} />
    </div>
  )
}

export interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const TextEditorNew: React.FC<TextEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <textarea
      className="w-full min-h-[120px] rounded border p-2 focus:ring-2 focus:ring-blue-500"
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter product description"
    />
  );
};


export default TextEditorNew;
// export default TextEditor;
