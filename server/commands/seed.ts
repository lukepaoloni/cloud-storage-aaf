import {
  loadConnection,
  setConnection,
  runSeed,
  loadEntityFactories,
  loadSeeds
} from "typeorm-seeding";
const seedsPath = `src/database/seeds`;
const factoryPath = `src/database/factories`;

const run = async () => {
  let factoryFiles = undefined;
  let seedFiles = undefined;
  try {
    factoryFiles = await loadEntityFactories(factoryPath);
    seedFiles = await loadSeeds(seedsPath);
    const connection = await loadConnection();
    setConnection(connection);
  } catch (err) {
    console.error(err);
  }

  for (const seedFile of seedFiles) {
    try {
      let className = seedFile.split("/")[seedFile.split("/").length - 1];
      className = className.replace(".ts", "").replace(".js", "");
      className = className.split("-")[className.split("-").length - 1];
      console.log(seedFile);
      const seedFileObject = require(seedFile);
      await runSeed(seedFileObject[className]);
    } catch (err) {
      console.log(seedFile);
      console.error(err);
      process.exit(1);
    }
  }

  console.log("Finished seeding.");
  process.exit(0);
};

run();
