const os = require("os")
const { redisConnection, redis } = require("./config/node_resque.js")
let { MultiWorker: Worker, Queue } = require("node-resque")
const jobs = require("./jobs/index.js")
const logger = require("./config/logger.js")

function MainWorker() {
  this.worker = new Worker(
    {
      connection: redisConnection,
      queues: ["domain-files", "domains", "page-writer"],
      minTaskProcessors: 1,
      maxTaskProcessor: os.cpus().length,
      checkTimeout: 1000,
      name: "MainWorker",
    },
    jobs
  )

  async function onStart(workerId) {
    try {
      await redis.hset("workers-switch", workerId, 1, function(err) {
        logger.error(err);
        logger.log(`[Worker ${workerId}]: Started`)
      });
    } catch(err) {
      logger.error(err)
    }
  }

  async function onEnd(workerId) {
    try {
      await redis.hset("workers-switch", workerId, 0);
      await redis.hvals("workers-switch", function(err, switches) {
        if(Array.isArray(switches)) {
          let childWorkers = switches.slice(1).map(x => parseInt(x, 10)) 
          let all_on = childWorkers.slice(1).reduce((acc, val) => acc | val, childWorkers[0])
          if(!all_on) {
            redis.rpush("indexer-switch", 1);
          } else {
            redis.rpush("indexer-switch", 0);
          }
        }
      })
    } catch(err) {
      logger.error(err)
    }

    logger.log(`[Worker ${workerId}]: Ended`)
  }

  function onPoll(workerId, queue) {
    // logger.log(`[Worker ${workerId}]: Polling @ `, queue)
  }

  function onSuccess(workerId, queue, job, result) {
    let outJson = {...job, args: job.args[0]}
    logger.log(`[Worker ${workerId}]: Job successfull - ${JSON.stringify(outJson)} >> ${result}`)
  }

  function onFailure(workerId, queue, job, result) {
    let outJson = {...job, args: job.args[0]}
    logger.log(`[Worker ${workerId}]: Job failed - ${JSON.stringify(outJson)} >> ${result}`)
  }
  
  function onError(workerId, queue, job, result) {
    let outJson = {...job, args: job.args[0]}
    logger.log(`[Worker ${workerId}]: Job error - ${JSON.stringify(outJson)} >> ${result}`)
  }

 this.worker.on("start", onStart)
 this.worker.on("end", onEnd)
 this.worker.on("poll", onPoll)
 this.worker.on("success", onSuccess)
 this.worker.on("failure", onFailure)
 this.worker.on("error", onError)

  this.boot = function() {
    this.worker.start();
  }

  this.boot = this.boot.bind(this)
}

module.exports = new MainWorker();
