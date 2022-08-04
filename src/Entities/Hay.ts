import DestroyableEntity from "./DestroyableEntity";

class Hay extends DestroyableEntity {
    IS_HAY = true;

    public update(dt?: number | undefined): void {
        super.update();
    }
}

export default Hay;
