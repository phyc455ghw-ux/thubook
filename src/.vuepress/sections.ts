import { existsSync, readFileSync, readdirSync } from "node:fs";
import { path } from "@vuepress/utils";

export interface NavItem {
  text: string;
  link: string;
}

export interface NavGroup {
  text: string;
  collapsible?: boolean;
  children: NavItem[];
}

const srcDir = path.resolve(__dirname, "..");

interface CuratedEntry {
  /** 相对 src/ 的文件路径（POSIX 风格），link 默认由它生成 */
  rel: string;
  text: string;
  /** 仅在需要绕开默认 `/${rel}` 时提供（如首页沿用历史写法 README.md） */
  link?: string;
}

// CMS（Decap）对纯中文标题生成的文件名是 12 位十六进制 ID（如 ec09661eb52d.md），
// 且跨栏目重存文章时会删除旧拼音文件。精选表只登记"展示名与顺序"，
// 其余文件由下方扫描逻辑自动追加，保证 CMS 新增内容必然出现在导航里。

const rootCurated: CuratedEntry[] = [
  { rel: "README.md", text: "🍺THU手册", link: "README.md" },
  { rel: "words.md", text: "📕新生词典" },
  { rel: "newstudent.md", text: "😀新生指南" },
  { rel: "f06fa5f6479a.md", text: "新生常见问题" },
  { rel: "jiqiao.md", text: "😋校园技巧" },
  { rel: "phones.md", text: "☎️常用电话" },
  { rel: "websites.md", text: "🌐常用网址" },
  { rel: "gzh.md", text: "🍀公众号收录" },
  { rel: "mythu.md", text: "✌🏽️我的THU" },
  { rel: "thustory.md", text: "🎓毕业生故事" },
  { rel: "log.md", text: "📜更新日志" },
];

const topicCurated: CuratedEntry[] = [
  { rel: "专题/xiaoli.md", text: "清华校历" },
  { rel: "专题/time.md", text: "上课时间" },
  { rel: "专题/thugpa.md", text: "清华GPA" },
  { rel: "专题/2896bf7e2e9f.md", text: "体育课与体测" },
  { rel: "专题/f9699c1ecc74.md", text: "专业与院系简称" },
  { rel: "专题/thuculture.md", text: "清华梗词典" },
  { rel: "专题/lib.md", text: "图书馆" },
  { rel: "专题/zixi.md", text: "自习地点" },
  { rel: "专题/xuanke.md", text: "选课" },
  { rel: "专题/junxun.md", text: "军训" },
  { rel: "专题/yyfj.md", text: "入学分级考试" },
  { rel: "专题/xinshenggugan.md", text: "新生骨干" },
  { rel: "专题/dance.md", text: "新生舞会" },
  { rel: "专题/id.md", text: "班号与学号" },
  { rel: "专题/qianhukou.md", text: "迁户口问题" },
  { rel: "专题/xyk.md", text: "校园卡" },
  { rel: "专题/jiaoxuelou.md", text: "教学楼" },
  { rel: "专题/jiaotong.md", text: "交通" },
  { rel: "专题/kuaidi.md", text: "快递" },
  { rel: "专题/srt.md", text: "SRT" },
  { rel: "专题/erzhao.md", text: "学堂班二招" },
  { rel: "专题/zhiyuanzhe.md", text: "志愿者" },
  { rel: "专题/jiangxuejin.md", text: "奖学金" },
  { rel: "专题/hwjh.md", text: "海外交换项目" },
  { rel: "专题/qgzx.md", text: "经济资助及勤工助学" },
  { rel: "专题/exit.md", text: "休学与退学" },
  { rel: "专题/shetuan.md", text: "社团" },
  { rel: "专题/chuguo.md", text: "出国留学" },
  { rel: "专题/fuxiu.md", text: "辅修" },
  { rel: "专题/zzy.md", text: "转专业" },
  { rel: "专题/zszn.md", text: "本科招生指南" },
  { rel: "专题/ec09661eb52d.md", text: "台灣新生專區" },
  { rel: "专题/ed06289b8b6f.md", text: "预约亲友入校" },
];

