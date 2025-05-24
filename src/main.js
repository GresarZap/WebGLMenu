import { Cubo } from './cuboColor.js';
import { Esfera } from './esfera.js';
import { Esfera2 } from './esfera2.js';
import { Cilindro } from './cilindro.js';
import { Cilindro2 } from './cilindro2.js';
import { ArcBall } from './arcBall.js';
import { Cuaternion } from './cuaternion.js';
import { ortho, identidad, escalacion, multiplica, rotacionZ, rotacionY, rotacionX, traslacion } from './matrices.js';

import { getArbolesData } from './arbol.js';
import { Esfera3 } from './esfera3.js';
import { Esfera4 } from './esfera4.js';


/* Variables globales */
let canvas;
let programaID;
let gl;
let cubo;
let esfera;
let tierra;
let cilindro;
let cilindro2;
let arcBall;
let background = [0.6, 0.85, 0.95];
let bgSwitch = true;
let addX = 1;
let addY = 1;
let addZ = 1;
let sliderX;
let sliderY;
let sliderZ;
let valorX;
let valorY;
let valorZ;

let arbolesData;
let arboles;
let nubesData;
let nubes;
let floresData;
let flores;
let objeto;

let optionDraw = true;
let forma = "cubo";

/* Variables Uniformes */
let uMatrizProyeccion;
let uMatrizVista;
let uMatrizModelo;

/* Matrices */
let MatrizProyeccion = new Array(16);
let MatrizVista = new Array(16);
let MatrizModelo = new Array(16);

/* Para la interacción */
let MatrizRotacion = new Array(16);
let Matriz = new Array(16);
let boton_izq_presionado = false;
let sx = 1, sy = 1, sz = 1;

/***************************************************************************/
/* Se crean, compilan y enlazan los programas Shader                       */
/***************************************************************************/
function compilaEnlazaLosShaders() {

    /* Se compila el shader de vertice */
    var shaderDeVertice = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shaderDeVertice, document.getElementById("vs").text.trim());
    gl.compileShader(shaderDeVertice);
    if (!gl.getShaderParameter(shaderDeVertice, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeVertice));
    }

    /* Se compila el shader de fragmento */
    var shaderDeFragmento = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shaderDeFragmento, document.getElementById("fs").text.trim());
    gl.compileShader(shaderDeFragmento);
    if (!gl.getShaderParameter(shaderDeFragmento, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shaderDeFragmento));
    }

    /* Se enlaza ambos shader */
    programaID = gl.createProgram();
    gl.attachShader(programaID, shaderDeVertice);
    gl.attachShader(programaID, shaderDeFragmento);
    gl.linkProgram(programaID);
    if (!gl.getProgramParameter(programaID, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(programaID));
    }

    /* Se instala el programa de shaders para utilizarlo */
    gl.useProgram(programaID);
}

/***************************************************************************/
/* Eventos del Ratón                                                       */
/***************************************************************************/

