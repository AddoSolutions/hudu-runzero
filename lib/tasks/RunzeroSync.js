const Hudu = require("../providers/Hudu");
const RunZero = require("../providers/Runzero");
const moment = require("moment");

let deviceTypeMap = require("../../deviceTypeMap.js")

const arrayMeets = (array1, array2) => {
    return array1.map(e=>e.toLowerCase().trim()).filter(e=>e)
        .find(element => array2.filter(e=>e)
            .map(e=>e.toLowerCase().trim()).includes(element));
}

const formatDate = (date)=>{
    return moment.unix(date).format("YYYY-MM-DD")
}

const createRelation = (items) =>{
    return JSON.stringify(items.map(i=>{
        return {
            id: i.id,
            name: i.name,
            url: i.url,
        }
    }))
}


class RunZeroSync{


    async go(){


        //let assets = await Hudu.getAssets();
        await this.connectCompanies();


        for(var i in this.syncCompanies){
            await this.syncCompany(this.syncCompanies[i]);
        }

        let allComputers = await Hudu.getAssets({
            asset_layout_id: 1,
            page_size:1000
        });

        await this.cleanuoDattoConnections(allComputers);


    }

    async connectCompanies(){
        let hudu = await Hudu.getCompanies();
        let runzero = await RunZero.getOrgs();

        let sanitize = (name=>{
            return name.toLowerCase().trim().replace("the city of ","")
        })

        runzero.forEach(rzCompany=>{
            rzCompany.hudu = hudu.find(hu=>sanitize(hu.name) === sanitize(rzCompany.name))
        })

        return this.syncCompanies = runzero.filter(r=>r.hudu);

    }

    async syncCompany(company){

        console.log("Starting on company: "+company.name)

        let hudu = await Hudu.getAssets({
            company_id: company.hudu.id,
            page_size:1000
        });


        let path = `${__dirname}/cache/runzero/${moment().format("YYMMDD")}-${company.id}.json`
        let runzero;
        try{
            runzero = require(path);
        }catch(e){console.error(e)};
        if(!runzero) {
            runzero = await RunZero.getOrgAssets(company.id);
            require("fs").writeFileSync(path, JSON.stringify(runzero));
        }

        for(var i in runzero){
            await this.parseRunzeroAsset(runzero[i],hudu, company);
        }
        console.log("Done!")

    }

    async parseRunzeroAsset(asset,hudu,company){


        //console.log(asset)
        // First, what kind of asset is this
        let assetType = deviceTypeMap.find(t=>t.options.includes(asset.type))
        if(!asset.type || !asset.addresses[0] || asset.type=="Device") return;
        if(!assetType) {
            process.stdout.write(`[X?: ${asset.type}]`)
            return
        }
        assetType = assetType.id


        /*
         * Now, lets figure out a match
         */

        let filtered = hudu.filter(h=>h.asset_layout_id==assetType);
        //Check my RunZero ID
        let match = filtered.find(f=>f.values.runzero_id==asset.id);
        // Check by Mac Address

        //   Hudu,      | Datto | RunZero
        [
            ["mac_address","macAddress","macs"],
            ["ip_address","ipv4","addresses"],
        ].forEach(options=>{
            if(!match) match = filtered
                .filter(f=>f.values||f.cards.length)
                .find(f=>{
                    let huduValues = []
                    if(f.values[options[0]]) huduValues.push(...f.values[options[0]].split(", "))
                    let datto = f.cards.find(c=>c.integrator_id==2);
                    if(datto && datto.data.nics) huduValues.push(...datto.data.nics.map(n=>n[options[1]]));
                    return arrayMeets(asset[options[2]], huduValues)
                });
        })

        let datto
        if(match) datto = match.cards.find(c=>c.integrator_id==2);
        if(datto) datto = datto.data;
        else datto={}

        let matchValues = match?match.values:{};
        let switchNode = hudu.filter(h=>h.asset_layout_id==8 && h.values.ip_address)
            .find(nw=>nw.values.ip_address.split(", ").find(ip=>asset.attributes["switch.ip"]==ip));


        let user = "";
        if(datto.lastLoggedInUser){
            let username = datto.lastLoggedInUser.split("\\")[1]
            user = hudu.filter(h=>h.asset_layout_id==3 && h.primary_mail)
                .find(nw=>nw.primary_mail.toLowerCase().startsWith(username+"@"));
        }


        let assignValues = {
            make: matchValues.make || asset.newest_mac_vendor,
//            model:""
            runzero_id: asset.id,
            runzero_data: "<pre class=\"language-json\">"+JSON.stringify(asset, null, 2)+"</pre>",
            "switch": switchNode?createRelation([switchNode]):"",
            switch_port:`${asset.attributes["switch.port"]} (${asset.attributes["switch.name"]})`,
            ip_address: asset.addresses.join(", "),
            mac_address: asset.macs.join(", "),
            last_seen_active: formatDate(asset.last_seen),
            operating_system: datto.operatingSystem || asset.os,
            device_type: asset.type,
            hostname: asset.names[0],
            mac_age: formatDate((asset.newest_mac_age+"").substring(0,10)),
            user:user?createRelation([user]):"",
        }


        if(!match){
            match = {
                "asset_layout_id": assetType,
                "company_id": company.hudu.id,
                name: asset.names[asset.names.length-1]||asset.macs[0]||asset.addresses[0],
                values: {}
            }
        }
        match.name = datto.description || match.name;


        Object.assign(match.values, assignValues)

        let updateData = {
            "asset_layout_id": assetType,
            name: match.name,
            custom_fields: [match.values],
            //company_id: company.id,
        }
        if(match.id){
            await Hudu.updateAsset(company.hudu.id,match.id,updateData)
        }else{
            hudu.push(await Hudu.createAsset(company.hudu.id,updateData))
        }
        process.stdout.write(".");

        return;

    }

    async cleanuoDattoConnections(hudu){

        console.log("Doing Datto Cleanup")
        let assets = hudu.filter(h=>h.asset_layout_id==1 && h.cards[0]);
        for(var i in assets){

            let asset = assets[i];
            let datto = asset.cards.find(c=>c.integrator_id==2);
            if(datto) datto = datto.data;
            else continue


            let user = "";
            if(datto.lastLoggedInUser){
                let username = datto.lastLoggedInUser.split("\\")[1]
                user = hudu.filter(h=>h.asset_layout_id==3 && h.primary_mail)
                    .find(nw=>nw.primary_mail.toLowerCase().startsWith(username+"@"));
            }

            let updateRequest = {
                "asset_layout_id": asset.asset_layout_id,
                name: datto.description ||asset.name,
                custom_fields: [{
                    operating_system: datto.operatingSystem || asset.values.operating_system,
                    user:user?createRelation([user]):"",
                    ip_address: datto.nics?datto.nics.map(n=>n.ipv4).filter(n=>n).join(", "):datto.intIpAddress,
                    mac_address: datto.nics?datto.nics.map(n=>n.macAddress).filter(n=>n).join(", "):"",
                }]
            }
            await Hudu.updateAsset(asset.company_id,asset.id,updateRequest)

            process.stdout.write(".");
        }
    }

}

module.exports = RunZeroSync;