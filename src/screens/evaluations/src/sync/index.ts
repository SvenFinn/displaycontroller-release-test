import { fetchSamba } from './smb';
import fs from 'fs';
import { rewriteHTML } from './html';

const htmlPath = `${__dirname}/../html`;
const smbPath = `${__dirname}/../tmp/smb`;
const convPath = `${__dirname}/../tmp/conv`;

async function main() {
    if (!process.env.SMB_SERVER) {
        console.error("Missing environment variables");
        process.exit(1);
    }
    const syncWorked = await fetchSamba(process.env.SMB_SERVER, smbPath);
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

main();
setInterval(main, 1000 * 60); // Run every minute