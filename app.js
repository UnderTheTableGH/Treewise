// app.js contains the tree data and the code that powers search, quizzes, and saved progress.

// "use strict" asks the browser to catch certain common JavaScript mistakes.
"use strict";

/*
 * TREEWISE — Nationwide Tree Identification
 * Progress is stored locally in the visitor's browser.
 * Storage key: treewise.us.v2
 *
 * The catalog is an educational starter database. Regional ranges
 * are broad, not county-level distribution maps.
 */

// This name is the browser-storage key: it labels the saved Treewise progress data.
const STORAGE_KEY = "treewise.us.v2";

/*
 * Each database record:
 * common name | scientific name | category | region | identification clue
 *
 * Categories:
 * Deciduous, Evergreen, Conifer, Broadleaf, Palm
 *
 * Regions:
 * Northeast, Southeast, Midwest, Southwest, West, Pacific, National
 */

// Tree catalog source: each line below describes one tree, with fields separated by the | character.
// Keeping the records in one text block makes the catalog easier to maintain.
const RAW_TREES = `
Red Maple|Acer rubrum|Deciduous|National|Three- to five-lobed leaves with red flowers, stems, and fall color.
Sugar Maple|Acer saccharum|Deciduous|Northeast|Five-lobed leaves with smooth U-shaped spaces between the lobes; famous for maple syrup.
Silver Maple|Acer saccharinum|Deciduous|National|Deeply cut leaves with silvery undersides and brittle branches.
Boxelder|Acer negundo|Deciduous|National|The unusual maple with compound leaves, usually containing three to seven leaflets.
Bigtooth Maple|Acer grandidentatum|Deciduous|West|Broad maple leaves with large teeth; common in interior western mountains.
Striped Maple|Acer pensylvanicum|Deciduous|Northeast|Green bark marked with conspicuous pale vertical stripes.
Norway Maple|Acer platanoides|Deciduous|National|Opposite leaves with milky sap at the broken leaf stalk; commonly planted.
Japanese Maple|Acer palmatum|Deciduous|National|Small ornamental tree with delicate, often deeply divided leaves.
Paper Birch|Betula papyrifera|Deciduous|National|Bright white bark that peels in thin papery sheets.
River Birch|Betula nigra|Deciduous|Southeast|Shaggy, curling bark in salmon, tan, and brown tones.
Yellow Birch|Betula alleghaniensis|Deciduous|Northeast|Yellow-bronze bark that separates into thin curls.
Gray Birch|Betula populifolia|Deciduous|Northeast|Chalky white bark with dark triangular patches near branch attachments.
Sweet Birch|Betula lenta|Deciduous|Northeast|Dark bark and wintergreen-scented twigs.
American Beech|Fagus grandifolia|Deciduous|Northeast|Smooth, pale gray bark and thin pointed buds; often retains dry leaves in winter.
American Hornbeam|Carpinus caroliniana|Deciduous|National|Muscular-looking fluted trunk with smooth gray bark.
American Hophornbeam|Ostrya virginiana|Deciduous|National|Shreddy bark and hop-like papery fruit clusters.
White Oak|Quercus alba|Deciduous|National|Rounded leaf lobes and pale gray flaky bark.
Northern Red Oak|Quercus rubra|Deciduous|Northeast|Pointed lobes with bristle tips and reddish inner bark.
Black Oak|Quercus velutina|Deciduous|Northeast|Pointed leaves with yellow-orange inner bark.
Pin Oak|Quercus palustris|Deciduous|National|Deeply cut leaves and distinctive drooping lower branches.
Bur Oak|Quercus macrocarpa|Deciduous|Midwest|Large acorns with a fringed cap and leaves with a broad middle section.
Chinkapin Oak|Quercus muehlenbergii|Deciduous|National|Coarsely toothed leaves rather than deeply lobed leaves.
Post Oak|Quercus stellata|Deciduous|Southeast|Cross-shaped leaves with broad upper lobes.
Live Oak|Quercus virginiana|Broadleaf|Southeast|Wide spreading crown, leathery evergreen leaves, and twisting limbs.
Southern Red Oak|Quercus falcata|Deciduous|Southeast|Variable leaves, often with a long central lobe.
Water Oak|Quercus nigra|Deciduous|Southeast|Variable spoon-shaped or three-lobed leaves.
Willow Oak|Quercus phellos|Deciduous|Southeast|Narrow willow-like leaves unlike typical oak leaves.
Laurel Oak|Quercus laurifolia|Deciduous|Southeast|Narrow, smooth-edged leaves and a rounded crown.
Shumard Oak|Quercus shumardii|Deciduous|Southeast|Large pointed-lobed leaves with deep sinuses.
Gambel Oak|Quercus gambelii|Deciduous|Southwest|Small lobed leaves forming dense western thickets.
Blue Oak|Quercus douglasii|Deciduous|West|Blue-green leaves and a drought-adapted California foothill form.
Valley Oak|Quercus lobata|Deciduous|Pacific|Massive California oak with deeply lobed leaves and large acorns.
Canyon Live Oak|Quercus chrysolepis|Broadleaf|Pacific|Evergreen leathery leaves and golden fuzzy undersides on young growth.
Oregon White Oak|Quercus garryana|Deciduous|Pacific|Rounded lobes and a broad crown in Pacific Northwest woodlands.
Black Walnut|Juglans nigra|Deciduous|National|Long compound leaves and round green fruits with dark staining husks.
Butternut|Juglans cinerea|Deciduous|Northeast|Compound leaves and sticky, elongated, ridged nuts.
Pecan|Carya illinoinensis|Deciduous|Southeast|Long compound leaves and elongated edible nuts.
Shagbark Hickory|Carya ovata|Deciduous|National|Long strips of bark peel away from the trunk.
Shellbark Hickory|Carya laciniosa|Deciduous|Midwest|Very large compound leaves and thick-shelled nuts.
Bitternut Hickory|Carya cordiformis|Deciduous|National|Bright yellow buds and bitter nuts.
Mockernut Hickory|Carya tomentosa|Deciduous|Southeast|Downy leaf undersides and thick-shelled nuts.
Pignut Hickory|Carya glabra|Deciduous|Southeast|Smooth gray bark and pear-shaped nuts.
American Chestnut|Castanea dentata|Deciduous|Northeast|Long toothed leaves; surviving trees are often sprouts due to chestnut blight.
American Sweetgum|Liquidambar styraciflua|Deciduous|Southeast|Star-shaped leaves and spiky round seed balls.
American Sycamore|Platanus occidentalis|Deciduous|National|Patchy camouflage-like bark that flakes to reveal pale inner bark.
London Plane|Platanus × acerifolia|Deciduous|National|Urban-planted tree with mottled bark and maple-like leaves.
Tulip Tree|Liriodendron tulipifera|Deciduous|Southeast|Distinctive squared-off leaf tips and tulip-shaped flowers.
Eastern Cottonwood|Populus deltoides|Deciduous|National|Triangular leaves with flattened leaf stalks that flutter in wind.
Fremont Cottonwood|Populus fremontii|Deciduous|Southwest|Broad triangular leaves and large western riparian form.
Black Cottonwood|Populus trichocarpa|Deciduous|Pacific|Large leaves with pale undersides and fragrant sticky buds.
Quaking Aspen|Populus tremuloides|Deciduous|National|Nearly round leaves on flattened stalks tremble in the breeze.
Bigtooth Aspen|Populus grandidentata|Deciduous|Northeast|Broad leaves with large irregular teeth.
Balsam Poplar|Populus balsamifera|Deciduous|Northeast|Sticky, resin-scented buds and pointed leaves.
Eastern Redbud|Cercis canadensis|Deciduous|National|Pink flowers appear along branches before or with heart-shaped leaves.
Flowering Dogwood|Cornus florida|Deciduous|Southeast|Showy white or pink bracts surround small central flowers.
Pacific Dogwood|Cornus nuttallii|Deciduous|Pacific|Large white flower bracts and layered horizontal branches.
Kousa Dogwood|Cornus kousa|Deciduous|National|Pointed bracts and bumpy raspberry-like fruit.
American Basswood|Tilia americana|Deciduous|Northeast|Large heart-shaped leaves and hanging clusters with a narrow leafy bract.
Littleleaf Linden|Tilia cordata|Deciduous|National|Small heart-shaped leaves and fragrant flower clusters.
American Elm|Ulmus americana|Deciduous|National|Vase-shaped crown and asymmetrical leaf bases.
Slippery Elm|Ulmus rubra|Deciduous|Midwest|Rough leaves and inner bark that becomes mucilaginous when wet.
Hackberry|Celtis occidentalis|Deciduous|National|Warty cork-like bark and small orange-brown fruits.
Sugarberry|Celtis laevigata|Deciduous|Southeast|Smoother bark and smaller leaves than common hackberry.
Osage Orange|Maclura pomifera|Deciduous|Midwest|Large wrinkled green fruits and thorny branches.
Black Cherry|Prunus serotina|Deciduous|National|Dark scaly bark and clusters of small dark cherries.
Chokecherry|Prunus virginiana|Deciduous|National|Clusters of small dark fruit and finely toothed leaves.
American Plum|Prunus americana|Deciduous|National|Thorny branches and edible yellow to red plums.
Wild Black Cherry|Prunus serotina|Deciduous|Northeast|Glossy leaves and dark fruit clusters; mature bark resembles burnt potato chips.
Pawpaw|Asimina triloba|Deciduous|Southeast|Large drooping tropical-looking leaves and edible custard-like fruit.
American Persimmon|Diospyros virginiana|Deciduous|Southeast|Blocky dark bark and orange fruit that becomes soft when ripe.
Blackgum|Nyssa sylvatica|Deciduous|Southeast|Brilliant red fall foliage and horizontal branching.
Sourwood|Oxydendrum arboreum|Deciduous|Southeast|Narrow leaves with sour taste and dangling white flower clusters.
American Holly|Ilex opaca|Broadleaf|Southeast|Spiny evergreen leaves and red berries on female trees.
Yaupon Holly|Ilex vomitoria|Broadleaf|Southeast|Small evergreen leaves and abundant red berries.
Southern Magnolia|Magnolia grandiflora|Broadleaf|Southeast|Large glossy evergreen leaves with rusty undersides and huge white flowers.
Sweetbay Magnolia|Magnolia virginiana|Broadleaf|Southeast|Fragrant white flowers and leaves with silvery undersides.
Cucumbertree Magnolia|Magnolia acuminata|Deciduous|Southeast|Large leaves and cucumber-shaped immature fruit.
Saucer Magnolia|Magnolia × soulangeana|Deciduous|National|Large tulip-like pink and white spring flowers.
Northern Catalpa|Catalpa speciosa|Deciduous|Midwest|Huge heart-shaped leaves and long bean-like seed pods.
Southern Catalpa|Catalpa bignonioides|Deciduous|Southeast|Showy white flowers with yellow and purple markings.
Kentucky Coffeetree|Gymnocladus dioicus|Deciduous|Midwest|Very large doubly compound leaves and thick woody pods.
Honey Locust|Gleditsia triacanthos|Deciduous|National|Fine compound leaves; wild forms may have branched thorns.
Black Locust|Robinia pseudoacacia|Deciduous|National|Paired thorns at leaf bases and hanging white flower clusters.
American Yellowwood|Cladrastis kentukea|Deciduous|Southeast|Smooth gray bark and drooping white flower clusters.
American Mountain Ash|Sorbus americana|Deciduous|Northeast|Compound leaves and bright orange-red berry clusters.
Serviceberry|Amelanchier arborea|Deciduous|National|Early white flowers and small edible purple fruits.
Downy Serviceberry|Amelanchier arborea|Deciduous|Northeast|White spring blossoms and finely toothed oval leaves.
Eastern Hophornbeam|Ostrya virginiana|Deciduous|Northeast|Hop-like fruit clusters and narrow, birch-like leaves.
American Elderberry|Sambucus canadensis|Deciduous|Southeast|Large compound leaves and flat clusters of dark berries.
Red Mulberry|Morus rubra|Deciduous|Southeast|Variable rough leaves and edible dark mulberries.
White Mulberry|Morus alba|Deciduous|National|Variable leaves, often shiny, and pale or dark mulberry fruits.
River Maple|Acer saccharinum|Deciduous|National|Deeply cut leaves with silvery undersides.
Black Maple|Acer nigrum|Deciduous|Midwest|Sugar-maple relative with drooping leaf edges and dark bark.
Freeman Maple|Acer × freemanii|Deciduous|National|Hybrid maple combining traits of red and silver maples.
American Larch|Larix laricina|Conifer|Northeast|A deciduous conifer with soft needles in clusters that turn gold and fall.
Western Larch|Larix occidentalis|Conifer|West|Tall deciduous conifer with needles in clusters and golden autumn color.
Bald Cypress|Taxodium distichum|Conifer|Southeast|Deciduous needle-bearing conifer; often develops woody knees in wet ground.
Pond Cypress|Taxodium ascendens|Conifer|Southeast|Slender upright branchlets and scale-like needles.
Dawn Redwood|Metasequoia glyptostroboides|Conifer|National|Deciduous conifer with opposite feathery branchlets.
Eastern White Pine|Pinus strobus|Conifer|Northeast|Five soft needles per bundle.
Ponderosa Pine|Pinus ponderosa|Conifer|West|Long needles in bundles of two or three and puzzle-piece bark plates.
Lodgepole Pine|Pinus contorta|Conifer|West|Two needles per bundle and narrow cones.
Jack Pine|Pinus banksiana|Conifer|Midwest|Short twisted needles and asymmetrical cones often held closed.
Red Pine|Pinus resinosa|Conifer|Northeast|Two long needles per bundle and reddish plated bark.
Pitch Pine|Pinus rigida|Conifer|Northeast|Rigid needles in bundles of three and persistent cones.
Virginia Pine|Pinus virginiana|Conifer|Southeast|Short twisted needles in pairs and small cones.
Shortleaf Pine|Pinus echinata|Conifer|Southeast|Short needles in bundles of two or three.
Loblolly Pine|Pinus taeda|Conifer|Southeast|Long needles in bundles of three and large cones.
Longleaf Pine|Pinus palustris|Conifer|Southeast|Very long needles in bundles of three.
Slash Pine|Pinus elliottii|Conifer|Southeast|Long needles in pairs and large resinous cones.
Sand Pine|Pinus clausa|Conifer|Southeast|Small pine of Florida scrub with cones often remaining closed.
Table Mountain Pine|Pinus pungens|Conifer|Southeast|Short stiff needles in pairs and prickly cones.
Whitebark Pine|Pinus albicaulis|Conifer|West|Five short needles per bundle near alpine treeline.
Limber Pine|Pinus flexilis|Conifer|West|Flexible branches and five needles per bundle.
Bristlecone Pine|Pinus longaeva|Conifer|West|Ancient high-elevation pine with twisted, resinous wood.
Singleleaf Pinyon|Pinus monophylla|Conifer|Southwest|Usually one needle per bundle and large edible seeds.
Colorado Pinyon|Pinus edulis|Conifer|Southwest|Two needles per bundle and edible pine nuts.
Rocky Mountain Bristlecone Pine|Pinus aristata|Conifer|West|White resin flecks on needles and twisted high-elevation growth.
Gray Pine|Pinus sabiniana|Conifer|Pacific|Open crown, gray foliage, and exceptionally large cones.
Coulter Pine|Pinus coulteri|Conifer|Pacific|Massive heavy cones with large hooked scales.
Sugar Pine|Pinus lambertiana|Conifer|Pacific|Extremely long hanging cones and five-needle bundles.
Jeffrey Pine|Pinus jeffreyi|Conifer|West|Three needles per bundle and vanilla-like bark scent.
Knobcone Pine|Pinus attenuata|Conifer|Pacific|Cones clustered around branches and often retained after fire.
Monterey Pine|Pinus radiata|Conifer|Pacific|Three needles per bundle and asymmetrical cones.
Austrian Pine|Pinus nigra|Conifer|National|Dark stiff needles in pairs and deeply furrowed bark.
Scots Pine|Pinus sylvestris|Conifer|National|Orange upper bark and twisted blue-green needles in pairs.
Norway Spruce|Picea abies|Conifer|National|Drooping branchlets and long hanging cones.
Colorado Blue Spruce|Picea pungens|Conifer|West|Stiff sharp blue-green needles attached individually to branches.
White Spruce|Picea glauca|Conifer|Northeast|Short needles with a faintly unpleasant odor when crushed.
Black Spruce|Picea mariana|Conifer|Northeast|Narrow crown and small cones near the top of the tree.
Red Spruce|Picea rubens|Conifer|Northeast|Short yellow-green needles and reddish-brown bark.
Engelmann Spruce|Picea engelmannii|Conifer|West|Slender high-elevation spruce with sharp blue-green needles.
Sitka Spruce|Picea sitchensis|Conifer|Pacific|Very sharp needles and coastal Pacific Northwest distribution.
Douglas-fir|Pseudotsuga menziesii|Conifer|West|Distinctive three-pointed bracts protrude between cone scales.
Balsam Fir|Abies balsamea|Conifer|Northeast|Flat fragrant needles and upright resinous cones.
Fraser Fir|Abies fraseri|Conifer|Southeast|Short flat needles and upright cones in southern Appalachian highlands.
Noble Fir|Abies procera|Conifer|Pacific|Blue-green needles and upright cones high in the crown.
White Fir|Abies concolor|Conifer|West|Long blue-green needles that curve upward.
Grand Fir|Abies grandis|Conifer|Pacific|Flat glossy needles with two white bands underneath.
Subalpine Fir|Abies lasiocarpa|Conifer|West|Narrow spire-shaped crown at high elevations.
California Red Fir|Abies magnifica|Conifer|Pacific|Upright cones and curved needles with bluish tones.
Eastern Hemlock|Tsuga canadensis|Conifer|Northeast|Short flat needles with two white lines underneath and tiny cones.
Western Hemlock|Tsuga heterophylla|Conifer|Pacific|Drooping leader and uneven needle lengths.
Mountain Hemlock|Tsuga mertensiana|Conifer|West|Blue-green needles arranged around the twig.
Western Redcedar|Thuja plicata|Conifer|Pacific|Flattened sprays of scale-like leaves and fibrous reddish bark.
Northern Whitecedar|Thuja occidentalis|Conifer|Northeast|Flattened fan-like sprays and small upright cones.
Atlantic Whitecedar|Chamaecyparis thyoides|Conifer|Southeast|Scale-like foliage in coastal wetlands.
Port-Orford-Cedar|Chamaecyparis lawsoniana|Conifer|Pacific|Flat sprays and small rounded cones in southwestern Oregon and northern California.
Alaska Yellow-Cedar|Callitropsis nootkatensis|Conifer|Pacific|Drooping branch tips and scale-like foliage in coastal mountains.
Incense Cedar|Calocedrus decurrens|Conifer|West|Flattened sprays and small horned cones.
Bald Cypress|Taxodium distichum|Conifer|Southeast|Feathery deciduous foliage and buttressed trunk in wetlands.
Rocky Mountain Juniper|Juniperus scopulorum|Conifer|West|Blue berry-like cones and scale-like or needle-like foliage.
Eastern Redcedar|Juniperus virginiana|Conifer|National|Aromatic scale-like foliage and blue berry-like cones.
Utah Juniper|Juniperus osteosperma|Conifer|Southwest|Gnarled drought-adapted tree with fleshy blue-brown cones.
California Juniper|Juniperus californica|Conifer|Pacific|Drought-adapted shrub or small tree with blue-brown cones.
Alligator Juniper|Juniperus deppeana|Conifer|Southwest|Bark breaks into square plates resembling alligator skin.
One-seed Juniper|Juniperus monosperma|Conifer|Southwest|Small juniper with usually one seed in each fleshy cone.
Common Juniper|Juniperus communis|Conifer|National|Needle-like foliage in whorls of three and blue berry-like cones.
Arizona Cypress|Cupressus arizonica|Conifer|Southwest|Blue-green scale foliage and rounded cones.
Monterey Cypress|Cupressus macrocarpa|Conifer|Pacific|Wind-shaped coastal crown and rounded woody cones.
Baldcypress|Taxodium distichum|Conifer|Southeast|Needle-like leaves turn bronze and fall in autumn.
Redwood|Sequoia sempervirens|Conifer|Pacific|Tall coastal conifer with reddish fibrous bark and tiny cones.
Giant Sequoia|Sequoiadendron giganteum|Conifer|Pacific|Massive trunk and cinnamon-colored fibrous bark.
Western White Pine|Pinus monticola|Conifer|Pacific|Five slender needles per bundle and long narrow cones.
Eastern Redbud|Cercis canadensis|Deciduous|National|Heart-shaped leaves and vivid pink spring flowers on bare branches.
Arizona Sycamore|Platanus wrightii|Deciduous|Southwest|Pale patchy bark and large lobed leaves near desert streams.
Arizona Walnut|Juglans major|Deciduous|Southwest|Compound leaves and walnuts in dry southwestern canyons.
Arizona Ash|Fraxinus velutina|Deciduous|Southwest|Opposite compound leaves and winged seeds.
Velvet Ash|Fraxinus velutina|Deciduous|Southwest|Velvety leaf undersides and drought-tolerant southwestern habitat.
Green Ash|Fraxinus pennsylvanica|Deciduous|National|Opposite compound leaves and single-winged samaras.
White Ash|Fraxinus americana|Deciduous|National|Opposite compound leaves with pale undersides.
Blue Ash|Fraxinus quadrangulata|Deciduous|Midwest|Distinctively four-sided young twigs.
Black Ash|Fraxinus nigra|Deciduous|Northeast|Compound leaves and wetland habitat.
American Mountain Ash|Sorbus americana|Deciduous|Northeast|Clusters of orange-red fruits and compound leaves.
White Mulberry|Morus alba|Deciduous|National|Variable leaves and abundant sweet fruit; introduced from Asia.
Russian Olive|Elaeagnus angustifolia|Deciduous|National|Silvery narrow leaves and fragrant flowers; introduced and invasive in some areas.
Siberian Elm|Ulmus pumila|Deciduous|National|Small serrated leaves and drought-tolerant form; introduced.
Tree of Heaven|Ailanthus altissima|Deciduous|National|Large compound leaves with glandular notches near leaflet bases; invasive.
Callery Pear|Pyrus calleryana|Deciduous|National|Glossy leaves and dense white spring flowers; widely planted and invasive.
Bradford Pear|Pyrus calleryana|Deciduous|National|Narrow branching crotches and abundant white blossoms; a Callery pear cultivar.
Black Willow|Salix nigra|Deciduous|Southeast|Narrow leaves and flexible branches near water.
Weeping Willow|Salix babylonica|Deciduous|National|Long pendulous branches and narrow leaves; introduced.
Peachleaf Willow|Salix amygdaloides|Deciduous|West|Narrow willow leaves and riparian western habitat.
Quaking Aspen|Populus tremuloides|Deciduous|National|Round fluttering leaves and pale smooth bark.
Eastern Redbud|Cercis canadensis|Deciduous|National|Pink blossoms appear directly on branches and trunk.
Honey Mesquite|Prosopis glandulosa|Deciduous|Southwest|Bipinnate leaves, thorns, and long bean-like pods.
Velvet Mesquite|Prosopis velutina|Deciduous|Southwest|Velvety leaflets and deep-rooted desert adaptation.
Screwbean Mesquite|Prosopis pubescens|Deciduous|Southwest|Distinctive tightly twisted seed pods.
Blue Palo Verde|Parkinsonia florida|Deciduous|Southwest|Green photosynthetic bark and bright yellow flowers.
Foothill Palo Verde|Parkinsonia microphylla|Deciduous|Southwest|Yellow-green bark and tiny leaves adapted to desert drought.
Desert Ironwood|Olneya tesota|Deciduous|Southwest|Dense dark wood and small compound leaves in Sonoran Desert.
Texas Ebony|Ebenopsis ebano|Deciduous|Southwest|Dark evergreen-like foliage and large woody seed pods.
Texas Live Oak|Quercus fusiformis|Broadleaf|Southwest|Evergreen oak with leathery leaves and acorns.
Arizona White Oak|Quercus arizonica|Deciduous|Southwest|Rounded-lobed oak leaves in southwestern mountain woodlands.
Emory Oak|Quercus emoryi|Broadleaf|Southwest|Small leathery leaves and edible acorns in arid uplands.
Netleaf Oak|Quercus rugosa|Broadleaf|Southwest|Thick leaves with strongly netted veins underneath.
Silverleaf Oak|Quercus hypoleucoides|Broadleaf|Southwest|Narrow leaves with silvery undersides.
Mexican Blue Oak|Quercus oblongifolia|Broadleaf|Southwest|Blue-gray evergreen leaves and rounded acorns.
California Black Oak|Quercus kelloggii|Deciduous|Pacific|Deeply lobed leaves and dark bark in California forests.
Coast Live Oak|Quercus agrifolia|Broadleaf|Pacific|Spiny-edged evergreen leaves and coastal California habitat.
Interior Live Oak|Quercus wislizeni|Broadleaf|Pacific|Evergreen leaves and often multi-stemmed California form.
California Laurel|Umbellularia californica|Broadleaf|Pacific|Aromatic leaves with a strong spicy scent when crushed.
Pacific Madrone|Arbutus menziesii|Broadleaf|Pacific|Smooth reddish peeling bark and leathery leaves.
Manzanita|Arctostaphylos manzanita|Broadleaf|Pacific|Smooth red-brown bark and small leathery evergreen leaves.
Tanoak|Notholithocarpus densiflorus|Broadleaf|Pacific|Oak-like leaves and acorn-like nuts; not a true oak.
Pacific Wax Myrtle|Morella californica|Broadleaf|Pacific|Aromatic evergreen leaves and waxy fruit.
Southern Wax Myrtle|Morella cerifera|Broadleaf|Southeast|Aromatic leaves and wax-covered berries.
Red Bay|Persea borbonia|Broadleaf|Southeast|Aromatic evergreen leaves and dark blue fruit.
Cabbage Palmetto|Sabal palmetto|Palm|Southeast|Fan-shaped fronds and a tall trunk with a crown of leaves.
Dwarf Palmetto|Sabal minor|Palm|Southeast|Small fan palm with a trunk usually hidden below ground.
Saw Palmetto|Serenoa repens|Palm|Southeast|Low fan palm with sharp leaf stalk teeth.
California Fan Palm|Washingtonia filifera|Palm|Southwest|Large fan leaves with thread-like fibers and a stout trunk.
Mexican Fan Palm|Washingtonia robusta|Palm|Southwest|Tall slender palm with fan-shaped fronds.
Date Palm|Phoenix dactylifera|Palm|National|Feather-like fronds and clusters of edible dates; cultivated.
Canary Island Date Palm|Phoenix canariensis|Palm|National|Massive crown of feather-like fronds and thick trunk.
Queen Palm|Syagrus romanzoffiana|Palm|Southeast|Feathery arching fronds and smooth gray trunk; planted ornamentally.
Windmill Palm|Trachycarpus fortunei|Palm|National|Fan-shaped leaves and fibrous trunk; planted in mild climates.
Royal Palm|Roystonea regia|Palm|Southeast|Smooth columnar trunk and large feather-like crown.
`;