function mouseDown(event) {
    var posx = new Number();
    var posy = new Number();

    /* Obtiene la coordenada dentro de la área mayor */
    if (event.x != undefined && event.y != undefined) {
        posx = event.x;
        posy = event.y;
    } else {
        posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    /* Obtiene la coordenada dentro del canvas */
    posx = posx - canvas.offsetLeft;
    posy = posy - canvas.offsetTop;

    /* Matriz = MatrizRotacion */
    Matriz = MatrizRotacion.slice(); /* Copia */
    arcBall.primerPunto(posx, posy);

    boton_izq_presionado = true;

    return false;
};

function mouseUp(e) {
    boton_izq_presionado = false;
};

function mouseMove(event) {
    if (!boton_izq_presionado)
        return false;

    var posx = new Number();
    var posy = new Number();

    /* Obtiene la coordenada dentro de la área mayor */
    if (event.x != undefined && event.y != undefined) {
        posx = event.x;
        posy = event.y;
    } else {
        posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    /* Obtiene la coordenada dentro del canvas */
    posx = posx - canvas.offsetLeft;
    posy = posy - canvas.offsetTop;

    /* Actualiza el segundo vector y obtiene el cuaternión */
    let q = arcBall.segundoPunto(posx, posy);

    /* Convierte el cuaternión a una matriz de rotación */
    Cuaternion.rota2(MatrizRotacion, q);

    /* MatrizRotacion = MatrizRotacion * Matriz */
    multiplica(MatrizRotacion, MatrizRotacion, Matriz);

};

function zoom(event) {
    event.preventDefault();
    if (event.deltaY > 0) {
        sx = sx * 0.9;
        sy = sy * 0.9;
        sz = sz * 0.9;
    } else {
        sx = sx * 1.1;
        sy = sy * 1.1;
        sz = sz * 1.1;
    }
};

function dibuja() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /* Matriz del Modelo */
    identidad(MatrizModelo);             // M = I
    escalacion(MatrizModelo, sx, sy, sz);
    multiplica(MatrizModelo, MatrizModelo, MatrizRotacion); // M = M * MatrizRotacion
    escalacion(MatrizModelo, addX, addY, addZ);
    gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);

    switch (forma) {
        case "cubo":
            dibujaCubo();
            break;
        case "planeta":
            dibujaPlaneta();
            break;
        case "esfera":
            dibujaEsfera();
            break;
        case "objeto":
            dibujaObjeto();
            break;
        default:
            break;
    }


    // ---------- Primer hijo: cilindro
    // rotacionX(MatrizModelo, 90);
    // rotacionY(MatrizModelo, 10);
    // rotacionZ(MatrizModelo, 40);
    // traslacion(MatrizModelo, 0, 0, .75);
    // gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
    // cilindro.dibuja(gl);

    // // ---------- Segundo hijo: cilindro2
    // MatrizModelo = matrizPadre.slice(); // restaurar la matriz de la esfera

    // rotacionX(MatrizModelo, 20);
    // rotacionY(MatrizModelo, 60);
    // rotacionZ(MatrizModelo, 100);
    // traslacion(MatrizModelo, 0, 0, 0.55);
    // gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
    // cilindro2.dibuja(gl);


    requestAnimationFrame(dibuja);
}


function reinicia() {
    /* Matriz de Rotación */
    addX = 1;
    addY = 1;
    addZ = 1;
    sliderX.value = 1;
    sliderY.value = 1;
    sliderZ.value = 1;
    valorX.textContent = 1;
    valorY.textContent = 1;
    valorZ.textContent = 1;
    identidad(MatrizRotacion);

    dibuja();
}

function dibujaEsfera() {
    esfera.dibuja(gl, optionDraw);
}

function dibujaCubo() {
    cubo.dibuja(gl, optionDraw);
}

function dibujaObjeto() {
    traslacion(MatrizModelo, 0, 0, -3);
    objeto.dibuja(gl, optionDraw);
}

