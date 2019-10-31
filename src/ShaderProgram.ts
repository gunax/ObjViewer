import { Camera } from "./Camera";

class ShaderProgram {

    private gl : WebGLRenderingContext;
    private vShader : WebGLShader;
    private fShader : WebGLShader;
    private program : WebGLProgram;
    private camera : Camera;

    constructor(gl : WebGLRenderingContext, vsource : string, fsource : string) {
        this.gl = gl;
        this.program = gl.createProgram();

        this.vShader = this.loadShader(this.gl.VERTEX_SHADER, vsource);
        this.fShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsource);

        this.gl.attachShader(this.program, this.vShader);
        this.gl.attachShader(this.program, this.fShader);
        this.gl.linkProgram(this.program);
    }

    loadShader(type: number, source: string) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log('Could not compile shader ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
        }
        return shader;
    }

    getProgram() {
        return this.program;
    }

    getProgramInfo() {
        return {
            program: this.program,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(this.program, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(this.program, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(this.program, 'uModelViewMatrix'),
            },
        };
    }
}

interface ProgramInfo {
    program : WebGLProgram;
    attribLocations? : any;
    uniformLocations? : any;
}

export {ShaderProgram, ProgramInfo};