// Convert the text catalog into JavaScript objects so the rest of the app can filter and display it.
const TREES = RAW_TREES.trim().split("\n").map((line, index) => {
  const parts = line.split("|");
  return {
    id: index + 1,
    name: parts[0],
    scientific: parts[1],
    category: parts[2],
    region: parts[3],
    clue: parts[4] || "Study the leaf shape, bark, branching pattern, and habitat to identify this species.",
    description: parts[4] || "Compare the tree's leaves, bark, fruit, and habitat with related species.",
    symbol: parts[2] === "Palm" ? "🌴" :
      parts[2] === "Conifer" || parts[2] === "Evergreen" ? "🌲" : "🌳"
  };
});

/* ---------- Persistent learning history ---------- */
// These functions create, load, update, and save quiz progress in this browser. localStorage is browser storage that survives page reloads.

// Return a fresh, empty progress record with the same shape used by saved progress.
function emptyProgress() {
  return {
    version: 2,
    answers: [],
    species: {},
    quizzesCompleted: 0
  };
}

// Read saved progress and check that its structure is usable before the app relies on it.
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();

    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 2 || !Array.isArray(saved.answers)) {
      return emptyProgress();
    }

    saved.species = saved.species && typeof saved.species === "object"
      ? saved.species : {};

    saved.quizzesCompleted = Number.isInteger(saved.quizzesCompleted)
      ? Math.max(0, saved.quizzesCompleted) : 0;

    saved.answers = saved.answers
      .filter(item =>
        item &&
        Number.isInteger(item.treeId) &&
        TREES.some(tree => tree.id === item.treeId) &&
        typeof item.correct === "boolean"
      )
      .slice(-5000);

    return saved;
  } catch (error) {
    console.warn("Treewise could not read saved progress.", error);
    return emptyProgress();
  }
}

