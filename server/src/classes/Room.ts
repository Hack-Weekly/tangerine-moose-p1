// the maximum number of people allowed in each room
const ROOM_MAX_CAPACITY = 5;

export interface RoomInfo {
    id: string;
    users: number
}

class Room {
  roomsState: RoomInfo[];
  constructor() {
    this.roomsState = [];
  }
}

module.exports = Room;