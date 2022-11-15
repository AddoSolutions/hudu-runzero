let Axios = require("axios")
const queryString = require('query-string');


let api = Axios.create({
    baseURL: "https://console.runzero.com/api/v1.0/",
    headers:{
        "Authorization": "Bearer "+ process.env.RUNZERO_KEY
    }
})


class RunZero{

    /**
     *
     * @returns {Promise<AxiosResponse<[{
     *     id: 'b81c3862-361c-47b3-a422-XXXXXXXXXXXX',
     *     created_at: 1667349004,
     *     created_by: '',
     *     updated_at: 1667349004,
     *     client_id: '3a7497e1-58b8-4c6b-a4de-XXXXXXXXX',
     *     download_token: 'XXXXXXXXXXXXXXXX',
     *     download_token_created_at: 1667349004,
     *     demo: false,
     *     project: false,
     *     parent_id: '00000000-0000-0000-0000-000000000000',
     *     name: 'Testing',
     *     description: null,
     *     inactive: false,
     *     deactivated_at: 0,
     *     service_count: 0,
     *     service_count_tcp: 0,
     *     service_count_udp: 0,
     *     service_count_arp: 0,
     *     service_count_icmp: 0,
     *     asset_count: 0,
     *     live_asset_count: 0,
     *     recent_asset_count: 0,
     *     software_count: 0,
     *     vulnerability_count: 0,
     *     export_token: '',
     *     export_token_created_at: 0,
     *     export_token_last_used_at: 0,
     *     export_token_last_used_by: '',
     *     export_token_counter: 0,
     *     expiration_assets_stale: 180,
     *     expiration_assets_offline: 180,
     *     expiration_scans: 365,
     *     expiration_warning_last_sent: 0
     *   }]>>}
     */
    getOrgs(){
        return api.get("account/orgs")
            .then(d=>d.data)
    }