let progress = loadProgress();

// Convert the progress object to text and save it. The try/catch handles storage being unavailable or full.
function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    console.warn("Treewise could not save progress.", error);
    return false;
  }
}

// Add one answer to the history, update that species totals, save, and refresh the dashboard.
function recordAnswer(tree, correct) {
  const answer = {
    treeId: tree.id,
    correct: Boolean(correct),
    timestamp: Date.now()
  };

  progress.answers.push(answer);

  // Retain a useful history without allowing unlimited storage growth.
  if (progress.answers.length > 5000) {
    progress.answers = progress.answers.slice(-5000);
  }

  if (!progress.species[tree.id]) {
    progress.species[tree.id] = { correct: 0, attempts: 0 };
  }

  progress.species[tree.id].attempts += 1;
  if (correct) progress.species[tree.id].correct += 1;

  saveProgress();
  renderDashboard();
}

/* ---------- Statistics ---------- */
// These helpers calculate accuracy and proficiency values from the saved answer history.

function percent(correct, attempts) {
  return attempts ? Math.round((correct / attempts) * 100) : null;
}

function getRecentAnswers() {
  return progress.answers.slice(-50);
}

function getRecentAverage() {
  const recent = getRecentAnswers();
  if (!recent.length) return null;
  const correct = recent.filter(item => item.correct).length;
  return percent(correct, recent.length);
}

