import { JSDOM } from "jsdom";
import fs from "fs";
import { logger } from "dc-logger";

export async function rewriteHTML(inputBase: string, outputBase: string) {
    logger.info(`Rewriting HTML files from ${inputBase} to ${outputBase}`);
    await rewriteHTMLRecursive(inputBase, outputBase);
}

async function rewriteHTMLRecursive(inputBase: string, outputBase: string, folder: string = "") {
    if (fs.existsSync(`${outputBase}/${folder}`)) {
        fs.rmSync(`${outputBase}/${folder}`, { recursive: true });
    }
    fs.mkdirSync(`${outputBase}/${folder}`, { recursive: true });
    const folderContents = fs.readdirSync(`${inputBase}/${folder}`);
    for (let i = 0; i < folderContents.length; i++) {
        const content = folderContents[i];
        if (fs.lstatSync(`${inputBase}/${folder}/${content}`).isDirectory()) {
            logger.debug(`Recursing into ${inputBase}/${folder}/${content}`);
            await rewriteHTMLRecursive(inputBase, outputBase, `${folder}/${content}`);
        } else {
            logger.debug(`Rewriting ${inputBase}/${folder}/${content}`);
            await rewriteHTMLFile(`${inputBase}/${folder}/${content}`, `${outputBase}/${folder}/${content}`);
        }
    }
}

async function rewriteHTMLFile(inputFName: string, outputFName: string): Promise<void> {
    const dom = new JSDOM(fs.readFileSync(inputFName).toString());

    // Remove images
    const images = dom.window.document.querySelectorAll("img");
    for (let i = 0; i < images.length; i++) {
        images[i].remove();
    }

    // Remove empty tds
    const tds = dom.window.document.querySelectorAll("td");
    for (let i = 0; i < tds.length; i++) {
        if (tds[i].innerHTML.length === 0) {
            tds[i].remove();
        }
    }

    // Remove empty trs
    const trs = dom.window.document.querySelectorAll("tr");
    for (let i = 0; i < trs.length; i++) {
        if (trs[i].innerHTML.length === 0) {
            trs[i].remove();
        }
    }

    // Remove notice about qualification
    const hr = dom.window.document.querySelectorAll("hr");
    for (let i = 0; i < hr.length; i++) {
        const prev = hr[i].previousSibling;
        if (prev != null) {
            while (prev.nextSibling != null) {
                prev.nextSibling.remove();
            }
        }
    }

    const body = dom.window.document.querySelector("body");
    if (body != null) {
        body.style.fontSize = "1.667vh";
        body.style.overflow = "hidden";
        body.style.userSelect = "none";
    }

    // Pin credits table to bottom
    const creditsTable = dom.window.document.querySelector<HTMLTableElement>("table:last-of-type");
    if (creditsTable != null) {
        creditsTable.style.position = "absolute";
        creditsTable.style.bottom = "0";
        creditsTable.style.left = "0";
        creditsTable.style.right = "0";
        creditsTable.style.width = "100%";
        creditsTable.style.backgroundColor = "#FFFFFF";
        creditsTable.style.paddingTop = "5px";
        const creditsTableCols = creditsTable.querySelectorAll("td");
        creditsTableCols[0].style.float = "left";
        creditsTableCols[1].style.float = "right";
        creditsTableCols[0].style.textAlign = "left";
        creditsTableCols[1].style.textAlign = "right";

    }

    // Set evaluation name
    const evaluationName = dom.window.document.querySelector("table.resultStatus tr:last-of-type td:first-of-type");
    if (evaluationName != null) {
        const evaluationNameRaw: string = evaluationName.innerHTML;
        const evaluationNameText = evaluationNameRaw.trim().split(/[ -]/g).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
        const infoTable = dom.window.document.querySelector("table:first-of-type");
        const nameRow = dom.window.document.createElement("tr");
        const nameCol = dom.window.document.createElement("td");
        nameCol.style.textAlign = "center";
        nameCol.style.fontSize = "130%";
        nameCol.style.fontWeight = "bold";
        nameCol.innerHTML = evaluationNameText;
        nameRow.appendChild(nameCol);
        infoTable?.firstElementChild?.firstElementChild?.after(nameRow);
        const nameTable = dom.window.document.querySelector("table.resultStatus");
        if (nameTable != null) {
            nameTable.remove();
        }
    }

    // Remove SNr, PNr, ID, Bemerkung from result table
    const resultTable = dom.window.document.querySelector("table.result");
    const colsToRemove = ["SNr", "PNr", "ID", "Bemerkung"].map((col) => col.toUpperCase());
    if (resultTable != null) {
        const heading = resultTable.querySelector("tr");
        if (heading != null) {
            for (let i = 0; i < colsToRemove.length; i++) {
                let index = 0;
                const headings = heading.querySelectorAll("th");
                for (let g = 0; g < headings.length; g++) {
                    if (colsToRemove[i] == headings[g].innerHTML.toUpperCase()) {
                        headings[g].remove();
                        break;
                    }
                    index = index + headings[g].colSpan;
                }
                const rows = resultTable.querySelectorAll("tr");
                for (let i = 1; i < rows.length; i++) {
                    const cols = rows[i].querySelectorAll("td");
                    if (cols.length > index) {
                        cols[index].remove();
                    }
                }
            }
        }
    }

    // Export file
    const htmlText = dom.serialize()
    fs.writeFileSync(outputFName, htmlText);
}