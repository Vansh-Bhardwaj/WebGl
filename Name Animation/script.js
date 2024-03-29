var WebGL = function () {
	var gl, shaderProgram;

	gl = initializeWebGL(gl);

	//Step 1 (Set background color): First specify the color with the help of Quadlet(R,G,B,Alpha) and the clear the buffer related to background.
	gl.clearColor(0, 0, 0, 1.0);	
	gl.clear(gl.COLOR_BUFFER_BIT);
	//Note: The default background color in WebGl is white.

	//Step 2 (Speficy vertices data): Speficy the coordinates (X,Y,Z) of the geometry and other information related to each coordinates.
    var verticesDataArrayJS = [
        // V
        -0.55, 0.3, 0,   // Vertex 0
        -0.45, -0.3, 0,  // Vertex 1
        -0.35, 0.3, 0,   // Vertex 2
    
        // A
        -0.25, -0.3, 0,  // Vertex 3
        -0.2, 0.3, 0,    // Vertex 4
        -0.15, -0.3, 0,  // Vertex 5
        -0.225, 0, 0,    // Vertex 6
        -0.175, 0, 0,    // Vertex 7
    
        // N
        -0.05, -0.3, 0,  // Vertex 8
        -0.05, 0.3, 0,   // Vertex 9
        0.05, -0.3, 0,   // Vertex 10
        0.05, 0.3, 0,    // Vertex 11
    
        // S
        0.2, 0.3, 0,     // Vertex 12
        0.1, 0.3, 0,     // Vertex 13
        0.1, 0, 0,       // Vertex 14
        0.2, 0, 0,       // Vertex 15
        0.1, -0.3, 0,    // Vertex 16
        0.2, -0.3, 0,    // Vertex 17
    
        // H
        0.325, 0.3, 0,   // Vertex 18
        0.325, -0.3, 0,  // Vertex 19
        0.425, 0.3, 0,   // Vertex 20
        0.425, -0.3, 0,  // Vertex 21
        0.325, 0, 0,     // Vertex 22
        0.425, 0, 0      // Vertex 23
    ];
    
    var IndicesArrayJS = [
        // V
        0, 1, 1, 2,
    
        // A
        3, 4, 4, 5, 6, 7,
    
        // N
        8, 9, 9, 10, 10, 11,
    
        // S
        12, 13, 13, 14, 14, 15, 15, 17, 17, 16,
    
        // H
        18, 19, 20, 21, 22, 23
    ];
    

	//Step 4 (Create GPU meomry buffer): In the GPU for holding vertices data of type ARRAY_BUFFER.
	var rectVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, rectVBO);

	//Step 5 (Pass the vertices data to the buffer created previously).
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesDataArrayJS), gl.STATIC_DRAW);

	//Step 6 (Pass the indices data to GPU buffer): repeat the steps 4 and 5 for the indices data but use ELEMENT_ARRAY_BUFFER.
	var rectIBO = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectIBO);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(IndicesArrayJS), gl.STATIC_DRAW);

	//Seven Steps Shader side coding in JS to get the shader program.
	shaderProgram = getShaderProgram(gl);

	//Step 14 (Use the shader program):
	gl.useProgram(shaderProgram);

	//Step 15 (Get access to GPU's geometry coordinates): Get the pointer to the geometry coordinates defined in vertex shader through the shader program.
	var positionAttribLocation = gl.getAttribLocation(shaderProgram, 'geometryCoordinatesGPU');
	var tranMatGPUPointer = gl.getUniformLocation(shaderProgram, 'tranMatGPU');
	
	//Step 16 (Enable Vertex Attribute Array): It enables the pointer defined in Step 8 to access the vertex buffered data.
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(tranMatGPUPointer);

	//Step 17 (Buffer data definition): Define how the data on the GPU buffer is arranged. SO that the pointer defined in Step 8 can access the data from the buffer.
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	

	//Step 18 (Draw the geometry): Issue the draw command to generate the geometry as defined by the indices and the type of primitive to create.
    // Animation variables
    var speed = 0.01; // Speed of movement
    var direction = 'up'; // Initial direction
    var position = { x: -1, y: 0 }; // Initial position on the left edge
    var radian = Math.PI/2; // Initial rotation angle
    var padding = 0.1; // Padding to ensure "VANSH" doesn't go off-screen

    var loop = function () {
        gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

        // Update the position based on the direction
        switch (direction) {
            case 'up':
                position.y += speed;
                if (position.y > 1 - padding) {
                    position.y = 1 - padding;
                    direction = 'right';
                    radian = Math.PI ; // Rotate 90 degrees to the right
                }
                break;
            case 'right':
                position.x += speed;
                if (position.x > 1 - padding) {
                    position.x = 1 - padding;
                    direction = 'down';
                    radian = -Math.PI/2; // Rotate 180 degrees
                }
                break;
            case 'down':
                position.y -= speed;
                if (position.y < -1 + padding) {
                    position.y = -1 + padding;
                    direction = 'left';
                    radian = 0; // Rotate 270 degrees (or -90 degrees)
                }
                break;
            case 'left':
                position.x -= speed;
                if (position.x < -1 + padding) {
                    position.x = -1 + padding;
                    direction = 'up';
                    radian = Math.PI/2 // Reset rotation to 0 degrees
                }
                break;
        }

        // Calculate transformation matrix
        var cosRad = Math.cos(radian);
        var sinRad = Math.sin(radian);
        var Sx = 0.5, Sy = 0.5; // Scale down to 0.5 times
        var tranArrayJS = new Float32Array([
            Sx * cosRad, Sx * -sinRad, 0, 0,
            Sy * sinRad, Sy * cosRad, 0, 0,
            0, 0, 1, 0,
            position.x, position.y, 0, 1
        ]);

        gl.uniformMatrix4fv(tranMatGPUPointer, gl.FALSE, tranArrayJS);
        gl.drawElements(gl.LINES, IndicesArrayJS.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    loop();
};


function initializeWebGL(gl)
{
	var canvas = document.getElementById('canvas');

	canvas.width = window.innerWidth;;
	canvas.height = window.innerHeight;;

	gl = canvas.getContext('webgl2');

	if (!gl) {
		alert('Your browser does not support WebGL');
		return;
	}
	return gl;
}

//Seven steps of Shader side coding
function getShaderProgram(gl)
{
	//Step 7 (Define vertex shader text): Define the code of the vertex shader in the form of JS text.
	var vertexShaderText = `#version 300 es
	#pragma vscode_glsllint_stage: vert			
	in vec3 geometryCoordinatesGPU;		
	uniform mat4 tranMatGPU;
	void main()
	{
		gl_Position = tranMatGPU * vec4(geometryCoordinatesGPU, 1.0); 
	}`;

	//Step 8 (Create actual vertex shader): Create the actual vertex shader with the text defined in Step 1.
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderText);

	//Step 9 (Compile vertex shader):
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	//Step 10: Repeat the above 3 steps for fragment shader.
	var fragmentShaderText = `#version 300 es
	#pragma vscode_glsllint_stage: frag
	precision mediump float;
	out vec4 fragColor;		
	void main()
	{
		fragColor = vec4(0.0, 1.0, 0.0, 1.0);;
	}`;

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	//Step 11 (Shader program): With the compiled vertex and fragment shader, create the shader program.
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	//Step 12 (Link shader program): 
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
		return;
	}

	//Step 13 (Validate Shader program): Checks if the shader program has been succesfully linked and can be used further.
	gl.validateProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(shaderProgram));
		return;
	}
	return shaderProgram;
}