function dibujaPlaneta() {
    tierra.dibuja(gl, optionDraw);

    let matrizPadre = MatrizModelo.slice(); // guardar matriz de la esfera

    // ---------- Hijos: arboles
    for (let i = 0; i < arboles.troncos.length; i++) {
        MatrizModelo = matrizPadre.slice(); // restaurar la matriz de la esfera
        let tree = arboles.troncos[i];
        let hoja = arboles.hojas[i];
        let data = arbolesData[i];
        let height = data.height;
        let radius = data.radius;
        let degX = data.degX;
        let degY = data.degY;
        let degZ = data.degZ;

        rotacionX(MatrizModelo, degX);
        rotacionY(MatrizModelo, degY);
        rotacionZ(MatrizModelo, degZ);
        traslacion(MatrizModelo, 0, 0, height / 2);
        gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        tree.dibuja(gl, optionDraw);
        traslacion(MatrizModelo, 0, 0, height / 2);
        escalacion(MatrizModelo, data.copaX, data.copaY, data.copaZ);
        gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        hoja.dibuja(gl, optionDraw);
    }

    for (let i = 0; i < nubes.length; i++) {
        MatrizModelo = matrizPadre.slice(); // restaurar la matriz de la esfera
        let cloud1 = nubes[i].cloud1;
        let cloud2 = nubes[i].cloud2;
        let cloud3 = nubes[i].cloud3;
        let data = nubesData[i];
        let x = data.x;
        let y = data.y;
        let z = data.z;
        let degX = data.degX;
        let degY = data.degY;
        let degZ = data.degZ;

        rotacionX(MatrizModelo, degX);
        rotacionY(MatrizModelo, degY);
        rotacionZ(MatrizModelo, degZ);
        traslacion(MatrizModelo, 0, 0, 1.9);
        escalacion(MatrizModelo, 1.1, 1.1, 1.1);
        gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        cloud1.dibuja(gl, optionDraw);


        traslacion(MatrizModelo, 0.1, 0, 0);
        escalacion(MatrizModelo, 0.7, 0.7, 0.7);
        gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        cloud2.dibuja(gl, optionDraw);

        traslacion(MatrizModelo, -0.25, 0, 0);
        escalacion(MatrizModelo, 0.9, 0.9, 0.9);
        gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        cloud3.dibuja(gl, optionDraw);
    }

    for (let i = 0; i < flores.tallos.length; i++) {
        MatrizModelo = matrizPadre.slice(); // restaurar la matriz de la esfera
        let flower = flores.flowers[i];
        let tallo = flores.tallos[i];
        let data = floresData[i];
        let degX = data.degX;
        let degY = data.degY;
        let degZ = data.degZ;

        rotacionX(MatrizModelo, degX);
        rotacionY(MatrizModelo, degY);
        rotacionZ(MatrizModelo, degZ);
        traslacion(MatrizModelo, 0, 0, 1);
        gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        tallo.dibuja(gl, optionDraw);

        traslacion(MatrizModelo, 0, 0, 0.05);
        escalacion(MatrizModelo, 1, 1, 2);
        gl.uniformMatrix4fv(uMatrizModelo, false, MatrizModelo);
        flower.dibuja(gl, optionDraw);
    }
}

function main() {
    canvas = document.getElementById("webglcanvas");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.textContent("WebGL 2.0 no está disponible en tu navegador");
        return;
    }

    /* Para detectar los eventos del ratón */
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mouseout", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("wheel", zoom, { passive: false });

    /* Para los botones */
    const $menuLinks = document.querySelector('.menu-links');
    $menuLinks.addEventListener('click', function (e) {
        const li = e.target.closest('li');

        if (!li || !li.id) return; // si no se hizo clic en un <li> con id, salir

        e.preventDefault(); // evitar navegación

        if (li.id === 'wireframe') {
            optionDraw = false;
            cubo.setToLines(gl);
            dibuja();
        } else if (li.id === 'solid') {
            optionDraw = true;
            cubo.setToSolid(gl);
            dibuja();
        }
        else if (li.id === 'fondo') {
            if (bgSwitch) {
                background = [0, 0, 0];
                gl.clearColor(...background, 1.0);
                bgSwitch = false;
            } else {
                background = [0.6, 0.85, 0.95];
                gl.clearColor(...background, 1.0);
                bgSwitch = true;
            }
            console.log(background);
            dibuja();
        }
    }, true);

    document.getElementById("reset").onclick = reinicia;

    const selectForma = document.getElementById('forma');

    // Para el selector de formas
    selectForma.addEventListener('change', (e) => {
        const formaSeleccionada = e.target.value;

        console.log('Forma seleccionada:', formaSeleccionada);

        forma = formaSeleccionada;
        dibuja();
    });

    // para el slider
    sliderX = document.getElementById('rangoX');
    valorX = document.getElementById('x');

    sliderX.addEventListener('input', () => {
        valorX.textContent = sliderX.value;
        addX = parseFloat(sliderX.value);
    });
    sliderY = document.getElementById('rangoY');
    valorY = document.getElementById('y');

    sliderY.addEventListener('input', () => {
        valorY.textContent = sliderY.value;
        addY = parseFloat(sliderY.value);
    });
    sliderZ = document.getElementById('rangoZ');
    valorZ = document.getElementById('z');

    sliderZ.addEventListener('input', () => {
        valorZ.textContent = sliderZ.value;
        addZ = parseFloat(sliderZ.value);
    });

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    compilaEnlazaLosShaders();

    cubo = new Cubo(gl);
    esfera = new Esfera(gl, 1, 48, 48);
    tierra = new Esfera(gl, 1, 48, 48);
    cilindro = new Cilindro(gl, 0.05, 1.5, 24, true, true);
    /* Objetos */
    objeto = new Objeto(gl, "Modelos/al.obj");
    // cilindro2 = new Cilindro(gl, 0.02, 1.1, 24, true, true);

    arbolesData = getArbolesData(40);
    arboles = createTrees(arbolesData);

    nubesData = getArbolesData(10);
    nubes = createClouds(nubesData);

    floresData = getArbolesData(50);
    flores = createFlowers(floresData);

    arcBall = new ArcBall(600.0, 600.0);

    gl.useProgram(programaID);
    uMatrizProyeccion = gl.getUniformLocation(programaID, "uMatrizProyeccion");
    uMatrizVista = gl.getUniformLocation(programaID, "uMatrizVista");
    uMatrizModelo = gl.getUniformLocation(programaID, "uMatrizModelo");
    ortho(MatrizProyeccion, -10.15, 10.15, -5, 5, -5, 5);
    gl.uniformMatrix4fv(uMatrizProyeccion, false, MatrizProyeccion);
    identidad(MatrizVista);
    gl.uniformMatrix4fv(uMatrizVista, false, MatrizVista);
    identidad(MatrizRotacion);

    /* Ajusta el ancho a [-1..1] y el alto a [-1..1] */
    arcBall.ajusta(gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(...background, 1.0);
    dibuja();
}

