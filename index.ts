import * as Winston from "winston";
import ChatMessage from "../../chatmessage";
import Client from "../../client";
import Database from "../../database";
import TerrariaServer from "../../terrariaserver";
import Extension from "../extension";
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