function getSpeciesStats(treeId) {
  return progress.species[treeId] || { correct: 0, attempts: 0 };
}

function getSpeciesProficiency(treeId) {
  const stats = getSpeciesStats(treeId);
  return percent(stats.correct, stats.attempts);
}

// Average each practiced species percentage equally, rather than letting frequently seen trees dominate.
function getOverallProficiency() {
  const practiced = TREES
    .map(tree => getSpeciesStats(tree.id))
    .filter(stats => stats.attempts > 0);

  if (!practiced.length) return null;

  const average = practiced.reduce((sum, stats) => {
    return sum + (stats.correct / stats.attempts);
  }, 0) / practiced.length;

  return Math.round(average * 100);
}

// A species counts as mastered after at least five attempts and at least 80% accuracy.
function getMasteredCount() {
  return TREES.filter(tree => {
    const stats = getSpeciesStats(tree.id);
    return stats.attempts >= 5 &&
      stats.correct / stats.attempts >= 0.8;
  }).length;
}

function getCategoryStats(category) {
  const categoryTrees = TREES.filter(tree => {
    if (category === "Evergreen") {
      return ["Conifer", "Broadleaf"].includes(tree.category);
    }
    return tree.category === category;
  });

  let correct = 0;
  let attempts = 0;

  categoryTrees.forEach(tree => {
    const stats = getSpeciesStats(tree.id);
    correct += stats.correct;
    attempts += stats.attempts;
  });

  return {
    correct,
    attempts,
    accuracy: percent(correct, attempts)
  };
}

