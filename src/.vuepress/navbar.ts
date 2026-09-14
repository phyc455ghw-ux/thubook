import { navbar } from "vuepress-theme-hope";
import { rootNav, sectionGroups } from "./sections.js";

export default navbar([
  ...rootNav,
  ...sectionGroups,
  {
    text: "✏️贡献内容",
    link: "https://thubook.help/admin",
  },
]);
