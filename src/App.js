import React from "react";

import Search from "./pages/Search";
import manifest from "../papers/manifest.json";

export default () => <Search initialPapers={manifest.papers} />;
