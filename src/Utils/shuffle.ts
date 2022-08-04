// Copied from here: 
export default function shuffle(array: any[]) {
  var random = array.map(val => Math.random() + Math.random());
  array.sort(function (a, b) {
    return random[a] - random[b];
  });

  return array;
}
