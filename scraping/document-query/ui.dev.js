const sections = document.querySelectorAll(
  "#__next > main > div > aside > ul > li"
);

[...sections].reduce((acc, cur) => {
  const title = cur.querySelector("h2").innerText;
  const aTags = cur.querySelectorAll("a");
  const hrefList = [...aTags]
    .map((aTag) => aTag.href)
    .filter((href) => !href.includes("-challenge") && !href.includes("-quiz"));
  acc.push({ title, hrefList });
  return acc;
}, []);
