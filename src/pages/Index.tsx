import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Editor } from "@/components/Editor";
import { WelcomeScreen } from "@/components/WelcomeScreen";

const Index = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'editor'>('welcome');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        {currentView === 'welcome' ? (
          <WelcomeScreen />
        ) : (
          <Editor />
        )}
      </div>
    </div>
  );
};

export default Index;
