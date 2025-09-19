const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const ebClient = new EventBridgeClient({ region: process.env.AWS_REGION || "us-east-1" });
const EVENT_BUS = process.env.EVENT_BUS_NAME || "default";

async function publishUserCreatedEvent({ userId, email, username }) {
	const entry = {
		Source: "barterly.auth",
		DetailType: "User.Created",
		Detail: JSON.stringify({ userId, email, username }),
		EventBusName: EVENT_BUS,
	};
	const cmd = new PutEventsCommand({ Entries: [entry] });
	const res = await ebClient.send(cmd);
	if (res.FailedEntryCount && res.FailedEntryCount > 0) {
		throw new Error("EventBridge failed to publish user created event");
	}
	return res;
}

module.exports = { publishUserCreatedEvent };
