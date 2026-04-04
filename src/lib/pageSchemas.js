import { buildLinkCardSection } from "./sections.js";

function getListCopy(locale, collection) {
  const isZh = locale === "zh";

  if (collection === "posts") {
    return isZh
      ? {
          title: "文章",
          intro: "用这个集合展示你的写作、观点或说明性内容。",
          eyebrow: "文章集合",
          nextEyebrow: "下一步",
          nextTitle: "把文章和证明、岗位匹配放在一起看",
          nextIntro: "文章最适合补充工作方式和判断过程；结合案例页与招聘摘要去看，会更完整。",
        }
      : {
          title: "Writing",
          intro: "Use this collection for essays, notes, and writing that helps people understand how you think.",
          eyebrow: "Writing",
          nextEyebrow: "What to open next",
          nextTitle: "Use writing together with proof and fit",
          nextIntro: "The writing is strongest when you pair it with case studies or a recruiter-facing summary.",
        };
  }

  return isZh
    ? {
        title: "案例",
        intro: "用这个集合展示代表性工作、项目或职责摘要。",
        eyebrow: "案例集合",
        nextEyebrow: "下一步",
        nextTitle: "如果这些案例已经足够有帮助",
        nextIntro: "这些页面可以把案例继续连接到岗位匹配、直接联系或更完整的工作方式说明。",
      }
    : {
        title: "Work",
        intro: "Use this collection for selected projects, roles, case studies, or representative proof.",
        eyebrow: "Selected work",
        nextEyebrow: "What to do next",
        nextTitle: "If the work looks relevant, go here next",
        nextIntro: "These pages make it easier to connect case studies with fit, contact, and longer explanation.",
      };
}

export function buildLongformListPageSchema({ locale, collection, items, nextStepCards }) {
  const copy = getListCopy(locale, collection);
  const [nextSection] = buildLinkCardSection({
    eyebrow: copy.nextEyebrow,
    heading: copy.nextTitle,
    intro: copy.nextIntro,
    items: nextStepCards,
  });

  return {
    pageType: "longform-list",
    seo: {
      title: `${copy.title} | Your Name`,
      description: copy.intro,
    },
    hero: {
      eyebrow: copy.eyebrow,
      title: copy.title,
      body: copy.intro,
    },
    sections: [
      {
        type: "longform-list",
        version: 1,
        items,
      },
      nextSection,
    ].filter(Boolean),
  };
}

export function buildLongformEntryPageSchema({
  locale,
  collection,
  entry,
  meta,
  leadTitle,
  leadText,
  nextStepCards,
  Content,
}) {
  const isZh = locale === "zh";
  const eyebrow = collection === "posts"
    ? (isZh ? "文章" : "Writing")
    : (isZh ? "案例" : "Work");
  const [nextSection] = buildLinkCardSection({
    eyebrow: isZh ? "下一步" : "Next step",
    heading: collection === "posts"
      ? (isZh ? "把这篇文章和证明、岗位匹配一起看" : "Use this note with proof and fit")
      : (isZh ? "如果这个案例对你已经有帮助" : "If this case feels relevant"),
    intro: collection === "posts"
      ? (isZh ? "单篇文章能说明你的思路，但结合案例页和招聘摘要一起看，会更容易形成完整判断。" : "This post is one piece of the picture. These pages help place it in a clearer practical context.")
      : (isZh ? "下面这几页适合继续看岗位匹配、更多案例，或给访问者一个明确下一步。" : "These pages give the clearest follow-on context without making someone restart from the homepage."),
    items: nextStepCards,
  });

  return {
    pageType: "longform-entry",
    seo: {
      title: entry.data.title,
      description: entry.data.description,
    },
    hero: {
      eyebrow,
      title: entry.data.title,
      body: entry.data.description,
      meta,
      tags: entry.data.tags,
    },
    sections: [
      {
        type: "lead",
        version: 1,
        eyebrow: leadTitle,
        text: leadText,
      },
      {
        type: "prose",
        version: 1,
        Content,
      },
      nextSection,
    ].filter(Boolean),
  };
}
