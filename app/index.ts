import TerrariaServer from "terrariaserver-lite/terrariaserver";
import Extension from "terrariaserver-lite/extensions/extension";
import PacketHandler from "./packethandler";
import PingCommand from "./commands/ping";

class Ping extends Extension {
    public name = "Ping";
    public version = "v1.0";

    public static inprogressKey = "ping-inprogress";

    constructor(server: TerrariaServer) {
        super(server);
        this.packetHandler = new PacketHandler(this);
        this.addCommand(new PingCommand(this.server.commandHandler));
    }
}

export default Ping;
