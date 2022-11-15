require("dotenv").config()
let RunzeroSync = require("./lib/tasks/RunzeroSync")
let RunZero = require("./lib/providers/Runzero")
let Hudu = require("./lib/providers/Hudu")
let cron = require("node-cron")

class HuduPull{

    async go(){
        await Hudu.generateDumbFieldTypesToGangerserOnes()


        //let t = await Hudu.getAssetLayouts();

        /*

        let hudu = await Hudu.getAssets({
            company_id: 12,
            page_size:1000
        });

        Hudu.gayIfy(hudu)

         */

        let r = new RunzeroSync();
        await r.go();

        if(process.env.CRON_SCHEDULE){
            console.log("Setting schedule for: "+process.env.CRON_SCHEDULE)
            cron.schedule(process.env.CRON_SCHEDULE, ()=>{
                r.go();
            })
        }
    }

}


(new HuduPull()).go();