/* ---------- DOM helpers ---------- */
// DOM means Document Object Model: the browser's in-memory representation of the HTML page.

// Shortcuts for finding the first matching HTML element ($) or all matching elements ($$).
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

// Escape special characters before putting catalog text into HTML; this helps prevent injected markup.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

/* ---------- Library ---------- */
// Build the searchable tree cards and open a dialog when a visitor requests more information.

// Read the search/filter controls, find matching trees, and draw their cards in the page.
function renderLibrary() {
  const search = $("#tree-search").value.trim().toLowerCase();
  const region = $("#library-region").value;
  const category = $("#library-category").value;

  const matches = TREES.filter(tree => {
    const textMatch =
      tree.name.toLowerCase().includes(search) ||
      tree.scientific.toLowerCase().includes(search);

    return textMatch &&
      (region === "all" || tree.region === region || tree.region === "National") &&
      (category === "all" || tree.category === category);
  });

  $("#library-count").textContent = matches.length;
  $("#tree-grid").innerHTML = matches.map(tree => {
    const stats = getSpeciesStats(tree.id);
    const accuracy = percent(stats.correct, stats.attempts);

    return `
      <article class="tree-card">
        <div class="tree-card-top">
          <span class="tree-card-symbol">${tree.symbol}</span>
          <span class="tree-tag">${escapeHTML(tree.category)}</span>
        </div>
        <h3>${escapeHTML(tree.name)}</h3>
        <span class="scientific-name">${escapeHTML(tree.scientific)}</span>
        <p class="tree-card-description">${escapeHTML(tree.description)}</p>
        <div class="tree-card-footer">
          <span class="tree-region">${escapeHTML(tree.region)}</span>
          <span class="tree-region">${accuracy === null ? "Not practiced" : accuracy + "% accuracy"}</span>
        </div>
        <div class="tree-card-footer">
          <button class="card-link" data-tree-details="${tree.id}">View details →</button>
          <span class="tree-region">${stats.attempts} attempts</span>
        </div>
      </article>
    `;
  }).join("");

  $("#library-empty").hidden = matches.length !== 0;
}

