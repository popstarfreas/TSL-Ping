
import PacketWriter from "dimensions/packets/packetwriter";
import PacketTypes from "dimensions/packettypes";
import Client from "../../../../client";
import Command from "../../../../command";
import CommandHandler from "../../../../commandhandler";
import CommandHandlers from "../../../../commandhandlers";
import getWorldInfo from "../../../../packets/worldinfo";

class PingCommand extends CommandHandler {
    public names = ["ping"];
    public permission = "";

    constructor(commandHandlers: CommandHandlers) {
        super(commandHandlers);
    }

    public handle(command: Command, client: Client): void {
        const spawn = client.server.config.spawn;
        const worldInfoSSC = getWorldInfo(spawn, {
            SSC: true,
            notExpert: !client.server.config.expert
        });
        const worldInfoNonSSC = getWorldInfo(spawn, {
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
