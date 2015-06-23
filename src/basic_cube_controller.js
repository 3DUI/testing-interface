define(["three"], function(THREE){
    return {new: function(){
        return {
           init: function(scene, camera){
                var geometry = new THREE.BoxGeometry( 1, 1, 1 );
                var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                this.cube = new THREE.Mesh( geometry, material );
                scene.add( this.cube );
                camera.position.z = 5;
           },
           render: function(scene, camera){
                this.cube.rotation.x += 0.1;
                this.cube.rotation.y += 0.1;
           }
        }
    }}
});
