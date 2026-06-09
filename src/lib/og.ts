import fs from "fs";
import path from "path";
import { DATA } from "@/data/resume";

export async function getFontData() {
    try {
        const cabinetGroteskPath = path.join(process.cwd(), "public/fonts/CabinetGrotesk-Medium.ttf");
        const clashDisplayPath = path.join(process.cwd(), "public/fonts/ClashDisplay-Semibold.ttf");

        const cabinetGrotesk = fs.readFileSync(cabinetGroteskPath);
        const clashDisplay = fs.readFileSync(clashDisplayPath);

        return { cabinetGrotesk, clashDisplay };
    } catch (error) {
        console.error("Failed to load fonts from filesystem:", error);
        return null;
    }
}

export function getAvatarDataUrl() {
    try {
        const avatarPath = DATA.avatarUrl;
        if (avatarPath && avatarPath.startsWith("/")) {
            const filePath = path.join(process.cwd(), "public", avatarPath);
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                const ext = path.extname(avatarPath).substring(1) || "png";
                const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
                return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
            }
        }
        return DATA.avatarUrl ? new URL(DATA.avatarUrl, DATA.url).toString() : undefined;
    } catch (error) {
        console.error("Failed to load avatar from filesystem:", error);
        return undefined;
    }
}
