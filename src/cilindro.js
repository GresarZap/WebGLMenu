/***********************************************************************************/
/* Se define la geometría y se almacenan en los buffers de memoria y se renderiza. */
/***********************************************************************************/
export class Cilindro {

    /* segmentosH = slices o longitud, segmentosV = stacks o latitud  */
    constructor(gl, radio, alto, cantidadDeSectores, arriba, abajo) {

        var i, j, kv, kc, ki, angulo, x, y;

        var cantidadDeVertices = 4 * cantidadDeSectores + 6;
        var cantidadDeTriangulos = 2 * cantidadDeSectores;

        if (arriba) {
            cantidadDeTriangulos += cantidadDeSectores;
        }

        if (abajo) {
            cantidadDeTriangulos += cantidadDeSectores;
        }
        this.cantidadDeIndices = cantidadDeTriangulos * 3;

        /* Las coordenadas cartesianas (x, y, z) */
        var vertices = new Float32Array(cantidadDeVertices * 3);

        /* Los colores x c/vértice (r,g,b,a) */
        var colores = new Float32Array(cantidadDeVertices * 4);

        /* Indices */
        var indices = new Uint16Array(this.cantidadDeIndices);

        /* Se leen los vertices */
        kv = 0;
        kc = 0;
        var anguloDelSector = 2 * Math.PI / cantidadDeSectores; // 1 vuelta (en radianes)/cantidad de sectores

        // Circulo de arriba y abajo
        for (i = 0; i <= cantidadDeSectores; i++) {
            angulo = i * anguloDelSector;

            x = Math.cos(angulo);
            y = Math.sin(angulo);

            vertices[kv++] = radio * x;
            vertices[kv++] = radio * y;
            vertices[kv++] = -alto / 2;

            let ruido = Math.random() * 0.1 - 0.05;
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.4 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.25 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.1 + ruido));
            colores[kc++] = 1.0;

            // colores[kc++] = 1;
            // colores[kc++] = 0;
            // colores[kc++] = 0;
            // colores[kc++] = 1;

            vertices[kv++] = radio * x;
            vertices[kv++] = radio * y;
            vertices[kv++] = alto / 2;

            ruido = Math.random() * 0.1 - 0.05;
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.4 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.25 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.1 + ruido));
            colores[kc++] = 1.0;

            // colores[kc++] = 1;
            // colores[kc++] = 0;
            // colores[kc++] = 0;
            // colores[kc++] = 1;
        }

        /* Se leen los indices */

        /**
         *    1 ------- 3
         *     |     / | 
         *     |   /   |
         *     | /     |
         *    0 ------- 2
         *    0,2,3, 0,3,1     =>  6 indices
         */
        ki = 0
        for (i = 0, j = 0; j < cantidadDeSectores; i += 2, j++) {
            indices[ki++] = i;
            indices[ki++] = i + 2;
            indices[ki++] = i + 3;
            indices[ki++] = i;
            indices[ki++] = i + 3;
            indices[ki++] = i + 1;
        }

        if (arriba) {
            // centro
            let p, p1, nv;
            p = kv / 3;
            vertices[kv++] = 0;
            vertices[kv++] = 0;
            vertices[kv++] = alto / 2;

            let ruido = Math.random() * 0.1 - 0.05;
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.4 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.25 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.1 + ruido));
            colores[kc++] = 1.0;

            // colores[kc++] = 0;
            // colores[kc++] = 1;
            // colores[kc++] = 0;
            // colores[kc++] = 1;

            p1 = kv / 3;

            // Circulo de arriba
            for (i = 1, j = 0; j <= cantidadDeSectores; i += 2, j++) {
                nv = i * 3;
                vertices[kv++] = vertices[nv];
                vertices[kv++] = vertices[nv + 1];
                vertices[kv++] = vertices[nv + 2];

                let ruido = Math.random() * 0.1 - 0.05;
                colores[kc++] = Math.min(1.0, Math.max(0.0, 0.4 + ruido));
                colores[kc++] = Math.min(1.0, Math.max(0.0, 0.25 + ruido));
                colores[kc++] = Math.min(1.0, Math.max(0.0, 0.1 + ruido));
                colores[kc++] = 1.0;

                // colores[kc++] = 0;
                // colores[kc++] = 1;
                // colores[kc++] = 0;
                // colores[kc++] = 1;
            }

            /**
             *             1
             *           / | 
             *         /   |
             *       /     |
             *    p ------- 1
             *    p,1,3  =>  3  indices
             */
            for (j = 0; j < cantidadDeSectores; j++) {
                indices[ki++] = p;       // p
                indices[ki++] = p1;      // 0
                indices[ki++] = p1 + 1;    // 1
                p1++;
            }
        }

        if (abajo) {
            // centro
            let p, p1, nv;
            p = kv / 3;
            vertices[kv++] = 0;
            vertices[kv++] = 0;
            vertices[kv++] = -alto / 2;

            // colores[kc++] = 0;
            // colores[kc++] = 1;
            // colores[kc++] = 0;
            // colores[kc++] = 1;

            let ruido = Math.random() * 0.1 - 0.05;
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.4 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.25 + ruido));
            colores[kc++] = Math.min(1.0, Math.max(0.0, 0.1 + ruido));
            colores[kc++] = 1.0;

            p1 = kv / 3;

            // Circulo de abajo
            for (i = 0, j = 0; j <= cantidadDeSectores; i += 2, j++) {
                nv = i * 3;
                vertices[kv++] = vertices[nv];
                vertices[kv++] = vertices[nv + 1];
                vertices[kv++] = vertices[nv + 2];

                // colores[kc++] = 0;
                // colores[kc++] = 1;
                // colores[kc++] = 0;
                // colores[kc++] = 1;
                let ruido = Math.random() * 0.1 - 0.05;
                colores[kc++] = Math.min(1.0, Math.max(0.0, 0.4 + ruido));
                colores[kc++] = Math.min(1.0, Math.max(0.0, 0.25 + ruido));
                colores[kc++] = Math.min(1.0, Math.max(0.0, 0.1 + ruido));
                colores[kc++] = 1.0;
            }

            /**
             *             1
             *           / | 
             *         /   |
             *       /     |
             *    p ------- 0
             *    p,0,2  =>  3  indices
             */

            for (j = 0; j < cantidadDeSectores; j++) {
                indices[ki++] = p;
                indices[ki++] = p1;
                indices[ki++] = p1 + 1;
                p1++;
            }
        }

        this.cilindroVAO = gl.createVertexArray();
        gl.bindVertexArray(this.cilindroVAO);

        var verticeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        var codigoColores = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, codigoColores);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colores), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

        var indiceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    dibuja(gl, option) {
        gl.bindVertexArray(this.cilindroVAO);
        if(option)
            gl.drawElements(gl.TRIANGLES, this.cantidadDeIndices, gl.UNSIGNED_SHORT, 0);
        else
            gl.drawElements(gl.LINES, this.cantidadDeIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}