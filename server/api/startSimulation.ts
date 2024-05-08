import {exportStimuli} from "~/server/utils/exportStimuli";
import {appendExistingFile} from "~/server/utils/appendExistingFile";
import {exportJsonAsFile} from "~/server/utils/appendJsonAsFile";

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const simulationID = JSON.parse(body).simulationID

    const scenario = await Scenario.findOne({simulationID: simulationID})

    const architectureArray = scenario!.environment!.architecture;
    const experimentArray = scenario!.environment!.experiment;
    const loadArray = scenario!.environment!.load;

    const formData = new FormData();

    await exportStimuli(formData, "mtls", scenario)

    for (const architecture of architectureArray) {
        const architectureName = Object.keys(architecture)[0]
        const architectureContent = architecture[architectureName]
        await exportJsonAsFile(formData, "architectures", architectureName, architectureContent)
    }

    for (const experiment of experimentArray) {
        const experimentName = Object.keys(experiment)[0]
        const experimentContent = experiment[experimentName]
        await exportJsonAsFile(formData, "experiments", experimentName, experimentContent)
    }

    for (const load of loadArray) {
        const loadName = Object.keys(load)[0]
        await appendExistingFile(formData, "loads", loadName, "./uploaded/")
    }

    formData.append("simulation_id", simulationID)

    const config = useRuntimeConfig(event)
    const miSimResponse = await fetch("http://" + config.public.miSimDomain + ":" + config.public.miSimPort + "/simulate/upload", {
        method: "POST",
        body: formData
    });

    const resText = await miSimResponse.text()
    return {
        "simulationID": simulationID,
        "status": resText,
    };
})
