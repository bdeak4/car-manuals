import tree from "./Clio/wiring/tree.json";
import harness from "./Clio/wiring/harness.json";
import documents from "./Clio/wiring/documents.json";
import fs from "fs/promises";
const base = "./Clio/wiring";
const cap = true;

const parentPaths = {};

type IFile = {
  id: string;
  filename: string;
  path: string;
};

async function main() {
  for (const node of tree.nodes) {
    for (const cnode of node.childNodes) {
      for (const ccnode of cnode.childNodes) {
        const path = `${base}/${node.label}/${cnode.label}/${ccnode.label}`;

        const docs = ccnode.associatedDocument.map((doc) => ({
          id: doc.ids[0],
          filename: doc.ids[0].replaceAll("/", "_"),
          path: doc.urlVignette.replace("_THUMB.PNG", cap ? ".PDF" : ".pdf"),
        }));

        await fs.mkdir(path, { recursive: true });
        await fs.writeFile(
          `${path}/links.json`,
          JSON.stringify({ DOC: docs }, null, 2)
        );
      }
    }
  }

  const PART_HARNESS: IFile[] = [];
  const GROUND_HARNESS: IFile[] = [];

  for (const doc of harness.WIRING_DIAGRAMS) {
    const file = {
      id: doc.id,
      filename: doc.id.replaceAll("/", "_"),
      path: doc.thumbnailLocation.replace("_THUMB.PNG", cap ? ".PDF" : ".pdf"),
    };

    (doc.subType === "PART_HARNESS" ? PART_HARNESS : GROUND_HARNESS).push(file);
  }

  await fs.mkdir(`${base}/WIRING_DIAGRAMS/PART_HARNESS`, { recursive: true });
  await fs.writeFile(
    `${base}/WIRING_DIAGRAMS/PART_HARNESS/links.json`,
    JSON.stringify({ DOC: PART_HARNESS }, null, 2)
  );

  await fs.mkdir(`${base}/WIRING_DIAGRAMS/GROUND_HARNESS`, { recursive: true });
  await fs.writeFile(
    `${base}/WIRING_DIAGRAMS/GROUND_HARNESS/links.json`,
    JSON.stringify({ DOC: GROUND_HARNESS }, null, 2)
  );

  const DOCUMENTS: IFile[] = [];
  for (const doc of documents.WIRING_DIAGRAMS) {
    const file = {
      id: doc.id,
      filename: doc.location.split("/").pop() || "",
      path: doc.location,
    };
    DOCUMENTS.push(file);
  }
  await fs.mkdir(`${base}/WIRING_DIAGRAMS/DOCUMENTS`, { recursive: true });
  await fs.writeFile(
    `${base}/WIRING_DIAGRAMS/DOCUMENTS/links.json`,
    JSON.stringify({ DOC: DOCUMENTS }, null, 2)
  );
}
main();
