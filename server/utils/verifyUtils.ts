import {Predicate} from "~/models/predicate";
import {MeasurementPoint} from "~/models/measurement-point";
import {ResponseSpecification} from "~/models/response-specification";

export const getMeasurementPointsFromPredicates = (predicates: Predicate[]) => {
    return predicates.map(predicate => {
        const measurementPoint: MeasurementPoint = {
            measurement_column: predicate.measurement_source,
            measurement_name: predicate.measurement_source,
        };
        return measurementPoint;
    });
}

export const sendVerificationRequest = async (responseSepcification: ResponseSpecification, TBVERIFIER_URL: string) => {
    const formdata = new FormData();
    formdata.append("formula_json", JSON.stringify(responseSepcification));
    const requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
    };
    const response = await fetch(TBVERIFIER_URL, requestOptions);

    // Result
    const verificationResult = await response.json();
    return verificationResult.result === 'True';
}
