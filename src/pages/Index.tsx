import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Editor } from "@/components/Editor";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useAuth } from "@/hooks/useAuth";
import { useNotes, Note } from "@/hooks/useNotes";

const Index = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'editor'>('welcome');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { user, loading } = useAuth();
  const { notes } = useNotes();

  // Redirect to auth if not authenticated
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg mx-auto mb-2 animate-pulse"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleCreateNote = () => {
    setCurrentView('editor');
    setSelectedNote(null);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setCurrentView('editor');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          onCreateNote={handleCreateNote}
          onNoteSelect={handleNoteSelect}
          selectedNoteId={selectedNote?.id}
        />
        {currentView === 'welcome' && notes.length === 0 ? (
          <WelcomeScreen onCreateNote={handleCreateNote} />
        ) : (
          <Editor 
            note={selectedNote}
            onBack={() => setCurrentView('welcome')}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
