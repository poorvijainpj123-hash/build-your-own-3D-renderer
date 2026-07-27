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
                    objrct: obj,
                    t: t,
                    point: point,
                    normal: obj.normalAt(point)
                };
            })
            .filter(intersection => intersection),
            intersection => intersection.t
        );
        
    }
   }