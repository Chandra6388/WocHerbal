import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from './button';
import { Code, Eye } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  height = 200
}) => {
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align',
    'link'
  ];

  const handleQuillChange = (content: string) => {
    setHtmlContent(content);
    onChange(content);
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setHtmlContent(content);
    onChange(content);
  };

  const toggleView = () => {
    setIsHtmlView(!isHtmlView);
  };

  return (
    <div className="border border-input rounded-md overflow-hidden">
      <div className="flex items-center justify-between p-2 bg-muted/30 border-b">
        <span className="text-sm font-medium text-muted-foreground">
          {isHtmlView ? 'HTML Source' : 'Visual Editor'}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleView}
          className="h-7 px-2"
        >
          {isHtmlView ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Visual
            </>
          ) : (
            <>
              <Code className="h-3 w-3 mr-1" />
              HTML
            </>
          )}
        </Button>
      </div>
      
      {isHtmlView ? (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          placeholder={placeholder}
          className="w-full p-3 border-0 resize-none focus:outline-none focus:ring-0 font-mono text-sm"
          style={{ height: `${height}px` }}
        />
      ) : (
        <div style={{ height: `${height}px` }}>
          <ReactQuill
            theme="snow"
            value={htmlContent}
            onChange={handleQuillChange}
            placeholder={placeholder}
            modules={modules}
            formats={formats}
            style={{ 
              height: `${height - 42}px`,
              border: 'none'
            }}
            className="border-0"
          />
        </div>
      )}
    </div>
  );
};

export { RichTextEditor as JoditEditor };