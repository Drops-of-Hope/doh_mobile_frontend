module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
    env: {
      production: {
        // Backstop: strip any stray console.* from production bundles.
        // console.error is kept so crashes remain observable (Sentry).
        plugins: [["transform-remove-console", { exclude: ["error"] }]],
      },
    },
  };
};