function createTrees(data) {
    let troncos = [];
    let hojas = [];
    for (let i = 0; i < data.length; i++) {
        let tronco = new Cilindro(gl, data[i].radius, data[i].height, 24, true, true);
        let hoja = new Esfera2(gl, 0.1, 24, 24);
        hojas.push(hoja);
        troncos.push(tronco);
    }

    return { troncos, hojas };
}

function createClouds(data) {
    let clouds = [];
    for (let i = 0; i < data.length; i++) {
        let cloud1 = new Esfera3(gl, 0.1, 24, 24);
        let cloud2 = new Esfera3(gl, 0.1, 24, 24);
        let cloud3 = new Esfera3(gl, 0.1, 24, 24);
        clouds.push({ cloud1, cloud2, cloud3 });
    }
    return clouds;
}

function createFlowers(data) {
    let flowers = [];
    let tallos = [];
    for (let i = 0; i < data.length; i++) {
        let tallo = new Cilindro2(gl, 0.005, 0.1, 24, true, true);
        let flower = new Esfera4(gl, 0.01, 24, 24);
        flowers.push(flower);
        tallos.push(tallo);
    }
    return { tallos, flowers };
}



window.onload = main;


class Grupo {
    constructor() {
        this.nombre = "si_falta";       /* Nombre del grupo */
        this.triangulos = new Array();  /* Arreglo de índice de triangulos */
        this.material = 0;              /* Indice del color del material del grupo */
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    getNombre() {
        return this.nombre;
    }
    adiTriangulo(t) {
        this.triangulos.push(t);
    }
    getTriangulo(indice) {
        return this.triangulos[indice];
    }
    getNumTriangulos() {
        return this.triangulos.length;
    }
    setMaterial(material) {
        this.material = material;
    }
    getMaterial() {
        return this.material;
    }
    toString() {
        return this.nombre +
            "<br> triangulos: " + this.triangulos +
            "<br> material  : " + this.material;
    }
}

class Material {
    constructor() {
        this.nombre = "si_falta";    /* Nombre del material */
        this.ambiente = [0.2, 0.2, 0.2]; /* Arreglo del color ambiente */
        this.difuso = [0.8, 0.8, 0.8]; /* Arreglo del color difuso */
        this.especular = [0.0, 0.0, 0.0]; /* Arreglo del color especular */
        this.brillo = 0;             /* Exponente del brillo */
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    getNombre() {
        return this.nombre;
    }
    setAmbiente(ambiente) {
        this.ambiente = ambiente;
    }
    getAmbiente() {
        return this.ambiente;
    }
    setDifuso(difuso) {
        this.difuso = difuso;
    }
    getDifuso() {
        return this.difuso;
    }
    setEspecular(especular) {
        this.especular = especular;
    }
    getEspecular() {
        return this.especular;
    }
    setBrillo(brillo) {
        this.brillo = brillo;
    }
    getBrillo() {
        return this.brillo;
    }
    toString() {
        return this.nombre +
            "<br> Ka: " + this.ambiente +
            "<br> Kd: " + this.difuso +
            "<br> Ks: " + this.especular +
            "<br> Ns: " + this.brillo;
    }
}

class Cadena {
    constructor(cadena) {
        this.cadena = cadena;
        this.indice = 0;
    }
    esDelimitador(c) {
        return (
            c == ' ' ||
            c == '\t' ||
            c == '(' ||
            c == ')' ||
            c == '"' ||
            c == "'"
        );
    }
    saltaDelimitadores() {
        let n = this.cadena.length;
        while (this.indice < n &&
            this.esDelimitador(this.cadena.charAt(this.indice))) {
            this.indice++;
        }
    };
    obtLongPalabra(inicio) {
        var i = inicio;
        while (i < this.cadena.length &&
            !this.esDelimitador(this.cadena.charAt(i))) {
            i++;
        }
        return i - inicio;
    };
    getToken() {
        var n, subcadena;
        this.saltaDelimitadores();
        n = this.obtLongPalabra(this.indice);
        if (n === 0) {
            return null;
        }
        subcadena = this.cadena.substr(this.indice, n);
        this.indice = this.indice + (n + 1);
        return subcadena.trim();
    }
    getInt() {
        var token = this.getToken();
        if (token) {
            return parseInt(token, 10);
        }
        return null;
    }
    getFloat() {
        var token = this.getToken();
        if (token) {
            return parseFloat(token);
        }
        return null;
    }
}

class Objeto {
    constructor(gl, nombreArchivo) {
        var lineas, token, x, y, z, a, b;
        var minX, maxX, minY, maxY, minZ, maxZ;
        var numVertices, numTriangulos, indiceDeGrupo;
        var hayGrupos;
        this.vertices = [];
        this.indices = [];

        /* Número de Vértices */
        numVertices = 0;

        /* Número de Triángulos */
        numTriangulos = 0;

        /* Arreglo de Grupos */
        this.grupos = [];

        hayGrupos = false;

        /* Arreglo de los colores de los Materiales */
        this.materiales = [];

        /* Lee el archivo .obj */
        let datos_obj = this.leeArchivo(nombreArchivo);

        /* Divide por lineas */
        lineas = datos_obj.split("\n");

        minX = Number.MAX_VALUE; maxX = Number.MIN_VALUE;
        minY = Number.MAX_VALUE; maxY = Number.MIN_VALUE;
        minZ = Number.MAX_VALUE; maxZ = Number.MIN_VALUE;

        for (let i = 0; i < lineas.length; i++) {
            let cad = new Cadena(lineas[i]); // Inicia el procesamiento de cadenas
            token = cad.getToken();
            if (token != null) {
                switch (token) {
                    case '#':
                        continue;
                    case 'mtllib': /* nombre del arch. de materiales */
                        let nombreArchivoMTL = cad.getToken();
                        this.lee_datos_archivo_mtl(nombreArchivoMTL);
                        break;
                    case 'v': /* vértice */
                        x = cad.getFloat();
                        y = cad.getFloat();
                        z = cad.getFloat();
                        this.vertices.push(x);
                        this.vertices.push(y);
                        this.vertices.push(z);
                        numVertices++;
                        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
                        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
                        break;
                    case 'g':
                    case 'group': /* nombre de grupo */
                        let nombreGrupo = cad.getToken();
                        indiceDeGrupo = this.buscaGrupo(nombreGrupo);
                        if (indiceDeGrupo == -1) {
                            /* Agrega a la lista de grupo un nuevo grupo*/
                            let grupo = new Grupo();
                            grupo.setNombre(nombreGrupo);
                            this.grupos.push(grupo);         /* Guarda en el arreglo de grupos */
                            indiceDeGrupo = this.grupos.length - 1;
                        }
                        hayGrupos = true;
                        break;
                    case 'usemtl': /* nombre del material */
                        let nombreMaterial = cad.getToken();
                        let indiceDeMaterial = this.buscaMaterial(nombreMaterial);
                        if (!hayGrupos) { // Si no hay un grupo
                            indiceDeGrupo = this.buscaMaterialPorGrupo(indiceDeMaterial);
                            if (indiceDeGrupo == -1) {
                                /* Agrega a la lista de grupo un nuevo grupo*/
                                let grupo = new Grupo();
                                grupo.setNombre(nombreMaterial);
                                this.grupos.push(grupo);         /* Guarda en el arreglo de grupos */
                                indiceDeGrupo = this.grupos.length - 1;
                            }
                        }
                        /* Asigna al grupo el indice del material */
                        this.grupos[indiceDeGrupo].setMaterial(indiceDeMaterial);
                        break;
                    case 'f': /* cara */
                        a = cad.getInt() - 1;
                        this.indices.push(a); // v0
                        b = cad.getInt() - 1;
                        this.indices.push(b); // v1
                        b = cad.getInt() - 1;
                        this.indices.push(b); // v2

                        /* Asigna al grupo el indice del material */
                        this.grupos[indiceDeGrupo].adiTriangulo(numTriangulos);

                        numTriangulos++;

                        var tokenEntero = cad.getInt();
                        while (tokenEntero != null) {

                            this.indices.push(a);    // v0
                            this.indices.push(b);    // v2
                            b = tokenEntero - 1;
                            this.indices.push(b);    // v3

                            /* Asigna al grupo el indice del material */
                            this.grupos[indiceDeGrupo].adiTriangulo(numTriangulos);

                            numTriangulos++;

                            tokenEntero = cad.getInt();
                        }

                        break;
                }
            }
        }

        /* Redimensiona las coordenadas entre [-1,1] */
        var tam_max = 0, escala;
        tam_max = Math.max(tam_max, maxX - minX);
        tam_max = Math.max(tam_max, maxY - minY);
        tam_max = Math.max(tam_max, maxZ - minZ);
        escala = 2.0 / tam_max;

        /* Actualiza los vértices */
        for (let i = 0; i < numVertices * 3; i += 3) {
            this.vertices[i] = escala * (this.vertices[i] - minX) - 1.0;
            this.vertices[i + 1] = escala * (this.vertices[i + 1] - minY) - 1.0;
            this.vertices[i + 2] = escala * (this.vertices[i + 2] - minZ) - 1.0;
        }
        console.log("Cant. vértices: ", this.vertices.length / 3);
        console.log(this.vertices.length);
        for (let i = 0; i < this.vertices.length; i += 3) {
            console.log(i + " : " + this.vertices[i] + "  " + this.vertices[i + 1] + "  " + this.vertices[i + 2])
        }

        console.log(this.indices.length);
        for (let i = 0; i < this.indices.length; i += 6) {
            console.log(i + " : " + this.indices[i] + "  " + this.indices[i + 1] + "  " + this.indices[i + 2] + "  " + this.indices[i + 3] + "  " + this.indices[i + 4] + "  " + this.indices[i + 5])
        }

        console.log("grupos: " + this.grupos.length);
        for (let i = 0; i < this.grupos.length; i++) {
            console.log(i + " : " + this.grupos[i].toString() + " " + this.materiales[this.grupos[i].getMaterial()].getNombre());
        }

        console.log("materiales: " + this.materiales.length);
        for (let i = 0; i < this.materiales.length; i++) {
            console.log(i + " : " + this.materiales[i].toString());
        }

        console.log("num triangulos: " + numTriangulos);
    }