// Find one tree by its numeric ID and show its identification details and the visitor's history.
function openTreeDetails(treeId) {
  const tree = TREES.find(item => item.id === Number(treeId));
  if (!tree) return;

  const stats = getSpeciesStats(tree.id);
  const accuracy = percent(stats.correct, stats.attempts);

  $("#tree-dialog-content").innerHTML = `
    <span class="tree-card-symbol">${tree.symbol}</span>
    <span class="tree-tag">${escapeHTML(tree.category)}</span>
    <h2>${escapeHTML(tree.name)}</h2>
    <p><em>${escapeHTML(tree.scientific)}</em></p>
    <p><strong>Broad region:</strong> ${escapeHTML(tree.region)}</p>
    <p><strong>Identification clue:</strong> ${escapeHTML(tree.clue)}</p>
    <p><strong>Your history:</strong> ${stats.correct} correct out of ${stats.attempts} attempts.</p>
    <p><strong>Your accuracy:</strong> ${accuracy === null ? "Not practiced yet" : accuracy + "%"}</p>
  `;

  $("#tree-dialog").showModal();
}

/* ---------- Quiz configuration and generation ---------- */
// This section chooses eligible trees, builds randomized answer choices, and controls quiz state.

// Current quiz state: the selected question deck, current position, score, and answer status.
let quiz = {
  deck: [],
  index: 0,
  score: 0,
  answered: false,
  questionCount: 10
};

