import type { FacingPoint, KahvehaneRoute } from "@/features/retro-office/core/types";
import {
  EAST_WING_DOOR_Y,
  EAST_WING_ROOM_HEIGHT,
  EAST_WING_ROOM_TOP_Y,
  QA_LAB_END_X,
  QA_LAB_X,
  QA_LAB_WIDTH,
} from "@/features/retro-office/core/constants";

export const KAHVEHANE_DEFAULT_TARGET = {
  x: QA_LAB_X + QA_LAB_WIDTH / 2,
  y: 180,
  facing: -Math.PI / 2,
};

const KAHVEHANE_DOOR_OUTER_TARGET = {
  x: QA_LAB_X - 36,
  y: EAST_WING_DOOR_Y + 20,
  facing: -Math.PI / 2,
};

const KAHVEHANE_DOOR_INNER_TARGET = {
  x: QA_LAB_X + 50,
  y: EAST_WING_DOOR_Y + 20,
  facing: -Math.PI / 2,
};

const DOOR_APPROACH_RADIUS = 60;
const DOOR_INNER_SNAP_RADIUS = 18;

export const resolveKahvehaneRoute = (
  x: number,
  y: number,
  seatingTarget: FacingPoint = KAHVEHANE_DEFAULT_TARGET,
): KahvehaneRoute => {
  const insideKahvehane =
    (x >= QA_LAB_X && x <= QA_LAB_END_X &&
      y >= EAST_WING_ROOM_TOP_Y &&
      y <= EAST_WING_ROOM_TOP_Y + EAST_WING_ROOM_HEIGHT) ||
    Math.hypot(
      x - KAHVEHANE_DOOR_INNER_TARGET.x,
      y - KAHVEHANE_DOOR_INNER_TARGET.y,
    ) < DOOR_INNER_SNAP_RADIUS;
  if (insideKahvehane) {
    return {
      stage: "seated",
      targetX: seatingTarget.x,
      targetY: seatingTarget.y,
      facing: seatingTarget.facing,
    };
  }

  const withinDoorThreshold =
    Math.hypot(
      x - KAHVEHANE_DOOR_OUTER_TARGET.x,
      y - KAHVEHANE_DOOR_OUTER_TARGET.y,
    ) < DOOR_APPROACH_RADIUS;
  if (withinDoorThreshold) {
    return {
      stage: "door_inner",
      targetX: KAHVEHANE_DOOR_INNER_TARGET.x,
      targetY: KAHVEHANE_DOOR_INNER_TARGET.y,
      facing: KAHVEHANE_DOOR_INNER_TARGET.facing,
    };
  }

  return {
    stage: "door_outer",
    targetX: KAHVEHANE_DOOR_OUTER_TARGET.x,
    targetY: KAHVEHANE_DOOR_OUTER_TARGET.y,
    facing: KAHVEHANE_DOOR_OUTER_TARGET.facing,
  };
};