    dibuja(gl, option) {
        var numTriangulos, indiceDeMaterial, color, k;
        for (let i = 0; i < this.grupos.length; i++) {

            /* Obtiene el número de triángulos del grupo */
            numTriangulos = this.grupos[i].getNumTriangulos();

            if (numTriangulos == 0)
                continue;

            /* Obtiene los indices */
            let indAux = new Uint16Array(numTriangulos * 3);

            for (let j = 0; j < numTriangulos; j++) {
                k = j * 3;

                /* Lee del grupo i el número de triángulo j */
                let numTrian = this.grupos[i].getTriangulo(j);

                indAux[k] = this.indices[numTrian * 3 + 0];
                indAux[k + 1] = this.indices[numTrian * 3 + 1];
                indAux[k + 2] = this.indices[numTrian * 3 + 2];
            }

            /* Se crea el objeto del arreglo de vértices (VAO) */
            //this.objetoVAO = gl.createVertexArray();

            /* Se activa el objeto */
            //gl.bindVertexArray(this.objetoVAO);

            var codigoVertices = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, codigoVertices);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

            this.codigoDeIndices = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.codigoDeIndices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indAux), gl.STATIC_DRAW);

            indiceDeMaterial = this.grupos[i].getMaterial();

            /* Lee el color */
            //color = this.materiales[indiceDeMaterial].getAmbiente();
            color = this.materiales[indiceDeMaterial].getDifuso();

