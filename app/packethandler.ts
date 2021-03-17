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
            case PacketTypes.PlayerInventorySlot:
                handled = this.handlePlayerInventorySlot(client, packet);
                break;
        }

        return handled;
    }

    private handlePlayerInventorySlot(client: Client, packet: Packet): boolean {
        const reader = new PacketReader(packet.data);
        reader.readByte();
        const slot = reader.readInt16();

        if (slot === 139 && client.extProperties.has("ping-inprogress")) {
            const pingInfo = client.extProperties.get("ping-inprogress");
            const ping = (Date.now() - pingInfo.timestamp);
            client.extProperties.delete("ping-inprogress");
            client.sendChatMessage(`Ping: ${ping}ms`);
        }

        return false;
    }
}

export default PacketHandler;
