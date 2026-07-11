import api from "../../../api/services/api";

export class InfoProvider{
    static async getAboutDetails(){
        const res = await api.get("/about-us/")
        return res.data;
    }
    static async getTermOfUse(){
        const res = await api.get("/terms-of-use/")
        return res.data;
    }
    static async getPrivacyPolicy(){
        const res = await api.get("/privacy-policy/")
        return res.data;
    }
}