const facilityCurated: CuratedEntry[] = [
  { rel: "校内生活设施/chaoshi.md", text: "🛒超市" },
  { rel: "校内生活设施/buybook.md", text: "📚书店" },
  { rel: "校内生活设施/kafei.md", text: "☕咖啡奶茶" },
  { rel: "校内生活设施/sm.md", text: "🛠️数码维修" },
  { rel: "校内生活设施/dayin.md", text: "🖨️打印店" },
  { rel: "校内生活设施/yd.md", text: "💊药店" },
  { rel: "校内生活设施/xiyifang.md", text: "🧺洗衣房" },
  { rel: "校内生活设施/xiuche.md", text: "🚲修车铺" },
  { rel: "校内生活设施/youju.md", text: "🏣邮局" },
  { rel: "校内生活设施/yinhang.md", text: "🏦银行" },
  { rel: "校内生活设施/zhaoxiang.md", text: "📷照相馆" },
  { rel: "校内生活设施/lifa.md", text: "👶🏻理发" },
  { rel: "校内生活设施/yanjing.md", text: "👓眼镜店" },
  { rel: "校内生活设施/c81cb0f753ae.md", text: "🛏️宿舍" },
  { rel: "校内生活设施/26d27ea33233.md", text: "⚽运动场所" },
  { rel: "校内生活设施/食堂.md", text: "🍚食堂" },
  { rel: "校内生活设施/857b3346955c.md", text: "🏥校医院" },
  { rel: "校内生活设施/155d2a7a6580.md", text: "🥤自动贩卖机" },
];

const laoxiangCurated: CuratedEntry[] = [
  { rel: "老乡在清华/hunan.md", text: "湖南" },
];

const otherCurated: CuratedEntry[] = [
  { rel: "其他/lvyou.md", text: "北京游玩指南" },
  { rel: "其他/park.md", text: "北京公园推荐" },
];

const curatedSections: { dir: string; entries: CuratedEntry[] }[] = [
  { dir: "专题", entries: topicCurated },
  { dir: "校内生活设施", entries: facilityCurated },
  { dir: "老乡在清华", entries: laoxiangCurated },
  { dir: "其他", entries: otherCurated },
];

const allCurated = [
  ...rootCurated,
  ...curatedSections.flatMap(({ entries }) => entries),
];

const missing = allCurated.filter(
  (entry) => !existsSync(path.resolve(srcDir, ...entry.rel.split("/"))),
);
if (missing.length > 0) {
  throw new Error(
    `导航精选表指向不存在的文件（CMS 可能又移动了文件，请同步更新 sections.ts）: ${missing
      .map(({ rel }) => rel)
      .join(", ")}`,
  );
}

// 精选表覆盖过的文件不再被自动扫描追加，避免重复条目
const consumed = new Set(allCurated.map(({ rel }) => rel));

const firstHeading = (rel: string): string => {
  const content = readFileSync(path.resolve(srcDir, ...rel.split("/")), "utf-8");
  const match = content.match(/^#\s+(.+?)\s*$/m);
  return match
    ? match[1].replace(/[*_`]/g, "").trim()
    : rel.split("/").pop()!.replace(/\.md$/, "");
};

const toNavItem = ({ rel, text, link }: CuratedEntry): NavItem => ({
  text,
  link: link ?? `/${rel}`,
});

const autoItems = (dir: string): NavItem[] =>
  readdirSync(path.resolve(srcDir, dir), { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isFile() && dirent.name.endsWith(".md") && !consumed.has(`${dir}/${dirent.name}`),
    )
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((name) => {
      const rel = `${dir}/${name}`;
      return { text: firstHeading(rel), link: `/${rel}` };
    });

export const rootNav: NavItem[] = [
  ...rootCurated.map(toNavItem),
  ...readdirSync(srcDir, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isFile() && dirent.name.endsWith(".md") && !consumed.has(dirent.name),
    )
    .map((dirent) => dirent.name)
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
    .map((name) => ({ text: firstHeading(name), link: `/${name}` })),
];

export const sectionGroups: NavGroup[] = curatedSections.map(({ dir, entries }) => ({
  text: dir,
  collapsible: true,
  children: [...entries.map(toNavItem), ...autoItems(dir)],
}));
