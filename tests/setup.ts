import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// ---------------------------------------------------------------------------
// i18n mock — tests are written with English strings, but t() returns Turkish.
// This mock maps every i18n key used in tests to its English equivalent.
// ---------------------------------------------------------------------------
const en: Record<string, string> = {
  // Status
  "status.idle": "Idle",
  "status.running": "Running",
  "status.error": "Error",
  "status.disconnected": "Disconnected",
  "status.connected": "Connected",
  // Header
  "header.connecting": "Connecting",
  "header.title": "3DAgent",
  "header.connected": "Connected",
  "header.gatewayConnection": "Gateway connection",
  "header.openMenu": "Open menu",
  // Fleet Sidebar
  "fleet.agents": "Agents ({count})",
  "fleet.newAgent": "New agent",
  "fleet.creating": "Creating...",
  "fleet.filterAll": "All",
  "fleet.filterRunning": "Running",
  "fleet.filterApprovals": "Approvals",
  "fleet.noAgents": "No agents available.",
  "fleet.selectAgent": "Select agent {name}",
  "fleet.needsApproval": "Needs approval",
  // Chat Panel
  "chat.you": "You",
  "chat.thinking": "Thinking (internal)",
  "chat.showingRecent": "Showing most recent {count} messages",
  "chat.limit": "(limit {limit})",
  "chat.loadMore": "Load more",
  "chat.jumpToLatest": "Jump to latest",
  "chat.tryDescribing": "Describe a task, bug, or question to get started.",
  "chat.typeMessage": "type a message",
  "chat.send": "Send",
  "chat.stop": "Stop",
  "chat.stopping": "Stopping",
  "chat.queued": "Queued",
  "chat.removeQueued": "Remove queued message {index}",
  "chat.chooseModel": "Choose model",
  "chat.noModels": "No models found",
  "chat.selectReasoning": "Select reasoning level",
  "chat.default": "Default",
  "chat.off": "Off",
  "chat.minimal": "Minimal",
  "chat.low": "Low",
  "chat.medium": "Medium",
  "chat.high": "High",
  "chat.xhigh": "Very High",
  "chat.show": "Show",
  "chat.tools": "Tools",
  "chat.newSession": "New session",
  "chat.startingSession": "Starting...",
  "chat.customizeAvatar": "Customize avatar",
  "chat.renameAgent": "Rename agent",
  "chat.editAgentName": "Edit agent name",
  "chat.saveAgentName": "Save agent name",
  "chat.cancelRename": "Cancel rename",
  "chat.nameRequired": "Agent name is required.",
  "chat.renameFailed": "Failed to rename agent.",
  "chat.openBehavior": "Open behavior",
  "chat.voiceStop": "Stop",
  "chat.voiceTranscribing": "...",
  "chat.voiceMicRequesting": "Mic...",
  "chat.voiceMic": "Mic",
  "chat.voiceRecording": "Recording. Tap stop to send.",
  "chat.voiceTranscribingStatus": "Your voice note is being transcribed.",
  "chat.voiceMicRequesting2": "Requesting mic access.",
  "chat.voiceNotSupported": "This browser does not support mic recording.",
  "chat.stopVoice": "Stop voice recording",
  "chat.startVoice": "Start voice recording",
  "chat.introMsg1": "How can I help you today?",
  "chat.introMsg2": "What do we need to accomplish today?",
  "chat.introMsg3": "Ready. What would you like to work on?",
  "chat.introMsg4": "What are we working on today?",
  "chat.introMsg5": "I'm here and ready. What's the plan?",
  "chat.introFallback": "How can I help you today?",
  "chat.introExpertise": "Expertise areas",
  "chat.unknown": "Unknown",
  "chat.execApprovalRequired": "Exec approval required",
  "chat.hostLabel": "Host: {host}",
  "chat.expiresLabel": "Expires: {time}",
  "chat.cwdLabel": "CWD: {cwd}",
  "chat.allowOnce": "Allow once",
  "chat.alwaysAllow": "Always allow",
  "chat.deny": "Deny",
  "chat.allowOnceAria": "Allow once for exec approval {id}",
  "chat.alwaysAllowAria": "Always allow for exec approval {id}",
  "chat.denyAria": "Deny exec approval {id}",
  "chat.thinkingLabel": "Thinking",
  "chat.showToolCalls": "Show tool calls",
  "chat.showThinking": "Show thinking",
  "chat.queuedMessages": "Queued messages",
  "chat.modelAria": "Model",
  "chat.thinkingAria": "Thinking",
  "chat.startNewSession": "Start new session",
  "chat.stopUnavailable": "Stop unavailable: {reason}",
  // Connection Panel
  "connPanel.disconnect": "Disconnect",
  "connPanel.connect": "Connect",
  "connPanel.close": "Close",
  "connPanel.closeGatewayAriaLabel": "Close gateway connection panel",
  // Agent Create Modal
  "create.newAgent": "New agent",
  "create.launchAgent": "Launch agent",
  "create.nameAndActivate": "Name and activate right away.",
  "create.name": "Agent name",
  "create.agentNamePlaceholder": "Agent name",
  "create.renameHint": "You can rename this agent from the main chat header.",
  "create.chooseAvatar": "Choose avatar",
  "create.shuffle": "Shuffle",
  "create.authorityHint": "Authority can be configured after launching.",
  "create.launching": "Launching...",
  "create.close": "Close",
  "create.createAgentAriaLabel": "Create agent",
  "create.shuffleAvatarAriaLabel": "Shuffle avatar selection",
  // Agent Identity
  "agentIdentity.name": "Name",
  "agentIdentity.namePlaceholder": "e.g. Alex",
  "agentIdentity.role": "Role",
  "agentIdentity.rolePlaceholder": "e.g. Product Designer",
  "agentIdentity.vibe": "Vibe",
  "agentIdentity.vibePlaceholder": "e.g. Calm, sharp, and helpful",
  "agentIdentity.emoji": "Emoji",
  "agentIdentity.emojiPlaceholder": "e.g. ✨",
  // Agent Editor Modal
  "agentEditor.closeAriaLabel": "Close agent editor",
  "agentEditor.sidebarTitle": "Agent editor",
  "agentEditor.sidebarHint": "Edit the avatar and agent brain settings from the office.",
  "agentEditor.previous": "Previous",
  "agentEditor.next": "Next",
  "agentEditor.identity": "Identity",
  "agentEditor.avatar": "Avatar",
  "agentEditor.avatarHint": "Office appearance.",
  "agentEditor.soul": "Soul",
  "agentEditor.agents": "Agents",
  "agentEditor.user": "User",
  "agentEditor.tools": "Tools",
  "agentEditor.memory": "Memory",
  "agentEditor.heartbeat": "Heartbeat",
  "agentEditor.deleteAgent": "Delete Agent",
  "agentEditor.deleteHint": "Remove this agent from 3DAgent and OpenClaw.",
  "agentEditor.fileEditorTitle": "Agent file editor",
  "agentEditor.fileEditorHint": "Edit one agent file at a time and save it via the gateway.",
  "agentEditor.connectHint": "Connect to a gateway to edit brain files.",
  // Avatar Editor
  "avatarEditor.reset": "Reset",
  "avatarEditor.randomize": "Randomize",
  "avatarEditor.avatarCreator": "Avatar creator",
  "avatarEditor.personalizeHint": "Personalize this office avatar on this machine.",
  "avatarEditor.skinTone": "Skin tone",
  "avatarEditor.hairStyle": "Hair style",
  "avatarEditor.hairColor": "Hair color",
  "avatarEditor.topStyle": "Top style",
  "avatarEditor.topColor": "Top color",
  "avatarEditor.bottomStyle": "Bottom style",
  "avatarEditor.bottomColor": "Bottom color",
  "avatarEditor.shoeColor": "Shoe color",
  "avatarEditor.hat": "Hat",
  "avatarEditor.accessories": "Accessories",
  "avatarEditor.saving": "Saving...",
  // Inspect Header
  "inspect.closePanel": "Close panel",
  // Agent Settings
  "agentSettings.runCommands": "Run commands",
  "agentSettings.webAccess": "Web access",
  "agentSettings.fileTools": "File tools",
  "agentSettings.browserAutomation": "Browser automation",
  "agentSettings.createAutomation": "Create automation",
  "agentSettings.automationName": "Automation name",
  "agentSettings.task": "Task",
  // Agent Skills
  "agentSkills.title": "Skills",
  "agentSkills.accessHint": "Skill access controls apply to this agent.",
  "agentSkills.selectedOnly": "This agent is using selected skills only.",
  "agentSkills.searchPlaceholder": "Search skills",
  "agentSkills.searchAriaLabel": "Search skills",
  "agentSkills.filterAll": "All",
  "agentSkills.filterReady": "Ready",
  "agentSkills.filterSetupRequired": "Setup required",
  "agentSkills.filterNotSupported": "Not supported",
  "agentSkills.loading": "Loading skills...",
  "agentSkills.noMatch": "No matching skills.",
  "agentSkills.statusReady": "Ready",
  "agentSkills.statusSetupRequired": "Setup required",
  "agentSkills.statusNotSupported": "Not supported",
  "agentSkills.blockedByPolicy": "Blocked by bundled skill policy.",
  "agentSkills.notSupportedGeneric": "Not supported.",
  "agentSkills.disabledGlobally": "Disabled globally. Enable in system setup.",
  "agentSkills.requiresSetup": "Requires configuration in system setup.",
  "agentSkills.openSystemSetup": "Open System Setup",
  // System Skills
  "systemSkills.searchPlaceholder": "Search skills",
  "systemSkills.searchAriaLabel": "Search skills",
  // HQ Sidebar
  "hq.inbox": "Inbox",
  "hq.history": "History",
  "hq.analytics": "Analytics",
  "hq.settings": "Settings",
  "hq.playbooks": "Playbooks",
  "hq.marketplace": "Skill store",
  "hq.taskBoard": "Task board",
  // Task Board
  "hq.taskBoard.title": "Kanban",
  "hq.taskBoard.subtitle": "Manual tasks, extracted requests, and scheduled playbooks.",
  "taskBoard.status.todo": "To Do",
  "taskBoard.status.inProgress": "In Progress",
  "taskBoard.status.blocked": "Blocked",
  "taskBoard.status.review": "Review",
  "taskBoard.status.done": "Done",
  "taskBoard.noActivity": "No activity",
  "taskBoard.justNow": "Just now",
  "taskBoard.mAgo": "{count}m ago",
  "taskBoard.hAgo": "{count}h ago",
  "taskBoard.dAgo": "{count}d ago",
  "taskBoard.arrowKeysHint": "Use arrow keys to move between columns.",
  "taskBoard.playbookLinked": "Playbook linked.",
  "taskBoard.runLinked": "Run linked.",
  "taskBoard.unassigned": "Unassigned",
  "taskBoard.refresh": "Refresh",
  "taskBoard.newTask": "New Task",
  "taskBoard.dropCardHere": "Drop a card here.",
  "taskBoard.taskDetails": "Task Details",
  "taskBoard.close": "Close",
  "taskBoard.titleLabel": "Title",
  "taskBoard.descriptionLabel": "Description",
  "taskBoard.statusLabel": "Status",
  "taskBoard.assignedAgent": "Assigned agent",
  "taskBoard.linkedActiveRun": "Linked active run",
  "taskBoard.noLinkedRun": "No linked run",
  "taskBoard.linkedPlaybook": "Linked playbook",
  "taskBoard.noLinkedPlaybook": "No linked playbook",
  "taskBoard.channel": "Channel",
  "taskBoard.notes": "Notes",
  "taskBoard.source": "Source: {value}.",
  "taskBoard.created": "Created: {value}.",
  "taskBoard.updated": "Updated: {value}.",
  "taskBoard.deleteTask": "Delete Task",
  // Empty
  "empty.noAgents": "No agents available.",
  // Misc
  "misc.copyCommand": "Copy command",
  // Voice transcription
  "voice.transcriptionDisabled": "Voice transcription is disabled.",
  // Settings Panel
  "settings.studioTitle": "Studio title",
  "settings.officeTitlePlaceholder": "Alex's HQ",
  // Branding
  "branding.title": "3DAGENT",
  "branding.author": "Cemal Demirci",
  "branding.site": "cemal.cloud",
  "branding.poweredBy": "cemal.cloud — Cemal Demirci",
  "branding.developedBy": "by Cemal Demirci — cemal.cloud",
};

// Import the real Turkish dictionary so tests written with Turkish strings still work.
// The mock checks English first, then falls back to Turkish, then the raw key.
vi.mock("@/lib/i18n", async () => {
  const { tr } = await vi.importActual<{ tr: Record<string, string> }>("@/lib/i18n/tr");
  return {
    t: (key: string) => en[key] ?? tr[key] ?? key,
    tReplace: (key: string, vars: Record<string, string | number>) => {
      let result = en[key] ?? tr[key] ?? key;
      for (const [k, v] of Object.entries(vars)) {
        result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
      return result;
    },
  };
});

const ensureLocalStorage = () => {
  if (typeof window === "undefined") return;
  const existing = window.localStorage as unknown as Record<string, unknown> | undefined;
  if (
    existing &&
    typeof existing.getItem === "function" &&
    typeof existing.setItem === "function" &&
    typeof existing.removeItem === "function" &&
    typeof existing.clear === "function"
  ) {
    return;
  }

  const store = new Map<string, string>();
  const storage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(String(key)) ? store.get(String(key)) ?? null : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(String(key));
    },
    setItem(key: string, value: string) {
      store.set(String(key), String(value));
    },
  };

  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
  });
};

ensureLocalStorage();
