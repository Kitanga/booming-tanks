import shuffle from "./shuffle";

export default function randomPosArr(width: number, height: number, length: number) {
    // const size = width * height * 0.5;
    
  const posArr: string[] = [];

  for (let ix = 0; ix < width; ix++) {
    for (let iy = 0; iy < height; iy++) {
        posArr[iy * width + ix] = `${ix},${iy}`;
    }
  }

  const shuffledArr = shuffle(posArr);
  
  const finalArr = shuffledArr.splice(0, length);
  
  console.log("posArr:", shuffledArr)
  
  return finalArr;
}
