export function getFloresData(numOfFlowers) {
    let arboles = [];
    for (let i = 0; i < numOfFlowers; i++) {
        let degX = parseFloat((Math.random() * 360).toFixed(5));
        let degY = parseFloat((Math.random() * 360).toFixed(5));
        let degZ = parseFloat((Math.random() * 360).toFixed(5));

        let hojasX = parseFloat((Math.random() * 1.1).toFixed(5))+1;
        let hojasY = parseFloat((Math.random() * 1.1).toFixed(5))+1;
        let hojasZ = parseFloat((Math.random() * 1.1).toFixed(5))+1;

        arboles.push({degX, degY, degZ, copaX: hojasX, copaY: hojasY, copaZ: hojasZ });
    }

    console.log(arboles);
    return arboles;
}