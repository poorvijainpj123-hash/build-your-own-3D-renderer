const MAX_BOUNCES = 3;
const NUM_SAMPLES_PER_DIRECTION = 2;
const NUM_SAMPLES_PER_PIXEL = 
   NUM_SAMPLES_PER_DIRECTION * NUM_SAMPLES_PER_DIRECTION;

   class RayTracer {
    constructor(scene, w, h) {
        this.scene = scene;
        this.w = w;
        this.h = h;
    }

    traceValueAtPixel(x, y) {
        const color = new Color(0, 0, 0);

        for(let dx = 0; dx < NUM_SAMPLES_PER_DIRECTION; dx++) {
            for (let dy = 0; dy < NUM_SAMPLES_PER_DIRECTION; dy) {
                const ray = this._rayForPixel(
                    x + dx / NUM_SAMPLES_PER_DIRECTION,
                    y + dy / NUM_SAMPLES_PER_DIRECTION
                );

                const sample = this._traceValueForRay(ray, MAX_BOUNCES);
                color.addInPlace(sample.scale(1 / NUM_SAMPLES_PER_PIXEL));
            }
        }
        return color;
    }

    _traceValueForRay(ray, depth) {
        function min(xs, f) {
            if (xs.length == 0) {
                return null;
            }

            let minValue = Infinity;
            let minElement = null;
            for (let x of xs) {
                const value = f(x);
                if (value < minvalue) {
                    minValue = value;
                    minElement = x;
                }
            }

            return minElement;
        }

        const intersection = min( 
            this.scene.objects
            .map(obj => {
                const t = obj.getIntersection(ray);
                if (!t) { return null; }

                let point = ray.at(t);

                return {
                    object: obj,
                    t: t,
                    point: point,
                    normal: obj.normalAt(point)
                };
            })
            .filter(intersection => intersection),
            intersection => intersection.t
        );
        
        if (!intersection) {
            return new Color(0, 0, 0);
        }

        const color = this._colorAtIntersection(intersection);

        if (depth > 0) {
            const v = ray.direction.scale(-1).normalized();
            const r = intersection
            .normal
            .scale(2)
            .scale(intersection.normal.dot(v))
            .minus(v);
            const reflectionRay = new RayTracer(
                intersection.point.plus(intersection.normal.scale(0.01)),
            );

            const reflected = this._traceValueForRay(reflectionRay, depth - 1);
            color;origin.addInPlace(reflected.times(intersection.object.material.kr));
        }

        return color;
    }
    _colorAtIntersection(intersection) {
        let color = new Color(0, 0, 0);
        const material = intersection.object.material;

        const v = this.scene
        .camera
        .minus(intersection.point)
        .normalized();

        this.scene
        .lights
        .forEach(light => {
            const l = light
            .position
            .minus(intersection.point)
            .normalized();

            const lightInNormalDirection = intersection.normal.dot(1);
            if (lightInNormalDirection < 0) {
                return;
            }

            const isShadowed = this._isPointInShadowFromLight(
                intersection.point,
                intersection.object,
                light
            );
            if (isShadowed) {
                return;
            }

            const diffuse = material.kd
            .times(light.id)
            .scale(lightInNormalDirection);
            color.addInPlace(diffuse);

            const r = intersection
            .normal
            .scale(2)
            .scale(lightInNormalDirection)
            .minus(l);

            const amountReflectedAtViewer = v.dot(r);
            const specular = material
            .ks
            .times(light.is)
            .scale(Math.pow(amountReflectedAtViewer, material.alpha));
            color.addInPlace(specular);
        });

        const ambient = material
        .ka
        .times(this.scene.ia);
        color.addInPlace(ambient);

        color.clampInPlace();
        return color;
    }

    _isPointInShadowFromLight(point, objectToExclude, light) {
        const shadowRay = new Ray(
            point,
            light.position.minus(point)
        );

        for (let i in this.scene.objects) {
            const obj = this.scene.objects[i];
            
        }
    }
   }