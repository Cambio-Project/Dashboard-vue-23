import crypto from "crypto";
import { Event } from "~/server/models/event.model";

export default defineEventHandler(async (event) => {
	setResponseHeaders(event, {
		"Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
		"Access-Control-Allow-Origin": "*",
		'Access-Control-Allow-Credentials': 'true',
		"Access-Control-Allow-Headers": '*',
		"Access-Control-Expose-Headers": '*'
	});
	if (event.method === 'OPTIONS') {
		event.node.res.statusCode = 204
		event.node.res.statusMessage = "No Content."
		return 'OK'
	}

	var body = await readBody(event)
	console.log(body)
	//body = JSON.parse(body)

	/* if (typeof body.simulationID === "undefined" || body.fieldName === "undefined" || body.fieldValue === "undefined") {
		return {
			"success": false,
		}
	} */

	const simId = body.sim_id;
	const responseIndex = body.response_index
	const predicates = body.predicates

	console.log(simId);
	console.log(responseIndex);
	console.log(predicates);

	try {
		const scenario = await Scenario.findOne({ simulationID: simId });

		if (!scenario) {
			return {
				success: false,
				message: "Scenario not found",
			};
		}

		const responses = scenario.responses;
		responses[responseIndex].predicates_info = predicates;

		const updatedScenario = await Scenario.updateOne({ simulationID: simId }, {
			responses: responses,
		});

		console.log(updatedScenario)

	} catch (e) {
		console.log(e)
		return {
			"success": false,
			"message": "Error updating the entry"
		};
	}

	return {
		"success": true,
	};
})