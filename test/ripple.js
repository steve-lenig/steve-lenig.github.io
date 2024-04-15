window.onload = function() {
  // Get the canvas element
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');

  const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;

      void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord * vec2(1.0, -1.0) + vec2(0.0, 1.0); 
      }
  `;

  // Fragment shader source
  const fragmentShaderSource = `
      precision mediump float;

      uniform sampler2D u_texture;
      varying vec2 v_texCoord;
      uniform float u_time;
      
      void main() {
          // Get the texture coordinates
          vec2 uv = v_texCoord;
      
          // Set the center of the ripple effect
          vec2 center = vec2(0.5, 0.5);
      
          // Calculate the distance from the center
          float dist = distance(uv, center);
      
          // Define the ripple strength and frequency
          float strength = 0.03;
          float frequency = 0.0;
      
          // Calculate the displacement
          float offset = sin(dist * frequency) * strength;
      
          // Apply the displacement to the texture coordinates
          vec2 displacedUV = vec2(uv.x + offset, uv.y);
      
          // Calculate ripple effect based on time
          float ripple = sin(u_time + uv.y * 10.0) * 0.02; // Adjust frequency and amplitude as needed      

          // Sample the texture with the displaced coordinates
          // vec4 color = texture2D(u_texture, displacedUV);
          vec4 color = texture2D(u_texture, uv + vec2(ripple, 0.0));
      
          // Output the color
          gl_FragColor = color;
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

  const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    -1, 1,
    -1, -1,
    1, 1,
    -1, -1,
    1, -1,
    1, 1,
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Get attribute and uniform locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
  const textureLocation = gl.getUniformLocation(program, 'u_texture');

  // Load image
  const image = new Image();
  image.onload = function() {
      // Create texture
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0.0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // Set wrap mode for S axis
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // Set wrap mode for T axis
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  image.src = '../img/mazes/watermark/Piranha.jpg'; // Adjust the path as needed

  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = image.width * devicePixelRatio;
  canvas.height = image.height * devicePixelRatio;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Bind position buffer
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Bind texture coordinates
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texCoordLocation);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(textureLocation, 0);

  // Start the rendering loop
  draw(gl, program);
};

function draw(gl, program) {
  // Get the current time in seconds
  const currentTime = performance.now() / 1000;

  // Pass the current time to the shader
  const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
  gl.uniform1f(timeUniformLocation, currentTime);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the image
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Request the next frame
  requestAnimationFrame(() => draw(gl, program));
}
