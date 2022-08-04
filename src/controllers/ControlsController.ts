export enum InputType {
  KEYBOARD,
}

export enum ActionType {
  FORWARD = "forward",
  BACKWARD = "backward",
  LEFT = "left",
  RIGHT = "right",
  SHOOT = "shoot",
  SWITCH = "switch",
}

export interface IControlsMap {
  [key: string]: number;

  // Movement
  [ActionType.FORWARD]: number;
  [ActionType.BACKWARD]: number;
  [ActionType.LEFT]: number;
  [ActionType.RIGHT]: number;

  // Other
  [ActionType.SHOOT]: number;
  [ActionType.SWITCH]: number;
}

export interface IActions {
  [key: string]: boolean;
    
  // Movement
  [ActionType.FORWARD]: boolean;
  [ActionType.BACKWARD]: boolean;
  [ActionType.LEFT]: boolean;
  [ActionType.RIGHT]: boolean;

  // Other
  [ActionType.SHOOT]: boolean;
  [ActionType.SWITCH]: boolean;
}

class ControlsController {
  protected keyEvents: Map<number, (isDown: boolean) => void> = new Map();

  public actions: IActions = {
    [ActionType.FORWARD]: false,
    [ActionType.BACKWARD]: false,
    [ActionType.LEFT]: false,
    [ActionType.RIGHT]: false,

    // Other
    [ActionType.SHOOT]: false,
    [ActionType.SWITCH]: false,
  };

  constructor(protected type: InputType, protected controlsMap: IControlsMap) {
    // Remap the controls to run when a certain key is pressed
    (Object.keys(controlsMap) as ActionType[]).forEach((key) => {
      this.keyEvents.set(controlsMap[key], (isDown: boolean) =>
        this.runAction(key, isDown)
      );
    });

    // Create the listener for the buttons
    window.addEventListener("keydown", ({ keyCode }) => {
      const action = this.keyEvents.get(keyCode);
      action && action(true);
    });

    window.addEventListener("keyup", ({ keyCode }) => {
      const action = this.keyEvents.get(keyCode);
      action && action(false);
    });
  }

  public triggerActionEvent(key: ActionType, isDown: boolean) {
    switch (key) {
      case ActionType.FORWARD:
        this.actions[ActionType.FORWARD] = isDown;
        break;
      case ActionType.BACKWARD:
        this.actions[ActionType.BACKWARD] = isDown;
        break;
      case ActionType.LEFT:
        this.actions[ActionType.LEFT] = isDown;
        break;
      case ActionType.RIGHT:
        this.actions[ActionType.RIGHT] = isDown;
        break;
      case ActionType.SHOOT:
        this.actions[ActionType.SHOOT] = isDown;
        break;
      case ActionType.SWITCH:
        this.actions[ActionType.SWITCH] = isDown;
        break;
    }
  }

  private runAction(key: ActionType, isDown: boolean) {
    // console.log("action:", key);

    this.triggerActionEvent(key, isDown);
  }
}

export default ControlsController;