function getSelectedCategories() {
  return $$('input[name="category"]:checked').map(input => input.value);
}


// Apply the selected category and region settings to determine which trees can appear in the quiz.
function getEligibleTrees() {
  const categories = getSelectedCategories();
  const region = $("#region-filter").value;

  return TREES.filter(tree => {
    const categoryMatch =
      categories.includes(tree.category) ||
      (
        categories.includes("Evergreen") &&
        ["Conifer", "Broadleaf"].includes(tree.category)
      );

    const regionMatch =
      region === "all" ||
      tree.region === region ||
      tree.region === "National";

    return categoryMatch && regionMatch;
  });
}

// Return a shuffled copy of an array using the Fisher-Yates shuffle algorithm.
function shuffle(items) {
  const copy = items.slice();

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function updateAvailableCount() {
  const count = getEligibleTrees().length;
  $("#available-count").textContent =
    `${count} species available for these settings`;
}

// Validate the settings, create a random set of questions, reset the score, and show the first question.
function startQuiz() {
  const available = getEligibleTrees();
  const requested = Number($("#question-count").value);

  if (!available.length) {
    alert("Please select at least one tree category.");
    return;
  }

  if (available.length < 3) {
    alert("Select more categories or regions. At least three species are needed.");
    return;
  }

  quiz.questionCount = Math.min(requested, available.length);
  quiz.deck = shuffle(available).slice(0, quiz.questionCount);
  quiz.index = 0;
  quiz.score = 0;
  quiz.answered = false;

  $("#quiz-placeholder").hidden = true;
  $("#quiz-complete").hidden = true;
  $("#quiz-content").hidden = false;

  renderQuestion();
  $("#quiz-panel").scrollIntoView({ behavior: "smooth", block: "center" });
}

// Create multiple-choice answers, using trees from the same category first when possible.
function makeChoices(correctTree) {
  const difficulty = $("#difficulty").value;
  const choiceCount = difficulty === "beginner" ? 3 : 4;

  const alternatives = shuffle(
    TREES.filter(tree =>
      tree.id !== correctTree.id &&
      tree.category === correctTree.category
    )
  );

  // If a category is small, use other categories as distractors.
  const fallback = shuffle(
    TREES.filter(tree =>
      tree.id !== correctTree.id &&
      !alternatives.some(item => item.id === tree.id)
    )
  );

  const wrong = alternatives.concat(fallback).slice(0, choiceCount - 1);
  return shuffle([correctTree, ...wrong]);
}

// Display the current clue and create clickable buttons for its possible answers.
function renderQuestion() {
  if (quiz.index >= quiz.deck.length) {
    finishQuiz();
    return;
  }

  const tree = quiz.deck[quiz.index];
  quiz.answered = false;

  $("#question-position").textContent =
    `Question ${quiz.index + 1} of ${quiz.deck.length}`;

  $("#quiz-score").textContent = `Score: ${quiz.score}`;
  $("#quiz-progress").style.width =
    `${(quiz.index / quiz.deck.length) * 100}%`;

  $("#question-title").textContent = "Which tree matches this description?";
  $("#question-symbol").textContent = tree.symbol;
  $("#question-region").textContent =
    `${tree.region} · ${tree.category}`;

  $("#question-clue").textContent = tree.clue;
  $("#answer-feedback").hidden = true;
  $("#next-question").hidden = true;

  const choices = makeChoices(tree);

  $("#answer-options").innerHTML = choices.map(choice => `
    <button class="answer-option" data-answer="${choice.id}">
      ${escapeHTML(choice.name)}
    </button>
  `).join("");
}

// Check the selected answer, prevent a second answer, save the result, and show feedback.
function chooseAnswer(treeId) {
  if (quiz.answered) return;

  const tree = quiz.deck[quiz.index];
  const correct = Number(treeId) === tree.id;
  quiz.answered = true;

  if (correct) quiz.score += 1;

  recordAnswer(tree, correct);

  $$(".answer-option").forEach(button => {
    const choiceId = Number(button.dataset.answer);
    button.disabled = true;

    if (choiceId === tree.id) {
      button.classList.add("correct");
    } else if (choiceId === Number(treeId)) {
      button.classList.add("incorrect");
    }
  });

  const feedback = $("#answer-feedback");
  feedback.hidden = false;
  feedback.classList.toggle("is-wrong", !correct);

  feedback.innerHTML = correct
    ? `<strong>Correct!</strong>${escapeHTML(tree.name)} is the right answer. ${escapeHTML(tree.clue)}`
    : `<strong>Not quite.</strong>The correct answer is ${escapeHTML(tree.name)}. ${escapeHTML(tree.clue)}`;

  $("#quiz-score").textContent = `Score: ${quiz.score}`;
  $("#next-question").hidden = false;
  $("#next-question").textContent =
    quiz.index === quiz.deck.length - 1 ? "See results" : "Next question";
}

// Show the final score and refresh the library and dashboard after the last question.
function finishQuiz() {
  progress.quizzesCompleted += 1;
  saveProgress();

  $("#quiz-content").hidden = true;
  $("#quiz-complete").hidden = false;

  const score = Math.round((quiz.score / quiz.deck.length) * 100);

  $("#completion-score").textContent = `${score}%`;
  $("#completion-message").textContent =
    score >= 90 ? "Excellent work. Your identification skills are growing strong." :
    score >= 70 ? "Good work. Keep practicing to strengthen your knowledge." :
    score >= 50 ? "You're making progress. Review the species you missed." :
    "Every mistake is a learning opportunity. Keep exploring.";

  $("#completion-detail").textContent =
    `You identified ${quiz.score} of ${quiz.deck.length} trees correctly. ` +
    `Your last-50-question accuracy is ${getRecentAverage()}%.`;

  $("#quiz-progress").style.width = "100%";
  renderDashboard();
  renderLibrary();
}

/* ---------- Performance dashboard ---------- */
// Fill the dashboard with totals, recent accuracy, category bars, and species-level results.

// Recalculate and display all visible progress measures from the saved answer history.
function renderDashboard() {
  const total = progress.answers.length;
  const recent = getRecentAnswers();
  const recentCorrect = recent.filter(item => item.correct).length;
  const recentAverage = getRecentAverage();
  const overall = getOverallProficiency();

  const allCorrect = progress.answers.filter(item => item.correct).length;
  const allIncorrect = total - allCorrect;

  $("#total-answered").textContent = total;
  $("#recent-average").textContent =
    recentAverage === null ? "—" : `${recentAverage}%`;
  $("#overall-proficiency").textContent =
    overall === null ? "—" : `${overall}%`;

  const practiced = TREES.filter(tree =>
    getSpeciesStats(tree.id).attempts > 0
  ).length;

  $("#species-known").textContent = practiced;
  $("#dashboard-average").textContent =
    recentAverage === null ? "—" : `${recentAverage}%`;
  $("#dashboard-proficiency").textContent =
    overall === null ? "—" : `${overall}%`;

  $("#dashboard-correct").textContent = allCorrect;
  $("#dashboard-incorrect").textContent = allIncorrect;
  $("#dashboard-total").textContent = total;

  $("#proficiency-bar").style.width = `${overall || 0}%`;
  $("#proficiency-description").textContent =
    practiced === 0
      ? "Answer questions to begin measuring your proficiency."
      : `${getMasteredCount()} mastered species out of ${TREES.length} in the catalog.`;

  const categories = ["Deciduous", "Evergreen", "Conifer", "Broadleaf", "Palm"];

  $("#category-progress-list").innerHTML = categories.map(category => {
    const stats = getCategoryStats(category);
    if (!stats.attempts) {
      return `
        <div class="category-row">
          <span>${category}</span>
          <span class="muted">Not practiced</span>
          <span class="row-value">—</span>
        </div>
      `;
    }

    return `
      <div class="category-row">
        <span>${category}</span>
        <div class="row-bar"><span style="width:${stats.accuracy}%"></span></div>
        <span class="row-value">${stats.accuracy}%</span>
      </div>
    `;
  }).join("");

  const practicedTrees = TREES
    .filter(tree => getSpeciesStats(tree.id).attempts > 0)
    .sort((a, b) => {
      const aStats = getSpeciesStats(a.id);
      const bStats = getSpeciesStats(b.id);
      const aAccuracy = aStats.correct / aStats.attempts;
      const bAccuracy = bStats.correct / bStats.attempts;
      return aAccuracy - bAccuracy || bStats.attempts - aStats.attempts;
    });

  $("#species-progress-list").innerHTML = practicedTrees.length
    ? practicedTrees.map(tree => {
        const stats = getSpeciesStats(tree.id);
        const accuracy = percent(stats.correct, stats.attempts);

        return `
          <div class="species-row">
            <span>${escapeHTML(tree.name)}</span>
            <div class="row-bar"><span style="width:${accuracy}%"></span></div>
            <span class="row-value">${accuracy}%</span>
          </div>
        `;
      }).join("")
    : '<p class="muted">No species practiced yet.</p>';
}

/* ---------- Event listeners ---------- */
// Event listeners respond to clicks and changes in the HTML controls. They connect the page to the functions above.

$("#start-quiz").addEventListener("click", startQuiz);
$("#restart-quiz").addEventListener("click", startQuiz);

// Listen on the answer container so newly created answer buttons work without individual listeners.
$("#answer-options").addEventListener("click", event => {
  const button = event.target.closest("[data-answer]");
  if (button) chooseAnswer(button.dataset.answer);
});

$("#next-question").addEventListener("click", () => {
  if (!quiz.answered) return;
  quiz.index += 1;
  renderQuestion();
});

$("#tree-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-tree-details]");
  if (button) openTreeDetails(button.dataset.treeDetails);
});

