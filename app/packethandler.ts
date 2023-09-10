import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import GenericPacketHandler from "terrariaserver-lite/handlers/genericpackethandler";
import Packet from "terrariaserver-lite/packet";
import Ping from "./";

import * as PlayerInventorySlot from "@darkgaming/rescript-terrariapacket/src/packet/Packet_PlayerInventorySlot.gen";

class PacketHandler implements GenericPacketHandler {
    constructor(_ping: Ping) {
    }

    public handlePacket(client: Client, packet: Packet): boolean {
        let handled = false;
        switch (packet.packetType) {
            case PacketTypes.PlayerInventorySlot:
                handled = this.handlePlayerInventorySlot(client, packet);
                break;
        }

        return handled;
    }

    private handlePlayerInventorySlot(client: Client, packet: Packet): boolean {
        const playerInventorySlot = PlayerInventorySlot.parse(packet.data);
        if (typeof playerInventorySlot === "undefined") {
            return false;
        }

        if (playerInventorySlot.slot === 139 && client.extProperties.has("ping-inprogress")) {
            const pingInfo = client.extProperties.get("ping-inprogress");
            const ping = (Date.now() - pingInfo.timestamp);
            client.extProperties.delete("ping-inprogress");
            client.sendChatMessage(`Ping: ${ping}ms`);
        }

        return false;
    }
}

export default PacketHandler;
