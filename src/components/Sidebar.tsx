import { useState } from "react";
import { 
  FileText, 
  Folder, 
  Plus, 
  Star, 
  Clock, 
  Tag,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Search
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Note {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

interface Folder {
  id: string;
  name: string;
  isExpanded: boolean;
  notes: Note[];
  subfolders: Folder[];
}

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<'notes' | 'folders' | 'tags'>('notes');
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: '1',
      name: 'Work Projects',
      isExpanded: true,
      notes: [
        {
          id: '1',
          title: 'Project Proposal',
          preview: 'Initial ideas for the new product launch...',
          updatedAt: '2 hours ago',
          isFavorite: true,
          tags: ['work', 'important']
        },
        {
          id: '2',
          title: 'Meeting Notes',
          preview: 'Weekly standup discussion points...',
          updatedAt: '4 hours ago',
          isFavorite: false,
          tags: ['meetings', 'work']
        }
      ],
      subfolders: []
    },
    {
      id: '2',
      name: 'Personal',
      isExpanded: false,
      notes: [
        {
          id: '3',
          title: 'Reading List',
          preview: 'Books to read this month...',
          updatedAt: '1 day ago',
          isFavorite: true,
          tags: ['personal', 'books']
        }
      ],
      subfolders: []
    }
  ]);

  const [recentNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Proposal',
      preview: 'Initial ideas for the new product launch...',
      updatedAt: '2 hours ago',
      isFavorite: true,
      tags: ['work', 'important']
    },
    {
      id: '2',
      title: 'Meeting Notes',
      preview: 'Weekly standup discussion points...',
      updatedAt: '4 hours ago',
      isFavorite: false,
      tags: ['meetings', 'work']
    },
    {
      id: '3',
      title: 'Reading List',
      preview: 'Books to read this month...',
      updatedAt: '1 day ago',
      isFavorite: true,
      tags: ['personal', 'books']
    }
  ]);

  const toggleFolder = (folderId: string) => {
    setFolders(prev => prev.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ));
  };

  const renderNote = (note: Note) => (
    <div key={note.id} className="p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors animate-fade-in group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium text-sm text-foreground truncate">{note.title}</span>
            {note.isFavorite && <Star className="w-3 h-3 text-warning fill-current" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.preview}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{note.updatedAt}</span>
            <div className="flex space-x-1">
              {note.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  const renderFolder = (folder: Folder) => (
    <div key={folder.id} className="animate-slide-up">
      <div 
        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors group"
        onClick={() => toggleFolder(folder.id)}
      >
        <div className="flex items-center space-x-2">
          {folder.isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <Folder className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{folder.name}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
      {folder.isExpanded && (
        <div className="ml-6 mt-2 space-y-1">
          {folder.notes.map(renderNote)}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Workspace</h2>
          <Button className="btn-primary h-8 px-3">
            <Plus className="w-4 h-4 mr-1" />
            New Note
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search workspace..." 
            className="pl-10 input-elegant h-9 text-sm"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border">
        {(['notes', 'folders', 'tags'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary bg-accent/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'notes' && (
          <div className="p-4">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Recent</span>
              </div>
              <div className="space-y-2">
                {recentNotes.map(renderNote)}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-foreground">Favorites</span>
              </div>
              <div className="space-y-2">
                {recentNotes.filter(note => note.isFavorite).map(renderNote)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'folders' && (
          <div className="p-4 space-y-2">
            {folders.map(renderFolder)}
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="p-4">
            <div className="space-y-2">
              {['work', 'personal', 'important', 'meetings', 'books'].map(tag => (
                <div key={tag} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{tag}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {Math.floor(Math.random() * 10) + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}