$("#close-dialog").addEventListener("click", () => {
  $("#tree-dialog").close();
});

$("#tree-dialog").addEventListener("click", event => {
  if (event.target === $("#tree-dialog")) {
    $("#tree-dialog").close();
  }
});

$("#tree-search").addEventListener("input", renderLibrary);
$("#library-region").addEventListener("change", renderLibrary);
$("#library-category").addEventListener("change", renderLibrary);
$("#region-filter").addEventListener("change", updateAvailableCount);

$$('input[name="category"]').forEach(input => {
  input.addEventListener("change", updateAvailableCount);
});

// Ask before erasing saved progress, since this action cannot be undone.
$("#clear-progress").addEventListener("click", () => {
  const confirmed = confirm(
    "Reset all Treewise learning history on this browser? This cannot be undone."
  );

  if (!confirmed) return;

  progress = emptyProgress();
  saveProgress();
  renderDashboard();
  renderLibrary();
});

/* ---------- Initial page setup ---------- */
// Run once after the deferred script loads: populate the page with the catalog and saved progress.

// Set initial counts and draw the library and dashboard before the visitor starts using the site.
function initializeTreewise() {
  $("#library-count").textContent = TREES.length;
  updateAvailableCount();
  renderLibrary();
  renderDashboard();

  console.info(`Treewise loaded ${TREES.length} tree records.`);
}

initializeTreewise();
