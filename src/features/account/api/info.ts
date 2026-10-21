import api from "../../../api/services/api";

export interface Partner {
    id: number;
    name: string;
    logo: string | null;
    description: string;
    website: string | null;
    category: number;
    is_active: boolean;
}

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
    // Real, live, public endpoint (UserPartnerViewSet, AllowAny) -- filtered
    // to is_active on the backend already. `category` matches the model's
    // CATEGORY_CHOICES slugs: "stay" | "airline" | "car_rental".
    static async getPartners(category?: "stay" | "airline" | "car_rental"): Promise<Partner[]> {
        const res = await api.get("/partners/", { params: category ? { category } : {} });
        return res.data;
    }
}