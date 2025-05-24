/***********************************************************************************/
/* Se define la geometría y se almacenan en los buffers de memoria y se renderiza. */
/***********************************************************************************/
export class Cubo {
    constructor(gl) {

        /**
         *       3 --------- 2
         *       /|        /|   
         *      / |       / |
         *    7 --------- 6 |
         *     |  |      |  |
         *     | 0 ------|-- 1 
         *     | /       | /
         *     |/        |/
         *    4 --------- 5  
         */

        /* Las coordenadas cartesianas (x, y, z) */
        var vertices = [
            // Frente
            -1, -1, 1, // 4   0
            1, -1, 1, // 5   1
            1, 1, 1, // 6   2
            -1, 1, 1, // 7   3
            // Atrás
            -1, 1, -1, // 3   4
            1, 1, -1, // 2   5
            1, -1, -1, // 1   6
            -1, -1, -1, // 0   7
            // Izquierda
            -1, -1, -1, // 0   8
            -1, -1, 1, // 4   9
            -1, 1, 1, // 7  10 
            -1, 1, -1, // 3  11
            // Derecha
            1, -1, 1, // 5  12 
            1, -1, -1, // 1  13
            1, 1, -1, // 2  14
            1, 1, 1, // 6  15
            // Abajo
            -1, -1, -1, // 0  16
            1, -1, -1, // 1  17
            1, -1, 1, // 5  18
            -1, -1, 1, // 4  19
            // Arriba
            -1, 1, 1, // 7  20
            1, 1, 1, // 6  21
            1, 1, -1, // 2  22
            -1, 1, -1  // 3  23
        ];

        /* Los colores x c/vértice (r,g,b,a) */
        var colores = [
            // Frente - lila
            1, 0, 1, 1, // 4   0
            1, 0, 1, 1, // 5   1
            1, 0, 1, 1, // 6   2
            1, 0, 1, 1, // 7   3	
            // Atrás - amarillo
            1, 1, 0, 1, // 3   4	
            1, 1, 0, 1, // 2   5
            1, 1, 0, 1, // 1   6	
            1, 1, 0, 1, // 0   7	
            // Izquierda - celeste
            0, 1, 1, 1, // 0   8
            0, 1, 1, 1, // 4   9
            0, 1, 1, 1, // 7  10
            0, 1, 1, 1, // 3  11
            // Derecha - rojo
            1, 0, 0, 1, // 5  12
            1, 0, 0, 1, // 1  13
            1, 0, 0, 1, // 2  14
            1, 0, 0, 1, // 6  15
            // Abajo - azul
            0, 0, 1, 1, // 0  16
            0, 0, 1, 1, // 1  17
            0, 0, 1, 1, // 5  18
            0, 0, 1, 1, // 4  19
            // Arriba - verde
            0, 1, 0, 1, // 7  20
            0, 1, 0, 1, // 6  21
            0, 1, 0, 1, // 2  22
            0, 1, 0, 1  // 3  23
        ];

        /* Indices */
        var indices = [
            0, 1, 2, 0, 2, 3, // Frente
            4, 5, 6, 4, 6, 7, // Atrás
            8, 9, 10, 8, 10, 11, // Izquierda 
            12, 13, 14, 12, 14, 15, // Derecha
            16, 17, 18, 16, 18, 19, // Abajo
            20, 21, 22, 20, 22, 23  // Arriba
        ];

        this.cuboVAO = gl.createVertexArray();
        gl.bindVertexArray(this.cuboVAO);

        var codigoVertices = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, codigoVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        var codigoColores = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, codigoColores);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colores), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

        var codigoDeIndices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, codigoDeIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    setToSolid(gl) {
        var indices = [
            0, 1, 2, 0, 2, 3, // Frente
            4, 5, 6, 4, 6, 7, // Atrás
            8, 9, 10, 8, 10, 11, // Izquierda 
            12, 13, 14, 12, 14, 15, // Derecha
            16, 17, 18, 16, 18, 19, // Abajo
            20, 21, 22, 20, 22, 23  // Arriba
        ];

        gl.bindVertexArray(this.cuboVAO);

        let codigoDeIndices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, codigoDeIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    setToLines(gl) {
        /**
         *       3 --------- 2
         *       /|        /|   
         *      / |       / |
         *    7 --------- 6 |
         *     |  |      |  |
         *     | 0 ------|-- 1 
         *     | /       | /
         *     |/        |/
         *    4 --------- 5  
         */
        // Derecha - rojo
        // 1, 0, 0, 1, // 5  12
        // 1, 0, 0, 1, // 1  13
        // 1, 0, 0, 1, // 2  14
        // 1, 0, 0, 1, // 6  15
        let indicesLineas = [
            0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0,       // Frente
            4, 5, 5, 6, 6, 4, 4, 6, 6, 7, 7, 4,      // Atrás
            8, 9, 9, 10, 10, 8, 8, 10, 10, 11, 11, 8,     // Izquierda
            12, 13, 13, 14, 14, 12, 12, 14, 14, 15, 15, 12, // Derecha
            16, 17, 17, 18, 18, 16, 16, 18, 18, 19, 19, 16, // Abajo
            20, 21, 21, 22, 22, 20, 20, 22, 22, 23, 23, 20  // Arriba
        ];

        gl.bindVertexArray(this.cuboVAO);
        let codigoDeIndices = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, codigoDeIndices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesLineas), gl.STATIC_DRAW);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    dibuja(gl, option) {
        gl.bindVertexArray(this.cuboVAO);
        if (option)
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        else
            gl.drawElements(gl.LINES, 72, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}