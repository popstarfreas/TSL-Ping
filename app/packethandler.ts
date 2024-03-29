import PacketTypes from "terrariaserver-lite/packettypes";
import Client from "terrariaserver-lite/client";
import GenericPacketHandler from "terrariaserver-lite/handlers/genericpackethandler";
import Packet from "terrariaserver-lite/packet";
import Ping from "./";
import PingInfo from "./pinginfo";
import PacketWriter from "@popstarfreas/packetfactory/packetwriter";

import * as ItemOwner from "@darkgaming/rescript-terrariapacket/src/packet/Packet_ItemOwner.gen";

class PacketHandler implements GenericPacketHandler {
    constructor(_ping: Ping) {
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

    private getJitterRemark(jitterPercentage: number): string {
        if (jitterPercentage >= 0.5) {
            return "Really bad.";
        }

        if (jitterPercentage >= 0.4) {
            return "High.";
        }

        if (jitterPercentage >= 0.3) {
            return "Moderate.";
        }

        if (jitterPercentage >= 0.2) {
            return "Fairly good.";
        }

        if (jitterPercentage >= 0.1) {
            return "Fairly good.";
        }

        if (jitterPercentage >= 0.01) {
            return "Amazing.";
        }

        return "Outstanding.";
    }

    private getPingRemark(averagePing: number): string {
        if (averagePing >= 300) {
            return "Really bad.";
        }

        if (averagePing >= 150) {
            return "High. Delay should be noticeable.";
        }

        if (averagePing >= 100) {
            return "Moderately high. Delay slightly noticeable.";
        }

        if (averagePing >= 80) {
            return "Moderate. Delay possibly noticeable.";
        }

        if (averagePing >= 50) {
            return "Fairly good.";
        }

        if (averagePing >= 30) {
            return "Very good.";
        }

        if (averagePing >= 20) {
            return "Amazing.";
        }

        return "Outstanding. Do you literally live in the datacenter?";
    }

    private handleUpdateItemOwner(client: Client, packet: Packet): boolean {
        const itemOwner = ItemOwner.parse(packet.data);
        if (typeof itemOwner === "undefined") {
            return false;
        }

        if (itemOwner.itemDropId === 400 && itemOwner.owner === 255 && client.extProperties.has(Ping.inprogressKey)) {
            const pingInfo: PingInfo = client.extProperties.get(Ping.inprogressKey);
            const ping = (Date.now() - pingInfo.lastTimestamp);
            pingInfo.samplesLeft -= 1;
            pingInfo.pings.push(ping);
            // We calculate a more accurate samples left from the current average
            // so that we don't take forever to measure the ping stats
            if (pingInfo.pings.length === 3) {
                const avg = pingInfo.pings.reduce((acc, value) => acc + value, 0) / pingInfo.pings.length;
                pingInfo.samplesLeft = Math.ceil(5000 / avg) - 3;
            }

            if (pingInfo.samplesLeft <= 0) {
                const max = Math.max(...pingInfo.pings);
                const min = Math.min(...pingInfo.pings);
                const avg = pingInfo.pings.reduce((acc, value) => acc + value, 0) / pingInfo.pings.length;
                let jitter = 0;
                for (let i = 0; i < pingInfo.pings.length - 1; i++) {
                    jitter += Math.abs(pingInfo.pings[i] - pingInfo.pings[i + 1]);
                }
                jitter /= pingInfo.pings.length - 1;
                const jitterPercentage = jitter / avg;
                client.extProperties.delete("ping-inprogress");
                client.sendChatMessage(`[c/1CBAFF:===] [c/12D2FF:Ping Report] [c/1CBAFF:===]`);
                client.sendChatMessage(`[c/1CBAFF:Ping Samples used:] ${pingInfo.pings.length}. Game ping may be around 16ms higher than network. `);
                client.sendChatMessage(`[c/1CBAFF:Max:] ${max}. [c/1CBAFF:Min:] ${min}. [c/1CBAFF:Average:] ${avg.toFixed(1)}ms. [c/1CBAFF:Jitter:] ${jitter.toFixed(1)}ms (${(jitterPercentage * 100).toFixed(0)}%).`);
                client.sendChatMessage(`[c/1CBAFF:Ping Remark:] ${this.getPingRemark(avg)} [c/1CBAFF:Jitter Remark:] ${this.getJitterRemark(jitterPercentage)}`);
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
