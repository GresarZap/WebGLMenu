/***********************************************************************************/
/* Se define la geometría y se almacenan en los buffers de memoria y se renderiza. */
/***********************************************************************************/
export class Esfera3 {

    /* segmentosH = slices o longitud, segmentosV = stacks o latitud  */
    constructor(gl, radio, segmentosH, segmentosV) {

        let cantidadDeVertices = (segmentosH + 1) * (segmentosV + 1);
        this.cantidadDeIndices = segmentosH * segmentosV * 6;

        let i, j, k, x, y, z, theta_, phi_, k1, k2;

        /* Las coordenadas cartesianas (x, y, z) */
        let vertices = new Float32Array(cantidadDeVertices * 3);

        /* Indices */
        let indices = new Uint16Array(this.cantidadDeIndices);

        /* Los colores x c/vértice (r,g,b,a) */
        var colores = new Float32Array(cantidadDeVertices * 4);


        /* Considere a las Coordenadas Esféricas para los siguientes cálculos */

        /* Se leen los vertices y las normales */
        k = 0;
        let theta = 2 * Math.PI / segmentosH; // 1 vuelta    360/segmentosH
        let phi = Math.PI / segmentosV;       // 1/2 vuelta  180/segmentosV

        // latitud
        for (i = 0; i <= segmentosV; i++) {
            phi_ = i * phi - Math.PI / 2; // -90..90 grados

            // longitud
            for (j = 0; j <= segmentosH; j++) {
                theta_ = j * theta; // 0..360 grados
                x = radio * Math.cos(theta_) * Math.cos(phi_);
                y = radio * Math.sin(theta_) * Math.cos(phi_);
                z = radio * Math.sin(phi_);

                //console.log(" theta: " + toDegrees(theta_) + " phi: " + toDegrees(phi_));

                vertices[k++] = x;
                vertices[k++] = y;
                vertices[k++] = z;
            }
        }

        for (let i = 0; i < cantidadDeVertices; i++) {
            // ignoramos z e intensidad porque queremos blanco uniforme
            const r = 1.0;
            const g = 1.0;
            const b = 1.0;
            const a = 1.0;

            colores.set([r, g, b, a], i * 4);
        }



        /* Se leen los indices */

        /**
         *    k2 ------- k2+1
         *     |      /  | 
         *     |    /    |
         *     | /       |
         *    k1 ------- k1+1  
         *    k1---k2+1---k2   k1---k1+1---k2+1
         */
        k = 0;
        for (i = 0; i < segmentosV; i++) {
            k1 = i * (segmentosH + 1);      // inicio del actual segmentoV
            k2 = k1 + segmentosH + 1;       // inicio del siguiente segmentoV
            for (j = 0; j < segmentosH; j++) {
                indices[k++] = k1 + j;
                indices[k++] = k2 + j;
                indices[k++] = k1 + j + 1;

                indices[k++] = k1 + j + 1;
                indices[k++] = k2 + j;
                indices[k++] = k2 + j + 1;
            }
        }

        //console.log(vertices.length);
        //for (i = 0; i < vertices.length; i+=3) {
        //  console.log(i + " : " + vertices[i] + "  " + vertices[i+1] + "  " + vertices[i+2])
        //}
        //console.log(indices.length);
        //for (i = 0; i < indices.length; i+=6) {
        //  console.log(i + " : " + indices[i] + "  " + indices[i+1] + "  " + indices[i+2] + "  " + indices[i+3] + "  " + indices[i+4] + "  " + indices[i+5])
        //}

        this.esferaVAO = gl.createVertexArray();
        gl.bindVertexArray(this.esferaVAO);

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

    dibuja(gl, option) {
        gl.bindVertexArray(this.esferaVAO);
        if (option)
            gl.drawElements(gl.TRIANGLES, this.cantidadDeIndices, gl.UNSIGNED_SHORT, 0);
        else
            gl.drawElements(gl.LINES, this.cantidadDeIndices, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}