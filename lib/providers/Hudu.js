let Axios = require("axios")
const queryString = require('query-string');
const {snakeCase} = require("change-case")

let api = Axios.create({
    baseURL: process.env.HUDU_URL,
    headers:{
        "x-api-key": process.env.HUDU_KEY
    }
})


class Hudu{

    /**
     *
     * @param params {
     *     "company_id ","id ","name ","primary_serial ","asset_layout_id ","page ","archived ","page_size "
     * }
     * @returns {Promise<AxiosResponse<[{
     *       id: 300,
     *       company_id: 8,
     *       asset_layout_id: 1,
     *       slug: 'front1-c16b45998f19',
     *       name: 'FRONT1',
     *       company_name: 'The City of Middleburg Heights',
     *       object_type: 'Asset',
     *       asset_type: 'Computer assets',
     *       archived: false,
     *       url: 'http://docs.addo.dev/a/front1-c16b45998f19',
     *       created_at: '2022-11-11T21:13:09.457Z',
     *       updated_at: '2022-11-11T21:13:09.470Z',
     *       fields: [],
     *       cards: [{
     *         id: 41,
     *         integrator_id: 2,
     *         integrator_name: 'dattormm',
     *         link: 'http://docs.addo.dev/a/pack-room-pc-5d8b843612c0',
     *         primary_field: null,
     *         data: {
     *           id: 3227983,
     *         }
 *           }]
     *     }]>>}
     */
    async getAssets(params){
        let t = await api.get("assets?"+queryString.stringify(params))
        return this.gangersterIfy(t.data.assets)
    }

    getCompanies(params){
        return api.get("companies?"+queryString.stringify(params))
            .catch(e=>console.error(e,e.response.data, e.response.headers))
            .then(d=>d.data.companies)
    }

    getAssetLayouts(params){
        return api.get("asset_layouts/"+queryString.stringify(params))
            .catch(e=>console.error(e,e.response.data, e.response.headers))
            .then(d=>d.data.asset_layouts)
    }

    getAssetLayout(id){
        return api.get("asset_layouts/"+id)
            .catch(e=>console.error(e,e.response.data, e.response.headers))
            .then(d=>d.data.asset_layout)
    }

    createAsset(company,asset){
        return api.post(`companies/${company}/assets`, {asset})
            .catch(e=>console.error(e,e.response.data, e.response.headers))
            .then(d=>this.gangersterIfy(d.data.asset))
    }

    updateAsset(company,assetId,asset){
        return api.put(`companies/${company}/assets/${assetId}`, {asset})
            .catch(e=>console.error(e,e.response.data, e.response.headers))
            .then(d=>this.gangersterIfy(d.data.asset))
    }


    async generateGayFieldTypesToGangerserOnes(){
        let layouts = this.layouts = await this.getAssetLayouts();
        layouts.forEach(layout=>{
            layout.fields.forEach(field=>{
                field.slug=snakeCase(field.label.toLowerCase());
            })
        })
    }

    gangersterIfy(record){
        if(Array.isArray(record)) return record.map(this.gangersterIfy.bind(this));
        let layout = this.layouts.find(l=>l.id==record.asset_layout_id);
        record.values = {};
        layout.fields.forEach(field=>{
            record.values[field.slug] = (record.fields.find(f=>f.label===field.label)||{}).value
        })
        return record;
    }

    gayIfy(record){
        if(Array.isArray(record)) return record.map(this.gayIfy.bind(this));
        let layout = this.layouts.find(l=>l.id==record.asset_layout_id);
        let i = 0;
        record.fields = []
        layout.fields.forEach(field=>{
            record.fields.push({
                id: field.id,
                value: record.values[field.slug],
                label: field.label,
                position: field.position
            });
            record.apifields.push({
                asset_layout_field_id: field.id,
                value: record.values[field.slug],
            });
            i++
        })
        return record;

    }



}

module.exports = new Hudu();