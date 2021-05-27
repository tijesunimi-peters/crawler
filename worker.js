const os = require("os")
const { redisConnection } = require("./config/node_resque.js")
let { MultiWorker: Worker } = require("node-resque")
const jobs = require("./jobs/index.js")

function MainWorker() {
  this.worker = new Worker(
    {
      connection: redisConnection,
      queues: ["domain-files", "domains", "page-writer"],
      minTaskProcessors: 1,
      maxTaskProcessor: os.cpus().length,
      checkTimeout: 1000,
    },
    jobs
  )

  function onStart(workerId) {
    console.log(`[Worker ${workerId}]: Started`)
  }

  function onEnd(workerId) {
    console.log(`[Worker ${workerId}]: Ended`)
  }

  function onPoll(workerId, queue) {
    console.log(`[Worker ${workerId}]: Polling @ `, queue)
  }

  function onSuccess(workerId, queue, job, result) {
    console.log(`[Worker ${workerId}]: Job successfull - ${JSON.stringify(job)} >> ${result}`)
  }

  function onFailure(workerId, queue, job, result) {
    console.log(`[Worker ${workerId}]: Job failed - ${JSON.stringify(job)} >> ${result}`)
  }
  
  function onError(workerId, queue, job, result) {
    console.log(`[Worker ${workerId}]: Job error - ${JSON.stringify(job)} >> ${result}`)
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
