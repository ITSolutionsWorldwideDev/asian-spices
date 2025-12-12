// apps/admin/postcss.config.mjs
export default {
  plugins: {
    "postcss-import": {},
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
// export default function (ctx) {
//   const isScss = ctx.file?.basename?.endsWith(".scss"); // detect SCSS
//   return {
//     plugins: {
//       ...(isScss ? {} : { 
//         "postcss-import": {},
//         "@tailwindcss/postcss": {},
//         autoprefixer: {},
//       }),
//     },
//   };
// }
// export default {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };
