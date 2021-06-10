import PacketReader from "@popstarfreas/packetfactory/packetreader";
import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import GenericPacketHandler from "terrariaserver-lite/handlers/genericpackethandler";
import Packet from "terrariaserver-lite/packet";
import Ping from "./";
import PingInfo from "./pinginfo";
import PacketWriter from "@popstarfreas/packetfactory/packetwriter";

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
        const playerId = reader.readByte();

        if (itemId === 400 && playerId === 255 && client.extProperties.has(Ping.inprogressKey)) {
            const pingInfo: PingInfo = client.extProperties.get(Ping.inprogressKey);
            const ping = (Date.now() - pingInfo.lastTimestamp);
            pingInfo.pings.push(ping);
            if (pingInfo.pings.length >= 10) {
                const max = Math.max(...pingInfo.pings);
                const min = Math.min(...pingInfo.pings);
                const avg = pingInfo.pings.reduce((acc, value) => acc + value, 0) / pingInfo.pings.length;
                client.extProperties.delete("ping-inprogress");
                client.sendChatMessage(`Max: ${max}. Min: ${min}. Average: ${avg}ms`);
            } else {
                const pingPacket = new PacketWriter()
                    .setType(PacketTypes.RemoveItemOwner)
                    .packInt16(400)
                    .data;

                pingInfo.lastTimestamp = Date.now();
                client.sendPacket(pingPacket);
            }
        }

        return false;
    }
}

export default PacketHandler;
