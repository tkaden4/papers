import React from "react";
import slash from "slash";
import path from "path";

import Search from "./pages/Search";
import manifest from "../papers/manifest.json";

export const paperName = paper => path.basename(paper.ref, ".pdf");

export const normalizePaper = paper => {
  let ref = paper.url ? path.basename(paper.url) : path.basename(slash(paper.file));
  let newPaper = { ...paper, ref };
  return { ...newPaper, name: paperName(newPaper)};
};

export default () => <Search initialPapers={manifest.papers.map(normalizePaper)} />;
