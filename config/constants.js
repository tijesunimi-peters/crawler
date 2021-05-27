const path = require("path")

const PROJECT_ROOT = path.resolve(__dirname, "..")
const SEEDER_DIR = path.join(PROJECT_ROOT, "seed")
const DOMAINS_FILENAME = process.env.NODE_ENV == "production" ? "domains.csv" : "domains-dev.csv"
const LOG_FILE = path.join(PROJECT_ROOT, "log", "development.log")
const CRAWLER_DIR = path.join(PROJECT_ROOT, "crawler")
const PAGE_DOCUMENTS_DIR = path.join(PROJECT_ROOT, "pages")

const MANIFEST_FILE = path.join(PROJECT_ROOT, "manifest.txt")

module.exports = {
  SEEDER_DIR, DOMAINS_FILENAME, PROJECT_ROOT, LOG_FILE, CRAWLER_DIR, PAGE_DOCUMENTS_DIR, MANIFEST_FILE
}

