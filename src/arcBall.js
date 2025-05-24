import { Vector3 } from './vector3.js';
import {Cuaternion} from './cuaternion.js';
/***************************************************************************/
/* ArcBall: Obtiene los vectores U y V de la esfera (x^2 + y^2 + z^2 = 1). */
/***************************************************************************/

var Punto2f = function (x, y) {
    // Atributos publicos
    this.x = x;
    this.y = y;
}

export class ArcBall {

    /**
     * Construye un nuevo ArcBall.
     */
    constructor(w, h) {
        this.Epsilon = 1.0e-5;
        this.U = new Vector3();
        this.V = new Vector3();
        this.ajusta(w, h);
    }

    /* Ajusta el ancho y alto de la ventana */
    ajusta(w, h) {
        if (!((w > 1.0) && (h > 1.0)))
            document.write("ERROR");

        /* Ajusta el factor para el ancho y alto (2 = [-1..1]) */
        this.ajustaAncho = 2.0 / (w - 1.0);
        this.ajustaAlto = 2.0 / (h - 1.0);
    }

    /* Obtiene el vector dado un punto (x,y) */
    obtieneVector(vector, x, y) {
        /* Copia punto */
        let temp = new Punto2f(x, y);

        /* Ajusta las coordenadas del punto al rango [-1..1] */
        temp.x = (temp.x * this.ajustaAncho) - 1.0;
        temp.y = 1.0 - (temp.y * this.ajustaAlto);

        /* Calcula el cuadrado de la longitud del vector */
        let longitud2 = (temp.x * temp.x) + (temp.y * temp.y);

        /* 
         * Considerando que: radio^2 = x^2 + y^2 + z^2
         * ¿Cuales son los valores de x, y y z?
         * 
         * Si el punto está fuera de la esfera... (longitud2 > 1)
         */

        if (longitud2 > 1.0) {
            /* Calcula un factor de normalización (radio / sqrt(longitud2)) */
            let norma = (1.0 / Math.sqrt(longitud2));

            /* Retorna el vector "normalizado", un punto sobre la esfera */
            vector.x = temp.x * norma;
            vector.y = temp.y * norma;
            vector.z = 0.0;
        } else { /* e.o.c. está dentro */
            /*
             * Retorna un vector, un punto dentro la esfera 
             * z = sqrt(radio^cuadrado - (x^2 + y^2))
             */
            vector.x = temp.x;
            vector.y = temp.y;
            vector.z = Math.sqrt(1.0 - longitud2);
        }
    }

    /* Obtiene el vector U */
    primerPunto(x, y) {
        this.obtieneVector(this.U, x, y);
    }

    /* Obtiene el Cuaternion de U y V */
    segundoPunto(x, y) {

        let q = new Cuaternion();

        /* Obtiene el vector V */
        this.obtieneVector(this.V, x, y);

        /* Retorna el cuaternión equivalente a la rotación. */
        if (q != null) {

            /* Calcula la Normal = U x V */
            let Normal = this.U.producto_vectorial(this.V);

            /* Calcula la longitud de la normal */
            if (Normal.longitud() > this.Epsilon) { /* si no es cero */
                q.x = Normal.x;
                q.y = Normal.y;
                q.z = Normal.z;
                /* w  = (theta / 2), donde theta es el ángulo de rotación */
                q.w = this.U.producto_escalar(this.V);
            } else { /* si es cero */
                /* U y V coinciden */
                q.x = q.y = q.z = q.w = 0.0;
            }
        }
        return q;
    }
}