            // gl.uniform4f(uColor, color[0], color[1], color[2], 1);
            if (option)
                gl.drawElements(gl.TRIANGLES, numTriangulos * 3, gl.UNSIGNED_SHORT, 0);
            else
                gl.drawElements(gl.LINES, numTriangulos * 3, gl.UNSIGNED_SHORT, 0);

            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    /* Lee el archivo OBJ */
    leeArchivo(nombreArchivo) {
        var byteArray = [];
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status !== 404) {
                byteArray = request.responseText
            }
        }
        request.open('GET', nombreArchivo, false); // Crea una solicitud para abrir el archivo
        request.send(null);                        // Enviando la solicitud
        return byteArray;
    }

    /* Lee los datos de un archivo .MTL (archivo de los colores de los materiales) */
    lee_datos_archivo_mtl(nombreArchivoMTL) {

        let datos_mtl = this.leeArchivo("Modelos/" + nombreArchivoMTL);

        /* Divide por lineas */
        let lineas = datos_mtl.split('\n');

        let token;
        for (let i = 0; i < lineas.length; i++) {
            let cad = new Cadena(lineas[i]); // Inicia el procesamiento de cadenas 
            token = cad.getToken();
            if (token != null) {
                switch (token) {
                    case '#':
                        continue;
                    case 'newmtl':  /* nombre del material */
                        let nombreMaterial = cad.getToken();
                        let material = new Material();
                        material.setNombre(nombreMaterial);
                        this.materiales.push(material);
                        break;
                    case 'Ka':      /* ambiente */
                        let ambiente = new Array(3);
                        ambiente[0] = cad.getFloat();
                        ambiente[1] = cad.getFloat();
                        ambiente[2] = cad.getFloat();
                        this.materiales[this.materiales.length - 1].setAmbiente(ambiente);
                        break;
                    case 'Kd':      /* difuso */
                        var difuso = new Array(3);
                        difuso[0] = cad.getFloat();
                        difuso[1] = cad.getFloat();
                        difuso[2] = cad.getFloat();
                        this.materiales[this.materiales.length - 1].setDifuso(difuso);
                        break;
                    case 'Ks':      /* especular */
                        var especular = new Array(3);
                        especular[0] = cad.getFloat();
                        especular[1] = cad.getFloat();
                        especular[2] = cad.getFloat();
                        this.materiales[this.materiales.length - 1].setEspecular(especular);
                        break;
                    case 'Ns':      /* brillo */
                        var brillo = cad.getFloat();
                        this.materiales[this.materiales.length - 1].setBrillo(brillo);
                        break;
                }
            }
        }
    }

    /* Busca el grupo */
    buscaGrupo(nombre) {
        for (let i = 0; i < this.grupos.length; i++)
            if (nombre == this.grupos[i].getNombre())
                return i;
        return -1;
    }

    /* Busca el Material */
    buscaMaterial(nombre) {
        for (let i = 0; i < this.materiales.length; i++)
            if (nombre == this.materiales[i].getNombre())
                return i;
        return -1;
    }

    /* Busca el Material que se encuentra en el grupo */
    buscaMaterialPorGrupo(indice) {
        for (let i = 0; i < this.grupos.length; i++)
            if (indice == this.grupos[i].getMaterial())
                return i;
        return -1;
    }
}
