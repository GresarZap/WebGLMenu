export function getArbolesData(numOfTrees) {
    let arboles = [];
    for (let i = 0; i < numOfTrees; i++) {
        let radius = 0.02 + parseFloat((Math.random() * 3 / 100).toFixed(5));
        let height = 1.1 + parseFloat((Math.random() * 5 / 10).toFixed(5));

        let degX = parseFloat((Math.random() * 360).toFixed(5));
        let degY = parseFloat((Math.random() * 360).toFixed(5));
        let degZ = parseFloat((Math.random() * 360).toFixed(5));

        let hojasX = parseFloat((Math.random() * 1.1).toFixed(5))+1;
        let hojasY = parseFloat((Math.random() * 1.1).toFixed(5))+1;
        let hojasZ = parseFloat((Math.random() * 1.1).toFixed(5))+1;

        arboles.push({ radius, height, degX, degY, degZ, copaX: hojasX, copaY: hojasY, copaZ: hojasZ });
    }

    console.log(arboles);
    return arboles;
}