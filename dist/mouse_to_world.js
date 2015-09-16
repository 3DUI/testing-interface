"use strict";

define(["three"], function (THREE) {
    return function (x, y, width, height, camera) {
        // Based off of code from StackOverflow [1]
        // [1] WestLangley (http://stackoverflow.com/users/1461008/westlangley). Mouse / Canvas X, Y to Three.js World X, Y, Z. URL (retrieved: 2015-06-29): http://stackoverflow.com/revisions/13091694/4
        var vector = new THREE.Vector3();

        vector.set(x / width * 2 - 1, -(y / height) * 2 + 1, 0.5);

        vector.unproject(camera);
        var dir = vector.sub(camera.position).normalize();
        var distance = -camera.position.z / dir.z;
        var pos = camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    };
});
//# sourceMappingURL=mouse_to_world.js.map
