import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import { Tools } from "./pages/Tools";
import { Skills } from "./pages/Skills";
import { Settings } from "./pages/Settings";
import { HelpPage } from "./pages/HelpPage";
import { Docs } from "./pages/Docs";

export type View = "dashboard" | "chat" | "tools" | "skills" | "settings" | "help" | "docs";

function App() {
  const [view, setView] = useState<View>("dashboard");

  const renderPage = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "chat":
        return <Chat />;
      case "tools":
        return <Tools />;
      case "skills":
        return <Skills />;
      case "settings":
        return <Settings />;
      case "help":
        return <HelpPage />;
      case "docs":
        return <Docs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={view} onNavigate={setView}>
      {renderPage()}
    </Layout>
  );
}

export default App;
