import Entity from "./Entity";

class DestroyableEntity extends Entity {
    private _health = 100;
    public get health() {
        return this._health;
    }
    public set health(value) {
        this._health = value;

        if (this._health < 1) {
            this.deactivate();
            this.health = 100;
        }
    }
}

export default DestroyableEntity;
