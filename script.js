let mode = 'math';
let scene, camera, renderer, currentMesh;

// --- Mode Switching ---
function setMode(m) {
    mode = m;
    document.getElementById('buttonsContainer').innerHTML = '';
    document.getElementById('threeContainer').innerHTML = '';
    document.getElementById('physicsContainer').innerHTML = '';
    document.getElementById('calcInput').value = '';
    document.getElementById('result').innerText = '';
    document.getElementById('steps').innerText = '';
    currentMesh = null;

    renderButtons();

    if (mode==='shapes') initThree();
    if (mode==='physics') initPhysics();
}

// --- Input handling ---
function insertInput(val) {
    document.getElementById('calcInput').value += val + ' ';
}

// --- Buttons Rendering ---
function renderButtons() {
    const container = document.getElementById('buttonsContainer');
    if (mode==='math') {
        ['+','-','*','/','%','^','sin(','cos(','tan(','ln(','log(','π','e','(' ,')']
        .forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick = ()=> insertInput(b);
            container.appendChild(btn);
        });
    }
    if (mode==='physics') {
        ['F=ma','v=d/t','a=v/t','E=mc^2','p=m*v','ρ=m/v','Motion'].forEach(b=>{
            let btn = document.createElement('button');
            btn.innerText = b;
            btn.onclick = ()=> insertPhysics(b);
            container.appendChild(btn);
        });
    }
    if (mode==='shapes') {
        ['Cube','Sphere','Cylinder','Cone'].forEach(s=>{
            let btn = document.createElement('button');
            btn.innerText = s;
            btn.onclick = ()=> drawShape(s);
            container.appendChild(btn);
        });
    }
}

// --- Math Calculation ---
function calculate() {
    const input = document.getElementById('calcInput').value;
    let resultText = '', steps='';
    try{
        let expr = input.replace(/π/g, Math.PI)
                        .replace(/\be\b/g, Math.E)
                        .replace(/\^/g,'**');
        let val = eval(expr);
        resultText = 'Result: '+val;
        steps = input+' → '+val;
    }catch(e){
        resultText = 'Error';
        steps='';
    }
    document.getElementById('result').innerText = resultText;
    document.getElementById('steps').innerText = steps;
}

// --- Physics Handling ---
function insertPhysics(f){
    const container = document.getElementById('physicsContainer');
    container.innerHTML = '';
    if(f==='F=ma'){
        createSlider('Mass (kg)','mass',1,100,5);
        createSlider('Acceleration (m/s²)','acc',0,20,1);
    }
    if(f==='v=d/t'){
        createSlider('Distance (m)','dist',0,100,10);
        createSlider('Time (s)','time',1,20,1);
    }
    if(f==='Motion'){
        createSlider('Initial Velocity (m/s)','v0',0,50,5);
        createSlider('Acceleration (m/s²)','a',0,10,1);
        createSlider('Time (s)','t',0,10,1);
    }
}

// --- Slider Creator ---
function createSlider(labelText,id,min,max,step){
    const container = document.getElementById('physicsContainer');
    const div = document.createElement('div');
    div.className='slider-container';
    const label = document.createElement('label');
    label.innerText = labelText;
    label.htmlFor = id;
    const slider = document.createElement('input');
    slider.type='range';
    slider.min=min;
    slider.max=max;
    slider.step=step;
    slider.value=min;
    slider.id=id;
    const output = document.createElement('span');
    output.innerText = slider.value;
    slider.oninput = ()=>{
        output.innerText = slider.value;
        runPhysics();
    };
    div.appendChild(label);
    div.appendChild(slider);
    div.appendChild(output);
    container.appendChild(div);
}

// --- Run Physics Calculation ---
function runPhysics(){
    const vals = {};
    ['mass','acc','dist','time','v0','a','t'].forEach(id=>{
        const el = document.getElementById(id);
        if(el) vals[id]=parseFloat(el.value);
    });
    let resultText='';
    if(vals.mass!==undefined && vals.acc!==undefined) resultText = 'F = '+(vals.mass*vals.acc)+' N';
    else if(vals.dist!==undefined && vals.time!==undefined) resultText = 'v = '+(vals.dist/vals.time)+' m/s';
    else if(vals.v0!==undefined && vals.a!==undefined && vals.t!==undefined) resultText = 'v = '+(vals.v0+vals.a*vals.t)+' m/s';
    document.getElementById('result').innerText = resultText;
}

// --- Three.js Shapes ---
function initThree(){
    const container = document.getElementById('threeContainer');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,500/300,0.1,1000);
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(500,300);
    container.appendChild(renderer.domElement);
    camera.position.z=5;
    const light = new THREE.PointLight(0xffffff,1);
    light.position.set(10,10,10);
    scene.add(light);
    animate();
}

function drawShape(name){
    if(!scene) initThree();
    if(currentMesh) scene.remove(currentMesh);

    let geometry;
    if(name==='Cube') geometry = new THREE.BoxGeometry(1,1,1);
    if(name==='Sphere') geometry = new THREE.SphereGeometry(0.8,32,32);
    if(name==='Cylinder') geometry = new THREE.CylinderGeometry(0.6,0.6,1.5,32);
    if(name==='Cone') geometry = new THREE.ConeGeometry(0.7,1.5,32);

    let material = new THREE.MeshNormalMaterial();
    currentMesh = new THREE.Mesh(geometry,material);
    scene.add(currentMesh);

    document.getElementById('result').innerText = `${name} Rendered`;
    document.getElementById('steps').innerText = `Interactive 3D ${name}`;
}

function animate(){
    requestAnimationFrame(animate);
    if(currentMesh){
        currentMesh.rotation.x += 0.01;
        currentMesh.rotation.y += 0.01;
    }
    if(renderer) renderer.render(scene,camera);
}

// --- Initialize ---
setMode('math');
