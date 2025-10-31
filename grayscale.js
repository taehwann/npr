function renderGrayscale() {
    const container = document.getElementById('grayscale-container');
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer();
    container.appendChild(renderer.domElement);
    
    const loader = new THREE.TextureLoader();
    loader.load('asset/image.jpg', (texture) => {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: texture }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    gl_FragColor = vec4(vec3(gray), 1.0);
                }
            `
        });
    
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    
        renderer.setSize(texture.image.width, texture.image.height);
        renderer.render(scene, camera);
    });
    
    camera.position.z = 1;
}

renderGrayscale();