/***************************************************************************/
/* Cuaternion: Realiza las operaciones de los cuaterniones.                */
/***************************************************************************/

export class Cuaternion {

    /**
     * Construye un nuevo Cuaternion.
     */
    constructor(w, x, y, z) {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    inicializa(w, v) {
        this.w = w;
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    // norma^2 = w^2 + x^2 + y^2 + z^2
    norma2() {
        return (this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // Conjugado
    conjugado() {
        x = -this.x;
        y = -this.y;
        z = -this.z;
        return this;
    }

    // Cuaternion q = Cuaternion a . Cuaternion b
    multiplica(a, b) {
        let q = new Cuaternion(0, 0, 0, 0);
        q.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
        q.x = a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y;
        q.y = a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x;
        q.z = a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w;
        return q;
    }

    // Cuaternion q = Cuaternion a . b
    multiplica_escalar(a, b) {
        let q = new Cuaternion(0, 0, 0, 0);
        q.w = a.w * b;
        q.x = a.x * b;
        q.y = a.y * b;
        q.z = a.z * b;
        return q;
    }

    // q' = q . p . q^(-1)
    rota(q, p) {   // q es Cuaternion y p es Vector3
        let p_homogeneo = new Cuaternion(0, 0, 0, 0);
        p_homogeneo.inicializa(0, p);
        let p_prima = this.multiplica(q, this.multiplica(p_homogeneo, q.inverso()));
        return (new Vector3(p_prima.x, p_prima.y, p_prima.z));
    }

    // q' = q . p . q*
    rota1(q, p) {  // q es Cuaternion y p es Vector3
        let p_homogeneo = new Cuaternion(0, 0, 0, 0);
        p_homogeneo.inicializa(0, p);
        let p_prima = this.multiplica(q, this.multiplica(p_homogeneo, q.conjugado()));
        return (new Vector3(p_prima.x, p_prima.y, p_prima.z));
    }

    // q = q^(-1)
    inverso() {
        let q = new Cuaternion(0, 0, 0, 0);
        // normal^2 = a . b
        let n = this.norma2();
        if (n <= 1e-8)
            document.write("INVERSO: Error");
        q = multiplica_escalar(new Cuaternion(this.w, -this.x, -this.y, -this.z), 1 / n);
        return q;
    }

    /* Convierte el cuaternión a una matriz de rotación */
    static rota2(a, q) {
        let d, s;
        d = (q.x * q.x) + (q.y * q.y) + (q.z * q.z) + (q.w * q.w);
        s = (d > 0.0) ? (2.0 / d) : 0.0;
        a[0] = 1.0 - (q.y * q.y + q.z * q.z) * s; a[4] = (q.x * q.y - q.w * q.z) * s; a[8] = (q.x * q.z + q.w * q.y) * s; a[12] = 0;
        a[1] = (q.x * q.y + q.w * q.z) * s; a[5] = 1.0 - (q.x * q.x + q.z * q.z) * s; a[9] = (q.y * q.z - q.w * q.x) * s; a[13] = 0;
        a[2] = (q.x * q.z - q.w * q.y) * s; a[6] = (q.y * q.z + q.w * q.x) * s; a[10] = 1.0 - (q.x * q.x + q.y * q.y) * s; a[14] = 0;
        a[3] = 0; a[7] = 0; a[11] = 0; a[15] = 1;
    }

    toString() {
        return "Cuaternion [w=" + this.w + ", x=" + this.x + ", y=" + this.y + ", z=" + this.z + "]";
    }
}