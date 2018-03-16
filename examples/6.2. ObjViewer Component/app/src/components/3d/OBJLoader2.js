/**
  * @author Kai Salmen / https://kaisalmen.de
  * Development repository: https://github.com/kaisalmen/WWOBJLoader
  */

//'use strict';

//if ( THREE.OBJLoader2 === undefined ) { THREE.OBJLoader2 = {} }

/**
 * Use this class to load OBJ data from files or to parse OBJ data from arraybuffer or text
 * @class
 *
 * @param {THREE.DefaultLoadingManager} [manager] The loadingManager for the loader to use. Default is {@link THREE.DefaultLoadingManager}
 */
import * as THREE from 'three';
class OBJLoader2 {
	OBJLOADER2_VERSION = '1.4.1';
	constructor(manager) {
		console.log("Using THREE.OBJLoader2 version: " + OBJLOADER2_VERSION);
		this.manager = Validator.verifyInput(manager, THREE.DefaultLoadingManager);

		this.path = '';
		this.fileLoader = new THREE.FileLoader(this.manager);

		this.meshCreator = new MeshCreator();
		this.parser = new Parser(this.meshCreator);

		this.validated = false;
	}

	/**
	 * Base path to use.
	 * @memberOf THREE.OBJLoader2
	 *
	 * @param {string} path The basepath
	 */
	setPath(path) {
		this.path = Validator.verifyInput(path, this.path);
	}

	/**
	 * Set the node where the loaded objects will be attached.
	 * @memberOf THREE.OBJLoader2
	 *
	 * @param {THREE.Object3D} sceneGraphBaseNode Scenegraph object where meshes will be attached
	 */
	setSceneGraphBaseNode(sceneGraphBaseNode) {
		this.meshCreator.setSceneGraphBaseNode(sceneGraphBaseNode);
	}

	/**
	 * Set materials loaded by MTLLoader or any other supplier of an Array of {@link THREE.Material}.
	 * @memberOf THREE.OBJLoader2
	 *
	 * @param {THREE.Material[]} materials  Array of {@link THREE.Material} from MTLLoader
	 */
	setMaterials(materials) {
		this.meshCreator.setMaterials(materials);
	}

	/**
	 * Allows to set debug mode for the parser and the meshCreator.
	 * @memberOf THREE.OBJLoader2
	 *
	 * @param {boolean} parserDebug Internal Parser will produce debug output
	 * @param {boolean} meshCreatorDebug Internal MeshCreator will produce debug output
	 */
	setDebug(parserDebug, meshCreatorDebug) {
		this.parser.setDebug(parserDebug);
		this.meshCreator.setDebug(meshCreatorDebug);
	}

	/**
	 * Use this convenient method to load an OBJ file at the given URL. Per default the fileLoader uses an arraybuffer
	 * @memberOf THREE.OBJLoader2
	 *
	 * @param {string} url URL of the file to load
	 * @param {callback} onLoad Called after loading was successfully completed
	 * @param {callback} onProgress Called to report progress of loading. The argument will be the XMLHttpRequest instance, which contains {integer total} and {integer loaded} bytes.
	 * @param {callback} onError Called after an error occurred during loading
	 * @param {boolean} [useArrayBuffer=true] Set this to false to force string based parsing
	 */
	load(url, onLoad, onProgress, onError, useArrayBuffer) {
		this._validate();
		this.fileLoader.setPath(this.path);
		this.fileLoader.setResponseType(useArrayBuffer !== false ? 'arraybuffer' : 'text');

		var scope = this;
		scope.fileLoader.load(url, function (content) {

			// only use parseText if useArrayBuffer is explicitly set to false
			onLoad(useArrayBuffer !== false ? scope.parse(content) : scope.parseText(content));

		}, onProgress, onError);
	}

	/**
	 * Default parse function: Parses OBJ file content stored in arrayBuffer and returns the sceneGraphBaseNode
	 * @memberOf THREE.OBJLoader2
	 *
	 * @param {Uint8Array} arrayBuffer OBJ data as Uint8Array
	 */
	parse(arrayBuffer) {
		// fast-fail on bad type
		if (!(arrayBuffer instanceof ArrayBuffer || arrayBuffer instanceof Uint8Array)) {

			throw 'Provided input is not of type arraybuffer! Aborting...';

		}
		console.log('Parsing arrayBuffer...');
		console.time('parseArrayBuffer');

		this._validate();
		this.parser.parseArrayBuffer(arrayBuffer);
		var sceneGraphAttach = this._finalize();

		console.timeEnd('parseArrayBuffer');

		return sceneGraphAttach;
	};

	/**
	 * Legacy parse function: Parses OBJ file content stored in string and returns the sceneGraphBaseNode
	 * @memberOf THREE.OBJLoader2
	 *
	 * @param {string} text OBJ data as string
	 */
	parseText(text) {
		// fast-fail on bad type
		if (!(typeof (text) === 'string' || text instanceof String)) {

			throw 'Provided input is not of type String! Aborting...';

		}
		console.log('Parsing text...');
		console.time('parseText');

		this._validate();
		this.parser.parseText(text);
		var sceneGraphBaseNode = this._finalize();

		console.timeEnd('parseText');

		return sceneGraphBaseNode;
	};

	_validate() {
		if (this.validated) return;

		this.fileLoader = Validator.verifyInput(this.fileLoader, new THREE.FileLoader(this.manager));
		this.parser.validate();
		this.meshCreator.validate();

		this.validated = true;
	};

	_finalize = function () {
		console.log('Global output object count: ' + this.meshCreator.globalObjectCount);

		this.parser.finalize();
		this.fileLoader = null;
		var sceneGraphBaseNode = this.meshCreator.sceneGraphBaseNode;
		this.meshCreator.finalize();
		this.validated = false;

		return sceneGraphBaseNode;
	};


}



export default OBJLoader2;