function mapToJson(map) {
    return JSON.stringify([...map]);
}

function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}

export { mapToJson, jsonToMap };
