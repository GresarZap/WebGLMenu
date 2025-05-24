/***************************************************************************/
/* La Clase Vector3                                                        */
/***************************************************************************/

export class Vector3 {

    /**
     * Construye un nuevo Vector.
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     *                   u = Suma de vectores
     *  u = v1 + v2     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *                   u = (v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
     */
    mas(v2) {
        return (new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z));
    }

    /**
     *                   u = Resta de vectores
     *  u = v1 - v2     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *                   u = (v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
     */
    menos(v2) {
        return (new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z));
    }

    /**
     *                      u x v = Producto vectorial o producto cruz
     * u = (u.x, u.y, u.z) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     * v = (v.x, v.y, v.z)  u x v = (u.y * v.z - u.z * v.y,   
     *                               u.z * v.x - u.x * v.z,
     *                               u.x * v.y - u.y * v.x)                  
     */
    producto_vectorial(v2) {
        var r = new Vector3();
        r.x = (this.y * v2.z) - (this.z * v2.y);
        r.y = (this.z * v2.x) - (this.x * v2.z);
        r.z = (this.x * v2.y) - (this.y * v2.x);
        return r;
    }

    /**
     *                      u . v = Producto escalar o producto punto
     * u = (u.x, u.y, u.z) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     * v = (v.x, v.y, v.z)  u . v = u.x v.x + u.y v.y + u.z v.z
     *                                          
     */
    producto_escalar(v2) {
        return (this.x * v2.x) + (this.y * v2.y) + (this.z * v2.z);
    }

    /**
     *                     |v| = Longitud de un vector o magnitud
     * v = (x, y, z)    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *                     |v| = raiz_cuadrada (x^2 + y^2 + z^2) 
     *                                          
     */
    longitud() {
        return (Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
    }

    /**
     *        v            u = Vector unitario o de longitud 1
     *  u  = ---        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *       |v|           u = Vector normalizado
     *                     
     */
    normaliza() {
        var l = this.longitud();
        if (l > 0) {
            this.x = this.x / l;
            this.y = this.y / l;
            this.z = this.z / l;
        }
    }
    /**
     *    3
     *     ^
     *     |
     *   v |
     *     |
     *    1 -------- > 2
     */
    normal(v1, v2, v3) {
        var u = new Vector3(); // vector u
        var v = new Vector3(); // vector v
        var n = new Vector3(); // vector n

        /* Calcula los vectores u y v */
        u = v2.menos(v1);
        v = v3.menos(v1);

        /* n = u x v */
        n = u.producto_vectorial(v);

        /* Normaliza */
        n.normaliza();

        return n;
    }

    toString() {
        return "Vector3 [x=" + this.x + ", y=" + this.y + ", z=" + this.z + "]";
    }
}
