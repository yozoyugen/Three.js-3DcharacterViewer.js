import { GUI } from '/js/threejs/lil-gui.module.min.js';
//import { GUI } from '/m3DmodelViewer/js/threejs/lil-gui.module.min.js';

window.addEventListener('DOMContentLoaded', init);
function init() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas')
    });
    const main_canvas = document.querySelector( '#main_canvas' );
    let width = document.getElementById('main_canvas').getBoundingClientRect().width;
    let height = document.getElementById('main_canvas').getBoundingClientRect().height;
    //let width = window.innerWidth;
    //let height = window.innerHeight;
    renderer.setPixelRatio(1);
    renderer.setClearColor(new THREE.Color('gray'));
    renderer.setSize(width, height);
    console.log(window.devicePixelRatio);
    console.log(width+", "+height);
 
    const scene = new THREE.Scene();
 
    let camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 400, -1000);
    
    //const controls = new THREE.OrbitControls(camera, renderer.domElement);
    //camera.lookAt(new THREE.Vector3(0, 400, 0));

    let trackball = new THREE.TrackballControls( camera, renderer.domElement );
    trackball.rotateSpeed = 4.0; 
    trackball.zoomSpeed = 0.5;
    trackball.panSpeed = 0.5;

    const loader = new THREE.GLTFLoader();
    const url = 'http://localhost:5500/no0.glb';
    //const url = 'no0.glb';
    
    let model = null;
    loader.load(
        url, 
        function ( gltf ){
            model = gltf.scene;
            model.name = "model_with_cloth";
            model.scale.set(400.0, 400.0, 400.0);
            model.position.set(0,-400,0);
            scene.add( gltf.scene );

            model["test"] = 100;
            console.log("model");
            console.log(model);
        },
        function ( error ) {
            console.log( 'An error happened' );
            console.log( error );
        }
    );
    renderer.gammaOutput = true;
    //renderer.gammaFactor = 2.2;

    const size = 100;
    let mAxes = new THREE.AxesHelper(size);
    mAxes.position.x =  100;
    mAxes.position.y = -400;
    //console.log("mAxes:%o", mAxes);
    scene.add(mAxes);

    const light = new THREE.DirectionalLight(0xFFFFFF);
    light.intensity = 2; 
    light.position.set(1, 1, 1);
    scene.add(light);

    //const gui = new GUI( { container: main_canvas, width: 320 } );
    const gui = new GUI();
    const props = {
        showAxes: true,
    };
    gui.add( props, 'showAxes').name('Show axes');

    let Array_J = [ 'J_Bip_C_Spine',
                    'J_Bip_C_Neck',
                    'J_Bip_L_UpperArm',
                    'J_Bip_L_LowerArm',
                    'J_Bip_R_UpperArm',
                    'J_Bip_R_LowerArm',
                    'J_Bip_L_UpperLeg',
                    'J_Bip_L_LowerLeg',
                    'J_Bip_R_UpperLeg',
                    'J_Bip_R_LowerLeg',
    ];

    let Array_v = [ 'Spine_rx', 'Spine_ry', 'Spine_rz',
                    'Neck_rx', 'Neck_ry', 'Neck_rz',
                    'L_UpperArm_rx', 'L_UpperArm_ry', 'L_UpperArm_rz',
                    'L_LowerArm_rx', 'L_LowerArm_ry', 'L_LowerArm_rz',
                    'R_UpperArm_rx', 'R_UpperArm_ry', 'R_UpperArm_rz',
                    'R_LowerArm_rx', 'R_LowerArm_ry', 'R_LowerArm_rz',
                    'L_UpperLeg_rx', 'L_UpperLeg_ry', 'L_UpperLeg_rz',
                    'L_LowerLeg_rx', 'L_LowerLeg_ry', 'L_LowerLeg_rz',
                    'R_UpperLeg_rx', 'R_UpperLeg_ry', 'R_UpperLeg_rz',
                    'R_LowerLeg_rx', 'R_LowerLeg_ry', 'R_LowerLeg_rz',
    ];
    console.log('Array_v:', Array_v);
    
    for(var i=0; i<Array_v.length; i++){
        props[Array_v[i]] = 0;
        gui.add( props, Array_v[i], -180, 180, 1 );
    }
    console.log('props:%o', props);
    
    let t = 0;
    tick();
    function tick() {
        stats.begin();

        //controls.update();
        trackball.update();
        t += 1;
          
        if (mAxes != null){
            if(props.showAxes){
                mAxes.visible = true;
            }else{
                mAxes.visible = false;
            }
        }

        if (model != null){
            model.traverse(function(obj) {
                for(var i=0; i<Array_J.length; i++){
                    if(obj.name == Array_J[i]){
                        obj.rotation.x = props[Array_v[i*3+0]]/180*3.1415;
                        obj.rotation.y = props[Array_v[i*3+1]]/180*3.1415;
                        obj.rotation.z = props[Array_v[i*3+2]]/180*3.1415;
                    }
                }
            });
            //console.log(model);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(tick);

        stats.end();
    }
    

    onResize();
    window.addEventListener('resize', onResize);
    function onResize() {
        width = document.getElementById('main_canvas').getBoundingClientRect().width;
        height = document.getElementById('main_canvas').getBoundingClientRect().height;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        //console.log(width);
    }

    /*const props = {
        showAxes: true,
        Spine_rx: 0,
        Spine_ry: 0,
        Spine_rz: 0,
    };*/

    /*
    gui.add( props, 'Spine_rx', -180, 180, 1 );
    gui.add( props, 'Spine_ry', -180, 180, 1 );
    gui.add( props, 'Spine_rz', -180, 180, 1 );
    */

    /*if(obj.name == "J_Bip_C_Spine"){
        obj.rotation.x = props.Spine_rx/180*3.1415;
        obj.rotation.y = props.Spine_ry/180*3.1415;
        obj.rotation.z = props.Spine_rz/180*3.1415;
    }*/

}