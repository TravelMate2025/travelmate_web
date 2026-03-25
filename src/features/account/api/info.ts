import api from "../../../api/services/api";

export class InfoProvider{
    static async getAboutDetails(){
        try{
            const res = await api.get("/about-us/")
            return res.data;
        }catch(err){
            throw err;
        }
    }
    static async getTermOfUse(){
        try{
            const res = await api.get("/terms-of-use/")
            return res.data;
        }catch(err){
            throw err;
        }
    }
    static async getPrivacyPolicy(){
        try{
            const res = await api.get("/privacy-policy/")
            return res.data;
        }catch(err){
            throw err;
        }
    }
}