import TerrariaServer from "terrariaserver-lite/terrariaserver";
import Extension from "terrariaserver-lite/extensions/extension";
import PacketHandler from "./packethandler";

class Ping extends Extension {
    public name = "Ping";
    public version = "v1.0";

    constructor(server: TerrariaServer) {
        super(server);
        this.packetHandler = new PacketHandler(this);
        this.loadCommands(__dirname);
    }
}

export default Ping;
