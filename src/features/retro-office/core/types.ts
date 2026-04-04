import type { AgentAvatarProfile } from "@/lib/avatars/profile";
import type { OfficeInteractionTargetId } from "@/lib/office/places";

export type OfficeAgent = {
  id: string;
  name: string;
  subtitle?: string | null;
  status: "working" | "idle" | "error";
  color: string;
  item: string;
  avatarProfile?: AgentAvatarProfile | null;
};

export type JanitorTool = "broom" | "vacuum" | "floor_scrubber";

export type JanitorActor = {
  id: string;
  name: string;
  role: "janitor";
  status: "working";
  color: string;
  item: "cleaning";
  janitorTool: JanitorTool;
  janitorRoute: FacingPoint[];
  janitorPauseMs: number;
  janitorDespawnAt: number;
};

export type SceneActor = OfficeAgent | JanitorActor;

export type RenderAgent = SceneActor & {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  path: { x: number; y: number }[];
  facing: number;
  frame: number;
  walkSpeed: number;
  phaseOffset: number;
  state: "walking" | "sitting" | "standing" | "away" | "browsing" | "dancing";
  awayUntil?: number;
  separationReplanAt?: number;
  bumpedUntil?: number;
  bumpTalkUntil?: number;
  collisionCooldownUntil?: number;
  pingPongUntil?: number;
  pingPongTargetX?: number;
  pingPongTargetY?: number;
  pingPongFacing?: number;
  pingPongPartnerId?: string;
  pingPongTableUid?: string;
  pingPongSide?: 0 | 1;
  pingPongPreviousWalkSpeed?: number;
  interactionTarget?: OfficeInteractionTargetId;
  smsBoothStage?: "door_outer" | "door_inner" | "typing";
  phoneBoothStage?: "door_outer" | "door_inner" | "receiver";
  serverRoomStage?: "door_outer" | "door_inner" | "terminal";
  bazaarStage?: "door_outer" | "door_inner" | "browsing";
  kahvehaneStage?: "door_outer" | "door_inner" | "seated";
  kahvehaneActivity?: KahvehaneActivity;
  browsingStyle?: "shopping" | "inspecting" | "haggling" | "admiring" | "resting" | "chatting";
  janitorRouteIndex?: number;
  janitorPauseUntil?: number;
};

export type FurnitureItem = {
  _uid: string;
  type: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  color?: string;
  id?: string;
  facing?: number;
  vertical?: boolean;
  elevation?: number;
};

export type FurnitureSeed = Omit<FurnitureItem, "_uid">;

export type CanvasPoint = {
  x: number;
  y: number;
};

export type FacingPoint = CanvasPoint & {
  facing: number;
};

export type KahvehaneActivity = "coffee" | "tavla" | "sohbet" | "cezve" | "dinlenme";

export type BazaarBrowsingLocation = FacingPoint & {
  browsingStyle: "shopping" | "inspecting" | "haggling" | "admiring" | "resting" | "chatting";
};

export type KahvehaneSeatingLocation = FacingPoint & {
  kahvehaneActivity: KahvehaneActivity;
};

export type ServerRoomRoute = {
  stage: "door_outer" | "door_inner" | "terminal";
  targetX: number;
  targetY: number;
  facing: number;
};

export type KahvehaneRoute = {
  stage: "door_outer" | "door_inner" | "seated";
  targetX: number;
  targetY: number;
  facing: number;
};

export type BazaarRoute = {
  stage: "door_outer" | "door_inner" | "browsing";
  targetX: number;
  targetY: number;
  facing: number;
};

export type PhoneBoothRoute = {
  stage: "door_outer" | "door_inner" | "receiver";
  targetX: number;
  targetY: number;
  facing: number;
};

export type SmsBoothRoute = {
  stage: "door_outer" | "door_inner" | "typing";
  targetX: number;
  targetY: number;
  facing: number;
};
