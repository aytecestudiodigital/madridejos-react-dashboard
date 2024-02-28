import { Socket, io } from "socket.io-client";

export class DeviceSocketConection {
  private static _instance: DeviceSocketConection | null = null;
  private socket!: Socket;

  private constructor(token: string) {
    this.initSocket(token);
  }

  public static getInstance(token: string): DeviceSocketConection {
    return (
      this._instance ?? (this._instance = new DeviceSocketConection(token))
    );
  }

  private initSocket(token: string) {
    this.socket = io("http://46.101.100.190:5173", {
      reconnection: true,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public closeSocket(): void {
    this.socket.disconnect();
  }

  public getSocket() {
    return this.socket;
  }
}
