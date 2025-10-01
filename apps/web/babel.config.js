export default {
  presets: [
    ["@babel/preset-env", { targets: { esmodules: true }, modules: false }],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
        development: process.env.NODE_ENV !== "production",
      },
    ],
    "@babel/preset-typescript",
  ],
};
