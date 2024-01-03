const lottoMap = new Map();

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const main = async (count) => {
  for (let index = 0; index < count; index++) {
    const lotto = new Set();
    while (lotto.size < 6) {
      const num = random(1, 46); // 1 ~ 45
      lotto.add(num);
      lottoMap.set(num, (lottoMap.get(num) || 0) + 1);
    }
    console.log(Array.from(lotto).sort((a, b) => a - b));
  }

  console.log(Array.from(lottoMap.entries()).sort((a, b) => a[0] - b[0]));
};

main(10);
