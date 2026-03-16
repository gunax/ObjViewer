import {mat4} from "gl-matrix";

export class Camera {
    readonly projection : any;
    readonly modelView : any;

    private translation : [number, number, number];
    private rotX = 0;
    private rotY = 0;
    private scaleVal = 1;

    constructor(fieldOfView : number, aspect : number, zNear : number, zFar : number,
        xTrans : number, yTrans : number, zTrans : number) {

        this.projection = mat4.create();
        mat4.perspective(this.projection,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        this.translation = [xTrans, yTrans, zTrans];
        this.modelView = mat4.create();
        this.rebuild();
    }

    private rebuild() {
        mat4.identity(this.modelView);
        mat4.translate(this.modelView, this.modelView, this.translation);
        mat4.rotateY(this.modelView, this.modelView, this.rotY);
        mat4.rotateX(this.modelView, this.modelView, this.rotX);
        mat4.scale(this.modelView, this.modelView, [this.scaleVal, this.scaleVal, this.scaleVal]);
    }

    public zoom(z : number) {
        this.scaleVal *= z;
        this.rebuild();
    }

    public rotate(x : number, y : number, _z : number) {
        this.rotY += x;  // mouse left/right → spin around vertical Y axis
        this.rotX += y;  // mouse up/down → tilt around horizontal X axis
        this.rebuild();
    }

    public translate(x : number, y : number, z : number) {
        this.translation[0] += x;
        this.translation[1] += y;
        this.translation[2] += z;
        this.rebuild();
    }

    //4:3 aspect ratio camera, backed up 8 units
    static getDefaultCamera() {
        return new Camera(45 * Math.PI / 180,
            4.0 / 3.0,
            0.1,
            100.0,
            0.0, //x
            0.0, //y
            -8.0); //z
    }
}
