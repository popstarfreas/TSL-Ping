
import PacketWriter from "@popstarfreas/packetfactory/packetwriter";
import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";
import Ping from "../../";

class PingCommand extends CommandHandler {
    public names = ["ping"];
    public permission = "";

    constructor(commandHandlers: CommandHandlers) {
        super(commandHandlers);
    }

    public handle(_command: Command, client: Client): void {
        const pingPacket = new PacketWriter()
            .setType(PacketTypes.RemoveItemOwner)
            .packInt16(400)
            .data;

        client.sendPacket(pingPacket);
        client.extProperties.set(Ping.inprogressKey, {
            timestamp: Date.now()
        });
    }
}

export default PingCommand;
