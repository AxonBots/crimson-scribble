import { FileText, FileIcon, Upload, FolderPlus, Sparkles, Clock, Users, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface WelcomeScreenProps {
  onCreateNote: () => void;
}

// Quick actions data
const quickActions = [
  {
    icon: FileText,
    title: "Create New Note",
    description: "Start with a blank note",
    action: "create",
    bgColor: "bg-gradient-to-br from-primary to-primary-dark"
  },
  {
    icon: FileIcon,
    title: "Use Template", 
    description: "Choose from pre-made templates",
    action: "template",
    bgColor: "bg-gradient-to-br from-success to-success/80"
  },
  {
    icon: Upload,
    title: "Import Notes",
    description: "Import from other apps", 
    action: "import",
    bgColor: "bg-gradient-to-br from-warning to-warning/80"
  },
  {
    icon: FolderPlus,
    title: "Create Folder",
    description: "Organize your workspace",
    action: "folder", 
    bgColor: "bg-gradient-to-br from-secondary-dark to-muted-foreground"
  }
];

// Recent templates data
const recentTemplates = [
  {
    name: "Meeting Notes",
    description: "Structured template for meetings",
    category: "Business"
  },
  {
    name: "Project Plan", 
    description: "Comprehensive project planning",
    category: "Planning"
  },
  {
    name: "Daily Journal",
    description: "Personal reflection template", 
    category: "Personal"
  },
  {
    name: "Research Notes",
    description: "Academic research structure",
    category: "Academic"
  }
];

export function WelcomeScreen({ onCreateNote }: WelcomeScreenProps) {
  return (
    <div className="flex-1 bg-gradient-to-br from-background to-accent overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-crimson">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Welcome to <span className="text-primary">MiNote</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional note-taking designed for modern workflows. 
            Create, organize, and collaborate with powerful tools.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button 
              className="btn-primary text-lg px-8 py-3 h-auto animate-scale-in"
              onClick={onCreateNote}
            >
              <FileText className="w-5 h-5 mr-2" />
              Create Your First Note
            </Button>
            <Button variant="outline" className="btn-secondary text-lg px-8 py-3 h-auto">
              Explore Templates
            </Button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Button
                key={action.action}
                variant="outline"
                className="card-elegant h-auto p-6 text-left flex-col items-start space-y-3 hover-lift"
                onClick={action.action === 'create' ? onCreateNote : undefined}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.bgColor}`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Powerful Features</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Rich Text Editing</h3>
                  <p className="text-sm text-muted-foreground">Advanced formatting with tables, lists, code blocks, and media support.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-success/10 text-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Smart Organization</h3>
                  <p className="text-sm text-muted-foreground">Hierarchical folders, tags, and powerful search to keep everything organized.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-warning/10 text-warning rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Real-time sharing and collaboration with team members.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Popular Templates</h2>
            <div className="space-y-4">
              {recentTemplates.map((template, index) => (
                <div
                  key={template.name}
                  className="p-4 border border-border rounded-xl hover:bg-accent cursor-pointer transition-colors hover-lift"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-crimson text-center animate-scale-in">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <div className="text-sm text-muted-foreground">Notes Created</div>
          </div>
          <div className="card-elegant text-center hover-glow">
            <div className="text-3xl font-bold text-foreground mb-2">0</div>
            <div className="text-sm text-muted-foreground">Folders Organized</div>
          </div>
          <div className="card-elegant text-center hover-glow">
            <div className="text-3xl font-bold text-foreground mb-2">0</div>
            <div className="text-sm text-muted-foreground">Collaborations</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span>Ready to transform your note-taking experience?</span>
          </div>
        </div>
      </div>
    </div>
  );
}