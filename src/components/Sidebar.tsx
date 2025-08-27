import { useState, useMemo } from "react";
import { Search, Plus, Star, Folder, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNotes, Note } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCreateNote: () => void;
  onNoteSelect: (note: Note) => void;
  selectedNoteId?: string;
}

export function Sidebar({ onCreateNote, onNoteSelect, selectedNoteId }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'folders' | 'tags'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const { notes, folders, createNote, toggleFavorite } = useNotes();

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      onNoteSelect(newNote);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const renderNote = (note: Note) => (
    <div 
      key={note.id} 
      className={cn(
        "p-3 rounded-lg cursor-pointer transition-colors group border",
        selectedNoteId === note.id 
          ? "bg-primary/10 border-primary/20" 
          : "hover:bg-accent/50 border-transparent"
      )}
      onClick={() => onNoteSelect(note)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-foreground truncate flex-1">{note.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(note.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded"
        >
          <Star className={`w-4 h-4 ${note.is_favorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
        {note.content.slice(0, 100)}...
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{formatTimeAgo(note.updated_at)}</span>
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Workspace</h2>
          <Button size="sm" className="btn-primary" onClick={handleCreateNote}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search notes..." 
              className="pl-10 input-elegant border-0 bg-muted/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Notes</h3>
              <div className="space-y-2">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map(renderNote)
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}