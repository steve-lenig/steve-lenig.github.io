window.onload = function () {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');

    const imageUrls = [
        'img/bg/Fake.jpeg',
        'img/bg/Fake.jpeg',
        'img/bg/Excalimaze.jpeg',
        'img/bg/Floydian Slip.jpeg',
        'img/bg/Eyenima.jpeg',
        'img/bg/Start of Texas.jpeg',
        'img/bg/Puffurize.jpeg',
        'img/bg/Rebel Tri-Start.jpeg',
        'img/bg/Startship Enderprize.jpeg',
        'img/bg/Rouend.jpeg',
        'img/bg/E3.jpeg',
        'img/bg/Electric Borders.jpeg',
        'img/bg/Black Gives Way to Red.jpeg',
        'img/bg/welcome home planetarium double.jpeg',
    ];
    const noiseUrls = [
        'img/noise/noiseHTS.jpg',
        'img/noise/noiseDTS.jpg',
        'img/noise/noiseVTS.jpg',
        'img/noise/noiseFS.jpg',
        'img/noise/noisePS.jpg',
    ];
    const TRANSITION_DURATION = 4000;
    const IMAGE_DURATION = 10000;
    let textures = [];
    let currentTextureIndex  = 0;
    let nextTextureIndex = 1;

    // Vertex shader source
    const vertexShaderSource = `
        attribute vec4 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;

        void main() {
            gl_Position = a_position - vec4(0.5, 0.5, 0.5, 0.5);
            v_texCoord = a_texCoord * vec2(1.0, -1.0) + vec2(0.0, 1.0);
        }
    `;

    // Fragment shader source 
    const fragmentShaderSource = `
        precision mediump float;

        uniform sampler2D u_firstTexture;
        uniform sampler2D u_dissolveTexture;
        uniform sampler2D u_secondTexture; // Texture of the next image to reveal
        uniform float u_dissolveTime;
        
        varying vec2 v_texCoord;
        
        void main() {
            // Sample the dissolve texture to determine burning state
            float dissolveValue = texture2D(u_dissolveTexture, v_texCoord).r;
        
            // Calculate the alpha value for blending between the two textures
            float alpha = clamp((dissolveValue - u_dissolveTime) * 10.0, 0.0, 1.0);
        
            // Sample the current and next textures
            vec4 currentColor = texture2D(u_secondTexture, v_texCoord);
            vec4 nextColor = texture2D(u_firstTexture, v_texCoord);
        
            // Blend between the two textures based on the dissolve value and time
            vec4 finalColor = mix(currentColor, nextColor, alpha);
        
            // Output the final color
            gl_FragColor = finalColor;
        }
    `;

    // Compile shaders
    function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Link program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
    }

    // Use program
    gl.useProgram(program);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    const texCoords = [
        0, 1, // Bottom-left
        0, 0, // Top-left
        1, 1, // Bottom-right
        0, 0, // Top-left
        1, 0, // Top-right
        1, 1  // Bottom-right
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    // const dissolveTexLocation = gl.getUniformLocation(program, 'u_dissolveTexture');
    // const nextTextureUniformLocation = gl.getUniformLocation(program, 'u_secondTexture');
    // const currentTextureUniformLocation = gl.getUniformLocation(program, 'u_firstTexture');
    const dissolveTimeUniformLocation = gl.getUniformLocation(program, 'u_dissolveTime');

    // Bind position buffer
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Bind texture coordinates
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLocation);

    // Set viewport settings
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = 5600 * devicePixelRatio;
    canvas.height = 3440 * devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Load all textures
    loadTextures();



    function loadNoiseTexture(source, onload = () => {}) {
        // Load Noise DT
        const noiseImage = new Image();
        noiseImage.onload = function () {
            // Create texture
            gl.activeTexture(gl.TEXTURE1); // Use a different texture unit than the main texture
            createTexture(noiseImage);

            // Pass the dissolve texture to the shader
            const dissolveTextureUniformLocation = gl.getUniformLocation(program, 'u_dissolveTexture');
            gl.uniform1i(dissolveTextureUniformLocation, 1); // Use texture unit 1 for the dissolve texture

            onload();
        };
        noiseImage.src = source;
    }

    // loadNoiseTexture(noiseUrls[0]);
   
    // Function to load textures for the current and next images
    function loadTextures() {
        for (let i = 0; i < imageUrls.length; i++) {
            const image = new Image();
            image.onload = function () {
                // Create texture and load image data
                const texture = createTexture(image);
                textures[i] = texture;

                if (i == 1) {
                    gl.activeTexture(gl.TEXTURE2);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    const secondTexUniformLocation = gl.getUniformLocation(program, 'u_secondTexture');
                    gl.uniform1i(secondTexUniformLocation, 2);
                }

                // If this is the last texture, start rendering loop
                if (i === imageUrls.length - 1) {
                    transitionTextures();
                    // setTimeout(transitionTextures, IMAGE_DURATION);
                }
            };
            image.src = imageUrls[i];
        }
    }

    // Function to create and bind WebGL texture from an image
    function createTexture(image) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return texture;
    }
    
    // Function to transition between textures
    function transitionTextures() {
        currentTextureIndex = nextTextureIndex;
        nextTextureIndex = (nextTextureIndex + 1) % imageUrls.length;

        // Bind the current and next textures
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[currentTextureIndex]);
        const firstTexUniformLocation = gl.getUniformLocation(program, 'u_firstTexture');
        gl.uniform1i(firstTexUniformLocation, 0);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, textures[nextTextureIndex]);
        const secondTexUniformLocation = gl.getUniformLocation(program, 'u_secondTexture');
        gl.uniform1i(secondTexUniformLocation, 2);

        const randomNoise = currentTextureIndex == 1 
            ? noiseUrls[0] 
            : noiseUrls[Math.floor(noiseUrls.length * Math.random())];
        loadNoiseTexture(randomNoise, () => {
            // Start the transition animation
            animateTransition();

            // Schedule the next transition
            setTimeout(transitionTextures, IMAGE_DURATION);
        });
    }

    // Function to animate the transition between textures
    function animateTransition() {
        let startTime = performance.now();

        function drawTransition(timestamp) {
            let deltaTime = timestamp - startTime;

            // Update transition progress
            let transitionProgress = Math.min(deltaTime / TRANSITION_DURATION, 1);

            // Pass the current time and transition progress to the shader
            gl.uniform1f(dissolveTimeUniformLocation, transitionProgress);

            // Clear the canvas
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Draw the image
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            // Request the next frame if transition is not complete
            if (transitionProgress < 1) {
                requestAnimationFrame(drawTransition);
            }
        }

        // Start drawing the transition animation
        requestAnimationFrame(drawTransition);
    }
};