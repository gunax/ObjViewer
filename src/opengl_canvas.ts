export class OpenGLCanvas {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;

    constructor(canvas : HTMLElement) {
        this.canvas = <HTMLCanvasElement> canvas;
        this.gl = this.canvas.getContext('webgl');

        if (this.gl === null) {
            document.body.textContent = 'WebGL is not available';
        }
    }
}  