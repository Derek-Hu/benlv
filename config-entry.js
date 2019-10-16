module.exports = [
  {
    // 入口JS 文件
    entry: "src/entry/resources.js",
    // 对应的HTML模板
    template: "public/index.html",
    // 生成的访问路径
    outPath: "/public/resources.html"
  },
  {
    // 入口JS 文件
    entry: "src/entry/diff.js",
    // 对应的HTML模板
    template: "public/diff.html",
    // 生成的访问路径
    outPath: "/public/diff.html"
  },
  {
    entry: "src/entry/form-compare.js",
    template: "public/diff.html",
    outPath: "/public/diff.html"
  },
  {
    entry: "src/entry/classic.js",
    outPath: "/public/classic.html"
  }
];
