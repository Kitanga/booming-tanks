import { Rectangle } from "pixi.js";


function intersection(rect1, rect2) {
    const outRect = new Rectangle();

    const x0 = rect1.x < rect2.x ? rect2.x : rect1.x;
    const x1 = rect1.right > rect2.right ? rect2.right : rect1.right;
    if (x1 <= x0) {
        outRect.x = outRect.y = outRect.width = outRect.height = 0;
        return outRect;
    }
    const y0 = rect1.y < rect2.y ? rect2.y : rect1.y;
    const y1 = rect1.bottom > rect2.bottom ? rect2.bottom : rect1.bottom;
    if (y1 <= y0) {
        outRect.x = outRect.y = outRect.width = outRect.height = 0;
        return outRect;
    }
    outRect.x = x0;
    outRect.y = y0;
    outRect.width = x1 - x0;
    outRect.height = y1 - y0;
    return outRect;
}

export default intersection;