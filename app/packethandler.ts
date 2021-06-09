import PacketReader from "@popstarfreas/packetfactory/packetreader";
import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import GenericPacketHandler from "terrariaserver-lite/handlers/genericpackethandler";
import Packet from "terrariaserver-lite/packet";
import Ping from "./";

class PacketHandler implements GenericPacketHandler {
    private _ping: Ping;

    constructor(ping: Ping) {
        this._ping = ping;
    }

    public handlePacket(client: Client, packet: Packet): boolean {
        let handled = false;
        switch (packet.packetType) {
            case PacketTypes.UpdateItemOwner:
                handled = this.handleUpdateItemOwner(client, packet);
                break;
        }

        return handled;
    }

    private handleUpdateItemOwner(client: Client, packet: Packet): boolean {
        const reader = new PacketReader(packet.data);
        const itemId = reader.readInt16();
        const playerId = reader.readInt16();

        console.log(itemId, playerId);
        if (itemId === 400 && client.extProperties.has("ping-inprogress")) {
            const pingInfo = client.extProperties.get("ping-inprogress");
            const ping = (Date.now() - pingInfo.timestamp);
            client.extProperties.delete("ping-inprogress");
            client.sendChatMessage(`Ping: ${ping}ms`);
        }

        return false;
    }
}

export default PacketHandler;
