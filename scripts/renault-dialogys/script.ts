import documentTree from "./Clio/documents/tree.json";
import documentSubTree from "./Clio/documents/subtree.json";
import fs from "fs/promises";

const PRs: string[] = [];
const MRs: string[] = [];
const MDs: string[] = [];

const nodes = [...documentTree.nodes, ...documentSubTree.nodes];

// process json nodes to receive all MR ids
for (const node of nodes) {
  if (node.idsDocumentsByType) {
    if (node.idsDocumentsByType.MR) {
      MRs.push(...node.idsDocumentsByType.MR);
    }
    if (node.idsDocumentsByType.PR) {
      PRs.push(...node.idsDocumentsByType.PR);
    }
    if (node.idsDocumentsByType.MD) {
      for (const key in node.idsDocumentsByType.MD) {
        MDs.push(...node.idsDocumentsByType.MD[key]);
      }
    }
  }
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const cleanPRs = PRs.filter(onlyUnique).filter((v) => v !== "");
const cleanMRs = MRs.filter(onlyUnique).filter((v) => v !== "");
const cleanMDs = MDs.filter(onlyUnique).filter((v) => v !== "");

console.log({ cleanPRs, cleanMRs, cleanMDs });

// const context = {
//   userContext: {
//     language: "en",
//     countryReferenceLanguage: "GB",
//     substitutionLanguage: "en",
//     countryReferenceLanguageSubstitution: "GB",
//     countryCode: "HR",
//     userProfiles: ["Reseau_et_importateur"],
//   },
//   carContext: {
//     vin: "",
//     registrationNumber: null,
//     millesim: "20020",
//     bin: null,
//     fixedCriterias: {
//       "106": "SCCHBA",
//       "120": "SERIE",
//       "121": "DRA",
//       "122": "DRAP15",
//       "123": "HARM02",
//       "127": "SSATAR",
//       "141": "OV727",
//       "142": "ROUGF",
//       "143": "BANAL",
//       "219": "SAN219",
//       "224": "SSDECA",
//       "228": "APEL01",
//       "247": "SAN247",
//       "253": "SABLAV",
//       "270": "SSPTPR",
//       "271": "SSNODP",
//       "272": "SPRGPL",
//       "284": "SSPSCS",
//       "291": "SAN291",
//       "319": "COFIXE",
//       "336": "APL03",
//       "341": "SAILAR",
//       "376": "JANTO1",
//       "408": "SSNAV",
//       "425": "SRADIO",
//       "427": "BVM5",
//       "497": "RNORM",
//       "513": "SAN513",
//       "555": "TLBALK",
//       "581": "SAN581",
//       "582": "SAN582",
//       "583": "SAN583",
//       "613": "SAN613",
//       "801": "EU00",
//       "808": "BCNTC",
//       "900": "PE2002",
//       "901": "PHAS4",
//       "913": "SAN913",
//       "970": "VEC035",
//       "971": "X064BI",
//       "996": "989",
//       "997": "JB1",
//       "998": "702",
//       "999": "D7F",
//       "074": "SSCPE",
//       "078": "RETROR",
//       "038": "DM",
//       "082": "SPROJA",
//       "042": "SSABS",
//       APV001: "APV001_F",
//       "001": "TWI",
//       APV002: "APV002_F",
//       "046": "CHAUFO",
//       APV003: "APV003_S",
//       "007": "X06",
//       "008": "C06",
//       "091": "SANCAV",
//       "050": "TN",
//       "095": "SANCL",
//       "013": "E1",
//       "059": "VT",
//       "018": "M8",
//       "019": "ESS",
//       "067": "SPRTEL",
//       "024": "BUPDEF",
//       "025": "FRA",
//       "026": "BALK",
//       "027": "DG",
//     },
//     variableCriterias: {
//       APVDT1: "2003-11-12",
//       APVNM1: "FA77064",
//       APVNM2: "F393003",
//       APVNM3: "S069073",
//     },
//     contextBLMS: { dataCrit: {}, dataCritVar: {} },
//     tapv: "C068",
//     families: {
//       familyEngine: ["DXX"],
//       familyBattery: [""],
//       familyVehicle: ["X06"],
//       familyGearbox: ["JBX"],
//     },
//     extraFamilies: {
//       "007G": "JBX",
//       "007E": "DXX",
//       "007V": "X06",
//       "007B": "",
//     },
//     brandComputed: "APL03",
//     ageComputed: 21,
//     typeMD: "B2",
//     bvmExtraFields: {
//       customerDeliveryDate: "2003-12-22",
//       marqCom: "RENAULT",
//       ligne3P12: "OV727  DRAP15 HARM02",
//       ligne4P12: "TLBALK ACFK   MRTV",
//       marqCon: "RENAULT",
//       calibrInj: "SOFT365849",
//       refBoi: "7701700526",
//       marqDis: "RENAULT",
//       refInj: "8200326391",
//       ligne2P12: "E1     SAN913 SAN513",
//       paysImmat: "HR",
//       refMot: "7701709452",
//       marqFab: "RENAULT",
//     },
//     motorisation: "D7F ENGINE TYPE",
//     color: "OV727",
//     model: "Twingo I (C06)",
//     urlImage: "https://cdn.asdh.aws.renault.com/carStickers/twingo1.png",
//   },
// };
const context = {
  userContext: {
    language: "en",
    countryReferenceLanguage: "GB",
    substitutionLanguage: "en",
    countryReferenceLanguageSubstitution: "GB",
    countryCode: "HR",
    userProfiles: ["Reseau_et_importateur"],
  },
  carContext: {
    vin: "",
    registrationNumber: "BH142KG",
    millesim: "19980",
    bin: null,
    fixedCriterias: {
      "102": "SADAC",
      "106": "SCCHBA",
      "120": "SERIE",
      "121": "DRA",
      "122": "DRAP05",
      "123": "HARM01",
      "127": "SSATAR",
      "132": "SAN132",
      "133": "FBANAR",
      "141": "NV432",
      "142": "METYL",
      "143": "BANAL",
      "146": "KM",
      "166": "CTMOT",
      "177": "SCDISC",
      "185": "PTCAV",
      "218": "EMBNOR",
      "222": "PHAN02",
      "223": "SSETPN",
      "224": "DECA03",
      "253": "SABLAV",
      "266": "SSETDP",
      "271": "NODP02",
      "273": "SCHPED",
      "284": "SSPSCS",
      "291": "SAN291",
      "301": "SUSNOR",
      "302": "RENTC",
      "306": "LVAVEL",
      "317": "SGSCHA",
      "319": "CORHLO",
      "323": "SNAVIG",
      "336": "APL03",
      "342": "SMONEQ",
      "343": "SRUNLI",
      "349": "SLAVPH",
      "357": "VOLRH",
      "376": "JANALU",
      "377": "SNIVDO",
      "387": "SSETAP",
      "393": "PARITA",
      "403": "MOCY06",
      "404": "ETCB04",
      "405": "CMAR3P",
      "406": "PROJDO",
      "411": "ABPA01",
      "412": "SFIPOU",
      "420": "ABCO01",
      "425": "SRADIO",
      "427": "BVM5",
      "513": "SAN513",
      "545": "ANTID",
      "570": "SAN570",
      "577": "SAN577",
      "578": "SAN578",
      "579": "SAN579",
      "580": "SAN580",
      "581": "SAN581",
      "582": "SAN582",
      "650": "SINCTQ",
      "715": "SAN715",
      "801": "EU96",
      "808": "BCTC",
      "900": "PE1998",
      "901": "PHAS1",
      "913": "TED",
      "964": "3TEC2 1,4+",
      "996": "958",
      "997": "JB1",
      "998": "712",
      "999": "K4J",
      "074": "CPETIR",
      "078": "RETROR",
      "035": "CPLN",
      "038": "DA",
      "082": "PROJAB",
      "042": "SSABS",
      APV001: "APV001_W",
      "001": "CL2",
      "089": "CUSFIX",
      APV002: "APV002_D",
      "046": "CA",
      APV003: "APV003_S",
      "007": "X65",
      "008": "C65",
      "050": "TN",
      "095": "SANCL",
      "013": "ES2",
      "059": "VT",
      "018": "ML",
      "019": "ESS",
      "026": "ITAL",
      "027": "DG",
      "029": "TEMP",
    },
    variableCriterias: {
      APVDT1: "1999-11-11",
      APVNM1: "W002073",
      APVDT2: "1999-11-09",
      APVNM2: "D004773",
      APVNM3: "S003834",
    },
    contextBLMS: { dataCrit: {}, dataCritVar: {} },
    tapv: "CB0L",
    families: {
      familyEngine: ["KXX"],
      familyBattery: [""],
      familyVehicle: ["X65"],
      familyGearbox: ["JBX"],
    },
    extraFamilies: { "007G": "JBX", "007E": "KXX", "007V": "X65", "007B": "" },
    brandComputed: "APL03",
    ageComputed: 25,
    typeMD: "B2",
    bvmExtraFields: {
      marqDis: "RENAULT",
      customerDeliveryDate: "2000-01-27",
      marqCom: "RENAULT",
      ligne3P12: "NV432  DRAP05 HARM01",
      ligne4P12: "4/    ACGK   NRTV",
      marqCon: "RENAULT",
      ligne2P12: "ES2    TED    SAN513",
      paysImmat: "IT",
      refMot: "7701698467",
      marqFab: "RENAULT",
      refBoi: "7701667437",
    },
    motorisation: "K4J ENGINE TYPE",
    color: "NV432",
    model: "Clio II / Lutecia II (C65)",
    urlImage: "https://cdn.asdh.aws.renault.com/carStickers/clio2.png",
  },
};

async function fetchMR() {
  const body = {
    ...context,
    documentsId: cleanMRs,
  };

  let offset = 0;

  let MR: any = undefined;

  while (true) {
    const resp = await fetch(
      `https://opeeu.ppx.opeeu.asdh.aws.renault.com/newdialogys/rest/proxy/apidh/rest/repairManuals/?offset=${offset}&limit=${
        offset + 200
      }`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,hr;q=0.8",
          authorization: "Bearer ",
          "cache-control": "no-cache",
          "content-type": "application/json; charset=UTF-8",
          "furtive-latch": "6f69aec02Aa483a79EC8739a04e0a388",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://newdialogys.renault.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify(body),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    ).then((r) => r.json());

    if (!MR) {
      MR = resp;
    } else {
      MR.MR = [...MR.MR, ...resp.MR];
    }
    if (resp.next_url) {
      offset += 200;
    } else {
      break;
    }
  }

  await fs.writeFile("Clio/documents/MR.json", JSON.stringify(MR, null, 2));
}

async function fetchMD() {
  const body = {
    ...context,
    MD: cleanMDs,
  };

  let offset = 0;

  let MD: any = undefined;

  while (true) {
    const resp = await fetch(
      `https://opeeu.ppx.opeeu.asdh.aws.renault.com/newdialogys/rest/proxy/apidh/rest/diagnosticManuals/borneo2/?offset=${offset}&limit=${
        offset + 200
      }`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,hr;q=0.8",
          authorization: "Bearer ",
          "cache-control": "no-cache",
          "content-type": "application/json; charset=UTF-8",
          "furtive-latch": "6f69aec02Aa483a79EC8739a04e0a388",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://newdialogys.renault.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify(body),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    ).then((r) => r.json());
    console.log(resp);

    if (!MD) {
      MD = resp;
    } else {
      MD.MD = [...MD.MD, ...resp.MD];
    }
    if (resp.next_url) {
      offset += 200;
    } else {
      break;
    }
  }

  await fs.writeFile("Clio/documents/MD.json", JSON.stringify(MD, null, 2));
}

async function fetchPR() {
  const body = {
    ...context,
    partFilter: "ALLPARTS",
    documentsId: cleanPRs,
  };

  let offset = 0;

  let PR: any = undefined;

  while (true) {
    const resp = await fetch(
      `https://opeeu.ppx.opeeu.asdh.aws.renault.com/newdialogys/rest/proxy/apidh/rest/v1/plates2/?offset=${offset}&limit=${
        offset + 200
      }`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,hr;q=0.8",
          authorization: "Bearer ",
          "cache-control": "no-cache",
          "content-type": "application/json; charset=UTF-8",
          "furtive-latch": "6f69aec02Aa483a79EC8739a04e0a388",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrer: "https://newdialogys.renault.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify(body),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    ).then((r) => r.json());
    console.log(resp);

    if (!PR) {
      PR = resp;
    } else {
      PR.plates = [...PR.plates, ...resp.plates];
    }
    if (resp.next_url) {
      offset += 200;
    } else {
      break;
    }
  }

  await fs.writeFile("Clio/documents/PR.json", JSON.stringify(PR, null, 2));
}

fetchPR();
fetchMD();
fetchMR();
