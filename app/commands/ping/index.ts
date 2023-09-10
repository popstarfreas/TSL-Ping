
import PacketWriter from "@popstarfreas/packetfactory/packetwriter";
import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";
import Ping from "../../";
import PingInfo from "../../pinginfo";

class PingCommand extends CommandHandler {
    public names = ["ping"];
    public permission = "";

    constructor(commandHandlers: CommandHandlers) {
        super(commandHandlers);
    }

    public handle(_command: Command, client: Client): void {
        client.sendChatMessage("Measuring. Please wait.");
        const pingPacket = new PacketWriter()
            .setType(PacketTypes.RemoveItemOwner)
            .packInt16(400)
            .data;

        client.sendPacket(pingPacket);
        const info: PingInfo = {
            pings: [],
            lastTimestamp: Date.now(),
            samplesLeft: 100,
        }
        client.extProperties.set(Ping.inprogressKey, info);
    }
}

export default PingCommand;
