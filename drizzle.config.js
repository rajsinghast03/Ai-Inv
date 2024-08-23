/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:zjqC2ZrTV5kA@ep-purple-glade-a1gt6pu5.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
};
