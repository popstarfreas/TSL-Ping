
import PacketWriter from "@popstarfreas/packetfactory/packetwriter";
import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";
import getWorldInfo from "terrariaserver-lite/packets/worldinfo";

class PingCommand extends CommandHandler {
    public names = ["ping"];
    public permission = "";

    constructor(commandHandlers: CommandHandlers) {
        super(commandHandlers);
    }

    public handle(command: Command, client: Client): void {
        const worldInfoSSC = getWorldInfo(client.server.world, {
            SSC: true,
            notExpert: !client.server.config.expert
        });
        const worldInfoNonSSC = getWorldInfo(client.server.world, {
            SSC: false,
            notExpert: !client.server.config.expert
        });
        const slotUpdate = new PacketWriter()
            .setType(PacketTypes.PlayerInventorySlot)
            .packByte(client.id)
            .packByte(139) // slot index
            .packInt16(0) // stack
            .packByte(1) // prefix
            .packInt16(20) // item net id
            .data;

        client.sendPacket(Buffer.concat([worldInfoSSC, slotUpdate, worldInfoNonSSC]));
        client.extProperties.set("ping-inprogress", {
            timestamp: Date.now()
        });
    }
}

export default PingCommand;