    /**
     *
     * @param orgId
     * @returns {Promise<AxiosResponse<[{
     *     id: 'e5290496-7edc-4278-XXX-XXXXXXXXXX',
     *     created_at: 1667400627,
     *     updated_at: 1667400627,
     *     organization_id: 'bf3f3d4a-XXXX-480d-ab83-XXXXXXXXX',
     *     site_id: '2fa648d1-9b89-XXXX-9fe9-XXXXXXXXX',
     *     alive: true,
     *     last_seen: 1667400023,
     *     first_seen: 1667398658,
     *     detected_by: 'icmp',
     *     type: 'WAP',
     *     os_vendor: 'Ubiquiti',
     *     os_product: 'U6-LR Firmware',
     *     os_version: '6.2.41.14083',
     *     os: 'Ubiquiti U6-LR',
     *     hw_vendor: 'Ubiquiti',
     *     hw_product: 'U6-LR',
     *     hw_version: '',
     *     hw: 'Ubiquiti U6-LR',
     *     addresses: [ '10.6.10.151' ],
     *     addresses_extra: [],
     *     macs: [
     *       '78:45:58:98:70:5c', '78:45:58:98:70:5d',
     *       '78:45:58:a8:70:5c', '78:45:58:a8:70:5d',
     *       '78:45:58:b8:70:5c', '78:45:58:b8:70:5d',
     *       '78:45:58:c8:70:5c', '78:45:58:c8:70:5d',
     *       '78:45:58:d8:70:5c', '78:45:58:d8:70:5d',
     *       '78:45:58:e8:70:5c', '78:45:58:e8:70:5d',
     *       '78:45:58:f8:70:5b', '78:45:58:f8:70:5c',
     *       '78:45:58:f8:70:5d', '7c:45:58:f8:70:5c',
     *       '7c:45:58:f8:70:5d'
     *     ],
     *     mac_vendors: [ 'Ubiquiti Networks Inc.' ],
     *     names: [ 'U6-LR' ],
     *     tags: {},
     *     tag_descriptions: {},
     *     domains: [],
     *     services: {
     *       '10.6.10.151/0/icmp/': [Object],
     *       '10.6.10.151/161/tcp/': [Object],
     *       '10.6.10.151/161/udp/': [Object],
     *       '10.6.10.151/22/tcp/': [Object],
     *       '10.6.10.151/8080/tcp/': [Object]
     *     },
     *     credentials: {},
     *     rtts: { 'icmp/echo': [Array] },
     *     attributes: {
     *       '_links.ports.connected': '00:2a:10:a2:f4:e4-10.5.0.13-Ethernet1/5',
     *       '_macs.ipmap': '78:45:58:98:70:5c=10.6.10.151\t78:45:58:98:70:5d=10.6.10.151\t78:45:58:a8:70:5c=10.6.10.151\t78:45:58:a8:70:5d=10.6.10.151\t78:45:58:b8:70:5c=10.6.10.151\t78:45:58:b8:70:5d=10.6.10.151\t78:45:58:c8:70:5c=10.6.10.151\t78:45:58:c8:70:5d=10.6.10.151\t78:45:58:d8:70:5c=10.6.10.151\t78:45:58:d8:70:5d=10.6.10.151\t78:45:58:e8:70:5c=10.6.10.151\t78:45:58:e8:70:5d=10.6.10.151\t78:45:58:f8:70:5b=10.6.10.151\t78:45:58:f8:70:5c=10.6.10.151\t78:45:58:f8:70:5d=10.6.10.151\t7c:45:58:f8:70:5c=10.6.10.151\t7c:45:58:f8:70:5d=10.6.10.151',
     *       'fp.certainty': '0.85',
     *       'hw.certainty': '0.89',
     *       'hw.device': 'WAP',
     *       'hw.product': 'U6-LR',
     *       'hw.vendor': 'Ubiquiti',
     *       'ip.ttl.hops': '1',
     *       'ip.ttl.hops.rst': '1',
     *       'ip.ttl.host': '10.6.10.151',
     *       'ip.ttl.port': '22',
     *       'ip.ttl.source': '64',
     *       'ip.ttl.source.icmp': '64',
     *       'ip.ttl.source.rst': '64',
     *       'ip.ttl.win': '29200',
     *       'ipv4.traceroute': '10.5.9.2/10.6.10.151',
     *       'match.db': 'snmp-sysdescr',
     *       'match.db.hw': 'snmp-sysdescr',
     *       'match.score': '89',
     *       'match.score.hw': '89',
     *       'match.score.os': '89',
     *       'os.certainty': '0.89',
     *       'os.device': 'WAP',
     *       'os.product': 'U6-LR Firmware',
     *       'os.vendor': 'Ubiquiti',
     *       'os.version': '6.2.41.14083',
     *       'snmp.sysDesc': 'U6-LR 6.2.41.14083',
     *       'snmp.sysName': 'U6-LR',
     *       'snmp.sysObjectID': '.1.3.6.1.4.1.41112',
     *       'snmpv3.random': 'f3a94e0e',
     *       'ssh.authMethods': 'password\tpublickey',
     *       'switch.ip': '10.5.0.13',
     *       'switch.name': 'DC-NX-CORE',
     *       'switch.port': '10.5.0.13-Ethernet1/5',
     *       'tcp.closedPortCount': '492',
     *       'tls.stack': 'openssl',
     *       'tls.supportedVersionNames': 'TLSv1.2',
     *       vlan: '6'
     *     },
     *     service_count: 5,
     *     service_count_tcp: 3,
     *     service_count_udp: 1,
     *     service_count_arp: 0,
     *     service_count_icmp: 1,
     *     software_count: 2,
     *     vulnerability_count: 0,
     *     lowest_ttl: 1,
     *     lowest_rtt: 62852941,
     *     last_agent_id: '294c726e-b480-44d6-bcc1-62576c45684b',
     *     last_task_id: 'efc1d543-168d-4f3b-b65f-54765e5bf814',
     *     newest_mac: '78:45:58:98:70:5c',
     *     newest_mac_vendor: 'Ubiquiti Networks Inc.',
     *     newest_mac_age: 1594771200000000000,
     *     comments: null,
     *     service_ports_tcp: [ '22', '161', '8080' ],
     *     service_ports_udp: [ '161' ],
     *     service_protocols: [ 'snmp', 'ssh', 'tls' ],
     *     service_products: [ 'dropbear ssh', 'openssl' ],
     *     scanned: true,
     *     source_ids: [ 1 ],
     *     eol_os: 0,
     *     eol_os_ext: 0,
     *     outlier_score: 2,
     *     outlier_raw: 101,
     *     sources: [ 'runZero' ],
     *     org_name: 'COompany',
     *     site_name: 'Primary',
     *     agent_name: 'DOCKERVM.DC.DOMAIN.COM',
     *     agent_external_ip: null,
     *     hosted_zone_name: null,
     *     subnets: {},
     *     foreign_attributes: {}
     *   }]>>}
     */
    getOrgAssets(orgId){
        return api.get("org/assets?_oid="+orgId)
            .then(d=>d.data)
    }

}

module.exports = new RunZero();