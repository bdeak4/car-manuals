import tree from "./Twingo/documents/tree.json";
import subtree from "./Twingo/documents/subtree.json";
import fs from "fs/promises";
import MD from "./Twingo/documents/MD.json";
import MR from "./Twingo/documents/MR.json";
import PR from "./Twingo/documents/PR.json";
const base = "./Twingo/documents";

const parentPaths = {};

type IFile = {
  id: string;
  filename: string;
  path: string;
};

async function main() {
  for (const node of tree.nodes) {
    const path = `${base}/${node.rang} - ${node.label}`;
    await fs.mkdir(path, { recursive: true });
    parentPaths[node.nodeId] = path;

    const images: IFile[] = [];
    if (node.urlExplodedView) {
      images.push({
        id: "exploded-view",
        filename: `exploded-view.${node.urlExplodedView.split(".").pop()}`,
        path: node.urlExplodedView,
      });
    }
    // if (node.urlVignette) {
    //   images.push({
    //     id: "vignette",
    //     filename: `vignette.${node.urlVignette.split(".").pop()}`,
    //     path: node.urlVignette,
    //   });
    // }
    // TODO
    await fs.writeFile(
      `${path}/links.json`,
      JSON.stringify({ IMG: images }, null, 2)
    );
  }

  for (const node of subtree.nodes) {
    const path = `${parentPaths[node.codeParent]}/${node.rang} - ${node.label}`;
    await fs.mkdir(path, { recursive: true });
    parentPaths[node.nodeId] = path;

    for (const cnode of node.childNodes) {
      const path = `${parentPaths[cnode.codeParent]}/${cnode.rang} - ${
        cnode.label
      }`;
      await fs.mkdir(path, { recursive: true });
      parentPaths[cnode.nodeId] = path;

      const PRs: string[] = [];
      const MRs: string[] = [];
      const MDs: string[] = [];

      if (cnode.idsDocumentsByType) {
        if (cnode.idsDocumentsByType.MR) {
          MRs.push(...cnode.idsDocumentsByType.MR);
        }
        if (cnode.idsDocumentsByType.PR) {
          PRs.push(...cnode.idsDocumentsByType.PR);
        }
        if (cnode.idsDocumentsByType.MD) {
          for (const key in cnode.idsDocumentsByType.MD) {
            MDs.push(...cnode.idsDocumentsByType.MD[key]);
          }
        }
      }

      function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
      }

      const cleanPRs = PRs.filter(onlyUnique).filter((v) => v !== "");
      const cleanMRs = MRs.filter(onlyUnique).filter((v) => v !== "");
      const cleanMDs = MDs.filter(onlyUnique).filter((v) => v !== "");

      const mappedPRs: IFile[] = cleanPRs
        .map((v) => {
          const meta = PR.plates.find((plate) => plate.id === v);
          if (!meta) return undefined;
          return {
            id: meta.id,
            filename: `${meta.id}.svg`,
            path: meta.pictureUrl,
          };
        })
        .filter((v) => v !== undefined);
      const mappedMRs: IFile[] = cleanMRs
        .map((v) => {
          const meta = MR.MR.find((m) => m.id === v);
          if (!meta) return undefined;
          return {
            id: meta.id,
            filename:
              meta.designation.replace("/", "") +
              "." +
              meta.contentPath.split(".").pop(),
            path: "https://cdn.asdh.aws.renault.com/" + meta.contentPath,
          };
        })
        .filter((v) => v !== undefined);
      const mappedMDs: IFile[] = cleanMDs
        .map((v) => {
          const meta = MD.MD.find((m) => m.id === v);
          if (!meta) return undefined;
          return {
            id: meta.id,
            filename: meta.designation.replace("/", "") + ".pdf",
            path:
              "https://cdn.asdh.aws.renault.com/SIE/MD_B2/Content/EN/" +
              meta.ref +
              ".pdf",
          };
        })
        .filter((v) => v !== undefined);

      const images: IFile[] = [];
      // if (node.urlExplodedView) {
      //   images.push({
      //     id: "exploded-view",
      //     filename: `exploded-view.${node.urlExplodedView.split(".").pop()}`,
      //     path: node.urlExplodedView,
      //   });
      // }
      if (node.urlVignette) {
        images.push({
          id: "vignette",
          filename: `vignette.${node.urlVignette.split(".").pop()}`,
          path: node.urlVignette,
        });
      }

      await fs.writeFile(
        `${path}/links.json`,
        JSON.stringify(
          { PR: mappedPRs, MR: mappedMRs, MD: mappedMDs, IMG: images },
          null,
          2
        )
      );

      // console.log(cnode.label, cleanPRs, cleanMRs, cleanMDs);
    }
  }
}
main();
