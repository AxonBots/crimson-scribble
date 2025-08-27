import { useState, useRef, useEffect } from "react";
import { Save, ArrowLeft, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNotes, Note } from "@/hooks/useNotes";
import { useToast } from "@/hooks/use-toast";

interface EditorProps {
  note?: Note | null;
  onBack: () => void;
}

export function Editor({ note, onBack }: EditorProps) {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { createNote, updateNote, toggleFavorite } = useNotes();
  const { toast } = useToast();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsEditing(false);
    } else {
      setTitle("Untitled");
      setContent("");
      setIsEditing(false);
    }
  }, [note]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsEditing(true);
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (note) {
        await updateNote(note.id, { title, content });
      } else {
        await createNote(title, content);
      }
      setIsEditing(false);
      toast({ title: "Note saved", description: "Your changes have been saved successfully." });
    } catch (error) {
      toast({ title: "Save failed", description: "Failed to save your note. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-background overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                <span>{wordCount} words</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {note && (
                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(note.id)}>
                  <Star className={`w-4 h-4 ${note.is_favorite ? 'fill-primary text-primary' : ''}`} />
                </Button>
              )}
              <Button 
                variant={isEditing ? "default" : "outline"} 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : isEditing ? "Save" : "Saved"}
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsEditing(true);
              }}
              className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 bg-transparent"
              placeholder="Untitled Document"
            />
          </div>

          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full min-h-[500px] p-6 border border-border rounded-xl bg-card focus:outline-none focus:border-primary/50 text-foreground resize-none"
            placeholder="Start writing your note..."
          />
        </div>
      </div>
    </div>
  );
}