import {ModelData} from "./ModelData"

export class Model {
    vertices : Float32Array;
    indices : Uint16Array;
    Buffers : BufferSet;

    constructor(md : ModelData) {
        this.vertices = md.positions;
        this.indices = md.indices;
    }

    load(gl : WebGLRenderingContext) {

        // Load the vertices data
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            this.vertices,
            gl.STATIC_DRAW);

        //Load the indices data
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            this.indices, gl.STATIC_DRAW);

        this.Buffers = {
            vertices : vertexBuffer,
            indices : indexBuffer,
        };
    }
}

interface BufferSet {
    vertices : WebGLBuffer;
    indices : WebGLBuffer;
}