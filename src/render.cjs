const { numbers, counters } = require("../boot/arrays.js");

function numberToWord(num) {
  if (+num > 10e63)
    throw new Error("large number beyond vigintillion not supported");
  function input(num) {
    return num.toLocaleString("fullwide", { useGrouping: false });
  }

  function numArr(num) {
    return Array.from(String(num)).map((x) => +x);
  }
  function getWord(num) {
    return numbers.filter((n) => n.num == num)[0]?.word;
  }
  function getTens(num) {
    if (!(num.toString().length < 3)) return;
    if (+num < 20) {
      return numbers.filter((n) => n.num === num)[0].word;
    }
    let mod = +num % 10;
    let digit = numbers.filter((n) => n.num == +num - mod)[0]?.word;
    let str = mod == 0 ? "" : getWord(mod);
    return `${digit} ${str}`.trim();
  }
  function getHundreds(num) {
    if (!(num.toString().length == 3)) return;
    let arr = Array.from(String(num)).map((x) => +x);
    let mod = +num % 100;
    let base = +(+num - mod).toString()[0];
    if (arr.every((x) => x == 0)) return "";
    if (arr.slice(0, 2).every((x) => x == 0)) return `And ${getWord(arr[2])}`;
    if (arr[0] == 0) return `And ${getTens(+arr.slice(1, 3).join(""))}`;
    let digit = numbers.filter((n) => n.num == base)[0]?.word;
    let str = mod == 0 ? "" : `And ${getTens(mod)}`;
    return `${digit} Hundred ${str}`.trim();
  }

  const group = (num) => {
    return numArr(num)
      .reverse()
      .reduce((acc, cur, i, array) => {
        if (i % 3 == 0) acc.push(array.slice(i, i + 3));
        return acc;
      }, []);
  };

  //Handle Floating Pint Numbers
  let xxx = num.toLocaleString("fullwide", { useGrouping: false });
  const parts = xxx.toString().split(".");
  const int = parts[0];
  let float = parts[1] && parts[1].split("").map((x) => getTens(+x));
  let floatStr = !!parts[1] ? ` point ${float.join(" ")}` : ``;

  let map = group(int)
    .reverse()
    .map((x, i, array) => {
      return x.length == 3
        ? getHundreds(x.reverse().join(""))
        : getTens(+x.reverse().join(""));
    })
    .map((x, i, array) => {
      return i == 0 || i == array.length - 1
        ? x
        : x.split(" ")[0] == "And"
        ? x
            .split(" ")
            .filter((n, i) => i != 0)
            .join(" ")
        : x;
    })

    .map((x, i, array) => {
      return !!x
        ? `${x} ${counters.slice(0, array.length).reverse()[i]}`.trim()
        : null;
    });

  let intStr = map
    .filter((c) => !!c)
    .join(" ")
    .toLowerCase();

  return `${intStr.trim()} ${floatStr.trim()}`.trim().toLowerCase();
}

module.exports = numberToWord;
