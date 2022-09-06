const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const {
  authorizationFunction,
  authorizationFunctionProposer,
} = require("./authorization");

require("dotenv").config();

fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org");

const sendTx = async () => {
  const transactionId = await fcl
    .send([
      fcl.transaction`
    transaction(number: Int, greeting: String) {
        prepare(signer: AuthAccount) {
        }
        execute {}
    }
    `,
      fcl.args([fcl.arg(1, t.Int), fcl.arg("Hello", t.String)]),
      fcl.proposer(authorizationFunction),
      fcl.payer(authorizationFunction),
      fcl.authorizations([authorizationFunction]),
      fcl.limit(9999),
    ])
    .then(fcl.decode);

  console.log(transactionId);
};

sendTx();
