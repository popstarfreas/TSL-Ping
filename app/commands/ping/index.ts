
import PacketWriter from "@popstarfreas/packetfactory/packetwriter";
import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";

class PingCommand extends CommandHandler {
    public names = ["ping"];
    public permission = "";

    constructor(commandHandlers: CommandHandlers) {
        super(commandHandlers);
    }

    public handle(_command: Command, client: Client): void {
        const slotUpdate = new PacketWriter()
            .setType(PacketTypes.RemoveItemOwner)
            .packInt16(400)
            .data;

        client.sendPacket(slotUpdate);
        client.extProperties.set("ping-inprogress", {
            timestamp: Date.now()
        });
    }
}

export default PingCommand;
