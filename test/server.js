/**
 * @description jest server
 * @author kevinliao126
 */

const request = require('supertest')
const server = require('../src/app').callback()

module.exports = request(server)
