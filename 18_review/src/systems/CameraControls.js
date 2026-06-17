import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { camera } from "../core/camera.js";
import { renderer } from "../core/renderer.js";

export const cameraControls = new OrbitControls(camera, renderer.domElement);
