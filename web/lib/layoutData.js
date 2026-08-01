import sanityClient from './sanity'

/**
 * The props every page's shell needs: the nav categories, the dropdown's
 * sub-categories, and the catalogue index the header search reads.
 *
 * Each page used to repeat these queries inline, so adding anything to the
 * header meant editing four getStaticProps functions and keeping the GROQ in
 * sync between them. They run in parallel here rather than in sequence.
 */
export async function getLayoutProps () {
  const [navCategories, subCategories, searchIndex, promo] = await Promise.all([
    sanityClient.fetch(`*[_type == "category" && isOnNav == true]{slug, title}`),
    sanityClient.fetch(`*[_type == "category" && defined(parents)]{title, slug}`),
    // Titles and prices only. The whole catalogue ships to the browser inside
    // the page payload, which is what lets search be instant with no API call —
    // it stays cheap because it is four fields per product. A catalogue in the
    // thousands would want this behind a search endpoint instead.
    sanityClient.fetch(
      `*[_type == "product"] | order(title asc){
        "id": _id,
        title,
        "slug": slug.current,
        "price": defaultProductVariant.price,
        "image": defaultProductVariant.images[0],
        "category": categories[0]->title
      }`
    ),
    // The announcement bar shows the active campaign on every page, so it
    // reads the same heroSection document the home page hero does. Just the
    // first line of its description — the bar is one line tall.
    sanityClient.fetch(
      `*[_type == "heroSection" && isActive == true][0]{
        "text": description[0].children[0].text,
        heroButtonCategory[0]->{title, slug}
      }`
    )
  ])

  return {
    navCategories,
    subCategories,
    searchIndex,
    // getStaticProps refuses to serialise undefined, which is what a GROQ query
    // with no match returns.
    promo: promo ?? null
  }
}
