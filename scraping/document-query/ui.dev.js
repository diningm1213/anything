const sections = document.querySelectorAll(
  "#__next > main > div > aside > ul > li"
);

[...sections].reduce((acc, cur) => {
  const title = cur.querySelector("h2").innerText;
  const aTags = cur.querySelectorAll("a");
  const hrefList = [...aTags]
    .map((aTag) => aTag.href)
    .filter((href) => href.includes("practice-") || href.includes("solution-")); // practice, solution 가져오기;

  // .filter((href) => href.includes("-challenge")); // challenge만 가져오기
  // .filter((href) => !href.includes("-challenge") && !href.includes("-quiz")); // 일반 강의만 가져오기
  // .filter((href) => href.includes("-quiz")); // challenge만 가져오기
  acc.push({ title, hrefList });
  return acc;
}, []);
