const lottoMap = new Map();

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const lotto = async (count) => {
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

const welfareLottery720 = (count) => {
  for (let index = 0; index < count; index++) {
    const group = Math.floor(random(1, 6));
    const num = Math.floor(random(0, 1000000));
    console.log(`${group}조 ${num}`);
  }
};

// lotto(5);
// welfareLottery720(5);
