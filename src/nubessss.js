export function getDataNubes(numOfClouds) {
    let nubes = [];
    for (let i = 0; i < numOfClouds; i++) {
        let x = 0.02 + parseFloat((Math.random() * 3 / 100).toFixed(5));
        let y = 1.1 + parseFloat((Math.random() * 5 / 10).toFixed(5));
        let z = 0.02 + parseFloat((Math.random() * 3 / 100).toFixed(5));
        let degX = parseFloat((Math.random() * 360).toFixed(5));
        let degY = parseFloat((Math.random() * 360).toFixed(5));
        let degZ = parseFloat((Math.random() * 360).toFixed(5));
        nubes.push({ radius, height, degX, degY, degZ });
    }
    return nubes;
}