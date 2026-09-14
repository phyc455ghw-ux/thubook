import { sidebar } from "vuepress-theme-hope";
import { rootNav, sectionGroups } from "./sections.js";

export default sidebar({
  "/": [...rootNav, ...sectionGroups],
});
