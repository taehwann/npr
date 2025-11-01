function renderHalftone() {
    const container = document.getElementById('halftone-container');
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    const renderer = new THREE.WebGLRenderer();
    container.appendChild(renderer.domElement);
    
    const loader = new THREE.TextureLoader();
    loader.load('asset/frog.jpg', (texture) => {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: texture },
                uResolution: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
                uDotSize: { value: 30.0 }
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
                uniform vec2 uResolution;
                uniform float uDotSize;
                varying vec2 vUv;
    
                void main() {
                    vec2 st = vUv;
                    vec4 color = texture2D(tDiffuse, st);
                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
                    vec2 grid_uv = st * uResolution / uDotSize;
                    vec2 grid_pos = fract(grid_uv) - 0.5;
                    float dist = length(grid_pos);
    
                    float dot_radius = gray * 0.5;
                    float smoothed = 1.0 - smoothstep(dot_radius - 0.1, dot_radius + 0.1, dist);
    
                    gl_FragColor = vec4(vec3(smoothed), 1.0);
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

renderHalftone();