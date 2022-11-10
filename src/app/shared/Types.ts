import { MoveChange } from "ngx-chess-board";

enum MessageType {
    ASSIGN_ROLE,
    MOVE,
    APPLY_MOVE,
    GAME_END,
    RESTART
}

class MoveAction {
    player: number;
    move: MoveChange;
}

class ApplyMove {
    type: MessageType;
    move: MoveChange;
}

export { MessageType, MoveAction, ApplyMove }