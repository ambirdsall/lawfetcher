import { cleanDoubleSections } from '../../js/functions'

// TODO: test pilcrow handling
describe(`cleanDoubleSections`, () => {
  it(`turns one §§ substring into §`, () => {
    const oneSection      = `§`
    const twoSections     = `§§`
    const threeSections   = `§§§`
    const sectionsAndText = `§§ and then §§§`

    expect(cleanDoubleSections(oneSection)).toEqual(oneSection)
    expect(cleanDoubleSections(twoSections)).toEqual(oneSection)
    expect(cleanDoubleSections(threeSections)).toEqual(twoSections)
    expect(cleanDoubleSections(sectionsAndText)).toEqual(`§ and then §§§`)
  })

  it(`removes the first comma after the §§ and all that follows`, () => {
    const sectionsTextAndCommas = `foo, §§ bar baz, qux`

    expect(cleanDoubleSections(sectionsTextAndCommas)).toEqual(`foo, § bar baz`)
  })

  it(`reduces a compound citation to its first constituent citation`, () => {
    const compoundCitation = `40 C.F.R. §§ 61.145(c)(6)(i), 61.150`
    const firstCitation    = `40 C.F.R. § 61.145(c)(6)(i)`

    expect(cleanDoubleSections(compoundCitation)).toEqual(firstCitation)
  })
})
