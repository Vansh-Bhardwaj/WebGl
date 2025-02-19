var WebGL = function () {
	var gl, shaderProgram;

	gl = initializeWebGL(gl);

	//Step 0 (Prepare Texture): 7 steps required for preparing texture object for use to main WebGL code.

	//Texture Step 1:  Define the texture image file in the HTML code.
	// This step is for HTML file.

	//Texture Step 2: Fetch the texture image from the HTML to the JavaScript.
	var textureImage = document.getElementById('image');

	//Texture Step 3: Create a texture object.
	var boxTexture = gl.createTexture();
	var textures = [];

	function initializeTextures() {
        ['image1', 'image2', 'image3'].forEach(imageId => {
            let textureImage = document.getElementById(imageId);
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // ... (texture setup from your existing code) ...
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
            textures.push(texture);
        });
    }
	function changeTexture(imageId) {
        let index = textures.findIndex(tex => tex.imageId === imageId); // Find the texture to activate
        if (index !== -1) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textures[index]);
        }
    }

	//Texture Step 3: Bind the texture object to the appropriate texture type.
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
 
	//Texture Step 5: Specify the texture object parameters.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);	//  how to fill remaining left and right area when mapped to subregion
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);	// how to fill top and bottom area when mapped to a subregion
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);		//
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);		// for magnification purpose when texture image is smaller than the binded shape
 
	//Texture Step 6: Specify the image to map on the texture object.
	gl.texImage2D(
	   gl.TEXTURE_2D, 
	   0, 
	   gl.RGBA, 
	   gl.RGBA,
	   gl.UNSIGNED_BYTE,
	   textureImage
	);
	
	//Texture Step 7: Activate the texture object.
	gl.activeTexture(gl.TEXTURE0);


	//Step 1 (Set background color): First specify the color with the help of Quadlet(R,G,B,Alpha) and the clear the buffer related to background.
	gl.clearColor(0, 0, 0, 1.0);	
	gl.clear(gl.COLOR_BUFFER_BIT);
	//Note: The default background color in WebGl is white.

	//Step 2 (Speficy vertices data): Speficy the coordinates (X,Y,Z) of the geometry and the color information related to each coordinates.
	var verticesDataArrayJS = [
		// X,    Y,   Z,   U,  V
		-0.2, -0.8, 0,   0,  0,  // Bottom Left (V0)
		 0.2, -0.8, 0,   1,  0,  // Bottom Right (V1)
		 0.2,  0.8, 0,   1,  1,  // Top Right (V2)
		-0.2,  0.8, 0,   0,  1,  // Top Left (V3)
	];
	

	//Step 3 (Specify how to connect the points): Specify the order with which the coordinates defined in Step2 will be joined.
	var IndicesArrayJS = [
		0, 1, 2,  // First Triangle
		0, 2, 3   // Second Triangle
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
	var coordinatesInfoPoniter = gl.getAttribLocation(shaderProgram, 'geometryCoordinatesVS');
	var textureInfoPointer = gl.getAttribLocation(shaderProgram, 'textureInfoVS');

	
	//Step 16 (Enable Vertex Attribute Array): It enables the pointer defined in Step 8 to access the vertex buffered data.
	gl.enableVertexAttribArray(coordinatesInfoPoniter);
	//Also enable the color pointer to fetch color information from VBO
	gl.enableVertexAttribArray(textureInfoPointer);

	//Step 17 (Buffer data definition): Define how the data on the GPU buffer is arranged. SO that the pointer defined in Step 8 can access the data from the buffer.
	gl.vertexAttribPointer(
		coordinatesInfoPoniter, // Vertices pointer
		3, 						// Number of elements per attribute
		gl.FLOAT, 				// Type of elements
		gl.FALSE,				// Data Normalization
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 						// Offset from the beginning of a single vertex to this attribute
	);

	//Also specify how the color information has been arranged in the GPU buffer for the color pointer defined in VS
	gl.vertexAttribPointer(
		textureInfoPointer, 		// Color pointer
		2, 						// Number of elements per attribute
		gl.FLOAT, 				// Type of elements
		gl.FALSE,				// Data Normalization
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);
	
	//Step 18 (Draw the geometry): Issue the draw command to generate the geometry as defined by the indices and the type of primitive to create.
	gl.drawElements(gl.TRIANGLES, IndicesArrayJS.length, gl.UNSIGNED_SHORT, 0);
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
	in vec3 geometryCoordinatesVS;		
	in vec2 textureInfoVS;
	out vec2 textureInfoVS_for_FS;
	void main()
	{		
		gl_Position = vec4(geometryCoordinatesVS, 1.0);
		textureInfoVS_for_FS = textureInfoVS; 
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
	in vec2 textureInfoVS_for_FS;	
	uniform sampler2D sampler;	
	void main()
	{
		fragColor = texture(sampler, textureInfoVS_for_FS);
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