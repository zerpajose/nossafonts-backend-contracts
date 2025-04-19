const { PinataSDK } = require("pinata")
require("dotenv").config()

export function pinataClient() {
  return new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.GATEWAY_URL
  });
}
