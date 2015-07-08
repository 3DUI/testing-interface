define(["three"], function(THREE){
    return function(id){
       if(id === 0){
           var geometry = new THREE.BoxGeometry( 1, 1, 1 );
           var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
           return new THREE.Mesh( geometry, material );
       } else if (id === 1){
            var cubeMaterialArray = [];
            cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff3333 } ) );
            cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff8800 } ) );
            cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xffff33 } ) );
            cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x33ff33 } ) );
            cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x3333ff } ) );
            cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x8833ff } ) );
            var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );
            var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            return new THREE.Mesh( cubeGeometry, cubeMaterials );
       }
    };
});
