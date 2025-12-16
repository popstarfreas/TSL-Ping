
import Client from "terrariaserver-lite/client";
import Command from "terrariaserver-lite/command";
import CommandHandler from "terrariaserver-lite/commandhandler";
import CommandHandlers from "terrariaserver-lite/commandhandlers";
import Ping from "../../index.js";
import PingInfo from "../../pinginfo.js";
import { ItemOwnerRemovePacket } from "terraria-packet";

class PingCommand extends CommandHandler {
    public names = ["ping"];
    public permission = "";

    constructor(commandHandlers: CommandHandlers) {
        super(commandHandlers);
    }

    public handle(_command: Command, client: Client): void {
        client.sendChatMessage("Measuring. Please wait.");
        const packetResult = ItemOwnerRemovePacket.toBuffer({
            itemDropId: 400
        })
        if (packetResult.TAG === "Error") {
            client.server.logger.error(`Failed to create packet for ping command: ${packetResult._0.context}; ${packetResult._0.error.message}`);
            return
        }

        const pingPacket = packetResult._0;

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
