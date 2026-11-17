import { useEffect, useMemo, useState } from "react";

type Bot = {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  builtFrom: string;
  workspace: string;
  model: string;
  status?: string;
};

const starterBots: Bot[] = [
  { id: 1, name: "default", description: "Used for all new chats", icon: "◉", color: "violet", builtFrom: "kiro_default", workspace: "~/crew/default", model: "auto", status: "Default" },
  { id: 2, name: "ops", description: "Keeps the nightly issue triage and pipeline sweeps green, and flags anything red.", icon: "◒", color: "teal", builtFrom: "ops", workspace: "~/crew/ops", model: "auto" },
  { id: 3, name: "release", description: "Opens the weekly dependency bump PR and summarizes the risk.", icon: "◐", color: "orange", builtFrom: "kiro_default", workspace: "~/crew/release", model: "auto" },
  { id: 4, name: "design", description: "Generates launch posters in the brand palette for the campaign.", icon: "◓", color: "pink", builtFrom: "kiro_default", workspace: "~/crew/design", model: "auto" },
];

const navItems = [
  { id: "sessions", label: "Sessions", icon: "▱", count: 1 },
  { id: "bots", label: "Bots", icon: "♧" },
  { id: "schedule", label: "Schedule", icon: "▣" },
  { id: "artifacts", label: "Artifacts", icon: "⌘" },
];

const appItems = [
  { id: "worlds", label: "Worlds", icon: "◎" },
  { id: "crew", label: "Crew Manager", icon: "♙" },
  { id: "critique", label: "Design Critique", icon: "◉" },
  { id: "radar", label: "Issue Radar", icon: "◌" },
  { id: "launch", label: "LaunchDarkly", icon: "⊙" },
  { id: "oncall", label: "Oncall Radar", icon: "▱" },
];

export default function App() {
  const [active, setActive] = useState("bots");
  const [bots, setBots] = useState<Bot[]>(() => {
    try {
      const saved = localStorage.getItem("botforge-bots");
      return saved ? JSON.parse(saved) as Bot[] : starterBots;
    } catch {
      return starterBots;
    }
  });
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    localStorage.setItem("botforge-bots", JSON.stringify(bots));
  }, [bots]);

  const filteredBots = useMemo(() => bots.filter((bot) =>
    `${bot.name} ${bot.description}`.toLowerCase().includes(query.toLowerCase()),
  ), [bots, query]);

  function createBot() {
    const name = newName.trim();
    if (!name) return;
    setBots((current) => [...current, {
      id: Date.now(),
      name,
      description: newDescription.trim() || "A new BotForge assistant ready for your workflow.",
      icon: "✦",
      color: "violet",
      builtFrom: "botforge_default",
      workspace: `~/crew/${name.toLowerCase().replace(/\s+/g, "-")}`,
      model: "auto",
    }]);
    setNewName("");
    setNewDescription("");
    setShowModal(false);
  }

  return (
    <div className="app-shell">
      <div className="promo-bar"><span>✣</span> Try Kiro Crew in action</div>
      <div className="workspace">
        <aside className="sidebar">
          <div className="workspace-switcher">
            <button className="scope active"><span>⌂</span> Local</button>
            <button className="scope"><span className="online-dot" /> Remote</button>
            <span className="chevron">⌄</span>
          </div>
          <div className="brand-row"><span className="bot-logo">♟</span><strong>KIRO CREW</strong><span className="collapse">⇥</span></div>
          <nav className="side-nav">
            {navItems.map((item) => <NavItem key={item.id} item={item} active={active} onSelect={setActive} />)}
            <div className="nav-heading">Apps</div>
            {appItems.map((item) => <NavItem key={item.id} item={item} active={active} onSelect={setActive} />)}
          </nav>
          <div className="sidebar-bottom"><span>?</span><span>Help & feedback</span><span className="settings-link" onClick={() => setActive("settings")}>⚙</span></div>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div className="global-search">⌘K <span>Search for anything...</span></div>
            <button className="notification">♧<b>2</b></button>
          </header>
          <section className="page">
            {active === "bots" ? (
              <>
                <div className="page-heading">
                  <div><h1>Bots</h1><p>Separate assistants for separate jobs. Each Bot keeps its own files.</p></div>
                  <button className="new-bot" onClick={() => setShowModal(true)}>＋ New Bot</button>
                </div>
                <div className="bot-toolbar">
                  <label className="filter-input">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter Bots..." /></label>
                  <div className="view-toggle"><button className={view === "cards" ? "selected" : ""} onClick={() => setView("cards")}>▦ <span>Cards</span></button><button className={view === "list" ? "selected" : ""} onClick={() => setView("list")}>☷ <span>List</span></button></div>
                </div>
                <div className={`bot-grid ${view}`}>
                  {filteredBots.map((bot) => <BotCard key={bot.id} bot={bot} list={view === "list"} onDelete={() => setBots((current) => current.filter((item) => item.id !== bot.id))} />)}
                  {!filteredBots.length && <div className="no-results">No bots match “{query}”. <button onClick={() => setShowModal(true)}>Create one</button></div>}
                </div>
              </>
            ) : (
              <PlaceholderPage title={navItems.concat(appItems).find((item) => item.id === active)?.label ?? "Settings"} onCreate={() => setShowModal(true)} />
            )}
          </section>
        </main>
      </div>
      {showModal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowModal(false)}><div className="modal"><div className="modal-head"><div><p className="overline">NEW ASSISTANT</p><h2>Create a Bot</h2></div><button onClick={() => setShowModal(false)}>×</button></div><label>Bot name<input autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="e.g. marketing" onKeyDown={(event) => event.key === "Enter" && createBot()} /></label><label>Description<textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)} placeholder="What should this bot help with?" /></label><div className="modal-actions"><button className="cancel" onClick={() => setShowModal(false)}>Cancel</button><button className="new-bot" onClick={createBot}>Create Bot</button></div></div></div>}
    </div>
  );
}

function NavItem({ item, active, onSelect }: { item: { id: string; label: string; icon: string; count?: number }; active: string; onSelect: (id: string) => void }) {
  return <button className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => onSelect(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{item.count && <span className="nav-count">{item.count}</span>}</button>;
}

function BotCard({ bot, list, onDelete }: { bot: Bot; list: boolean; onDelete: () => void }) {
  return <article className={`bot-card ${list ? "list-card" : ""}`}><div className="bot-card-top"><span className={`bot-avatar ${bot.color}`}>{bot.icon}</span><div className="bot-title"><h3>{bot.name} {bot.status && <em>{bot.status}</em>}</h3><p>{bot.description}</p></div><button className="more" title="Delete bot" onClick={onDelete}>⋮</button></div><div className="card-divider" /><div className="bot-meta"><div><span>♧ <small>BUILT FROM</small></span><strong>{bot.builtFrom}</strong></div><div><span>▱ <small>WORKSPACE</small></span><strong>{bot.workspace}</strong></div><div><span>▤ <small>MEMORY STORE</small></span><strong>Private to this Bot</strong></div><div><span>✣ <small>MODEL</small></span><strong>{bot.model}</strong></div></div></article>;
}

function PlaceholderPage({ title, onCreate }: { title: string; onCreate: () => void }) {
  return <div className="placeholder"><span className="placeholder-icon">✣</span><h1>{title}</h1><p>This workspace is ready for your {title.toLowerCase()}.</p><button className="new-bot" onClick={onCreate}>＋ Create new</button></div>;
}
