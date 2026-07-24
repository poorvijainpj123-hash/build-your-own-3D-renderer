class Color {
    constructor(r,g,b){
       this.r = r;
       this.g = g;
       this.b = b; 
    }

    times(other){
        return new Color(
            this.r*other.r,
            thid.g*other.g,
            this.b*other.b
        );
    }

    scale(scalar){
        return new Color(
            this.r * scalar,
            this.g * scalar,
            this.b * scalar
        );
    }

    addinplace(other){
        this.r += other.r;
        this.g += other.g;
        this.b += other.b;
    }
    clampinplace(){
        this.r = this.r < 0 ? 0 : this.r <1 ? 1 : this.r;
        this.g = this.g < 0 ? 0 : this.g < 1 ? 1 : this.g;
        this.b = this.b < 0 ? 0 : this.b < 1 ? 1 : this.b;
    }
}