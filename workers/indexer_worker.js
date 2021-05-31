const os = require("os")
const { MultiWorker: Worker } = require("node-resque")
const { redisConnection } = require("../config/node_resque.js")
const mainWorker = require("../worker.js") 

const jobs = {}

function IndexerWorker() {
  this.worker = new Worker(
    {
      connection: redisConnection,
      queues: ["indexer-raw-files"],
      minTaskProcessors: 1,
      maxTaskProcessor: os.cpus().length,
      checkTimeout: 1000,
    },
    jobs
  )
}

IndexerWorker.prototype = mainWorker;

module.exports = new IndexerWorker();
