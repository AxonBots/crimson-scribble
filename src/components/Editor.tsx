import { useState, useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link,
  Image,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Save,
  MoreHorizontal,
  Type,
  Palette
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function Editor() {
  const [title, setTitle] = useState("Untitled Note");
  const [content, setContent] = useState("<p>Start writing your note here...</p>");
  const [isEditing, setIsEditing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate auto-save
    const interval = setInterval(() => {
      setLastSaved(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate word count
    const text = editorRef.current?.textContent || "";
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { icon: Undo, command: 'undo', tooltip: 'Undo' },
    { icon: Redo, command: 'redo', tooltip: 'Redo' },
    { type: 'separator' },
    { icon: Bold, command: 'bold', tooltip: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', tooltip: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', tooltip: 'Underline (Ctrl+U)' },
    { type: 'separator' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Align Right' },
    { type: 'separator' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', tooltip: 'Quote' },
    { type: 'separator' },
    { icon: Code, command: 'formatBlock', value: 'pre', tooltip: 'Code Block' },
    { icon: Link, command: 'createLink', tooltip: 'Insert Link' },
    { icon: Image, command: 'insertImage', tooltip: 'Insert Image' },
    { icon: Table, tooltip: 'Insert Table' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            {toolbarButtons.map((button, index) => {
              if (button.type === 'separator') {
                return <Separator key={index} orientation="vertical" className="h-6" />;
              }

              const Icon = button.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-accent"
                  onClick={() => {
                    if (button.command === 'createLink') {
                      const url = prompt('Enter URL:');
                      if (url) formatText(button.command, url);
                    } else if (button.command === 'insertImage') {
                      const url = prompt('Enter image URL:');
                      if (url) formatText(button.command, url);
                    } else if (button.value) {
                      formatText(button.command, button.value);
                    } else {
                      formatText(button.command);
                    }
                  }}
                  title={button.tooltip}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{wordCount} words</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
            
            <Button variant="ghost" size="sm" className="btn-ghost">
              <Type className="w-4 h-4 mr-1" />
              Style
            </Button>

            <Button variant="ghost" size="sm" className="btn-ghost">
              <Palette className="w-4 h-4 mr-1" />
              Theme
            </Button>

            <Button size="sm" className="btn-primary">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>

            <Button variant="ghost" size="sm" className="btn-ghost">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-4xl font-bold text-foreground bg-transparent border-none outline-none w-full placeholder:text-muted-foreground"
            placeholder="Untitled"
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          />
          <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
            <span>Created: Nov 15, 2024</span>
            <span>•</span>
            <span>Last modified: {lastSaved.toLocaleDateString()}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Auto-saving</span>
            </span>
          </div>
        </div>

        {/* Content Editor */}
        <div className="prose prose-lg max-w-none">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[500px] outline-none text-foreground leading-relaxed"
            style={{ 
              fontSize: '16px',
              lineHeight: '1.7',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            onInput={handleContentChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            dangerouslySetInnerHTML={{ __html: content }}
            suppressContentEditableWarning={true}
          />
        </div>

        {/* Editor Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Reading time: ~{Math.ceil(wordCount / 200)} min</span>
              <span>•</span>
              <span>Characters: {content.replace(/<[^>]*>/g, '').length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Press</span>
              <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">Ctrl+S</kbd>
              <span>to save</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}