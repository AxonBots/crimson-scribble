import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  tags: string[];
}

export interface Folder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching folders",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createNote = async (title?: string, content?: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title: title || 'Untitled',
          content: content || '',
        }])
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [data, ...prev]);
      toast({
        title: "Note created",
        description: "Your new note has been created.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => prev.map(note => note.id === id ? data : note));
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating note",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    await updateNote(id, { is_favorite: !note.is_favorite });
  };

  const createFolder = async (name: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert([{
          user_id: user.id,
          name,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setFolders(prev => [...prev, data]);
      toast({
        title: "Folder created",
        description: `Folder "${name}" has been created.`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating folder",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchFolders();
    } else {
      setNotes([]);
      setFolders([]);
      setLoading(false);
    }
  }, [user]);

  return {
    notes,
    folders,
    loading,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    createFolder,
    refetch: () => {
      fetchNotes();
      fetchFolders();
    }
  };
}