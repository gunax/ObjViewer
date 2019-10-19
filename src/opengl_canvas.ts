class OpenGLCanvas {
    canvas : HTMLCanvasElement;
    gl : WebGLRenderingContext;
    constructor () {
        this.canvas = <HTMLCanvasElement>document.getElementById('glCanvas');
        this.gl = this.canvas.getContext('webgl');
        this.prepare();
    }

    prepare() {
        if (this.gl === null) {
            document.body.textContent = 'WebGL is not avaiulable';
        }
        
        // Set clear color to black, fully opaque
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}

export {OpenGLCanvas};