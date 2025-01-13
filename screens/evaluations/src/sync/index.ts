import { fetchSamba } from './smb';
import fs from 'fs';
import { rewriteHTML } from './html';



export async function sync(serverIp: string, smbPath: string, convPath: string, htmlPath: string) {
    const syncWorked = await fetchSamba(serverIp, smbPath);
    if (!syncWorked) {
        return;
    }
    await rewriteHTML(smbPath, convPath);
    if (fs.existsSync(htmlPath)) {
        await fs.promises.rm(htmlPath, { recursive: true });
    }
    await fs.promises.mkdir(htmlPath, { recursive: true });
    await fs.promises.cp(convPath, htmlPath, { recursive: true });
}
