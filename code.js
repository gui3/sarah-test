
// PARAMETRES -------------------------------------------------------

const params = {
  maxTestSizeScreenPercent: 0.9,
  fixationTime: 500,       // en milisecondes
  maxImageTime: 5000,      // en milisecondes
  imageWidthPercent: 0.8,
  imageRatio: 16/9,
  targetSizePercent: 1/8,
  terminalLinesToKeep: 5000,  // le terminal gardera ce nombre de lignes
  loopsPerSecond: 100
}

const testSection = document.getElementById('testSection')
  // on récupère la portion de la page web qui affichera le test


// LOGGER -----------------------------------------------------------
// fonction pour afficher du texte dans la "console" incluse dans la page web

const terminal = document.getElementById('terminal')

function log (text, newLine = true) {


  if (newLine) { // si paramètre newLine = true
    terminal.innerHTML += '\n' // on ajoute un saut de ligne
  }

  terminal.innerHTML += text // on ajoute le texte

  terminal.innerHTML = terminal.innerHTML
    .split('\n') // on coupe le texte en lignes
    .slice(-params.terminalLinesToKeep) // on garde que les n dernieres lignes
    .join('\n')  // on remet les sauts de lignes

  terminal.scrollTop = terminal.scrollHeight // on scroll la console en bas
}

log('HTML terminal ready !', newLine = false)


// UTILITIES --------------------------------------------------------
// des fonctions utilitaires

function prettify (data) { // pour rendre les data faciles à lire
  return JSON.stringify(data, null, 2)
}

function clearElement (element) {
  // pour supprimer tout le contenu d'un élément HTML
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function getISODate (epoch) { // epoch est le format de dates informatique
  if (epoch) {  // si on précise une epoch
    return new Date(epoch).toISOString() // renvoie la date de cette epoch
  } else { // sinon renvoie la date de l'instant
    return new Date(Date.now()).toISOString()
  }
}


// preparation des images -------------------------------------------
// cette étape sera faite automatiquement avec le serveur
// mais la c'est pour tester

let images = [
  'church',
  'city',
  'lake',
  'lighthouse',
  'mountain',
  'subway'
]

images = images.map(name => {
  return {
    name: name,
    path: './images/' + name + '.jpg'
  }
})

// préparation des cibles -------------------------------------------
// idem que pour les images

let targets = [
  'blue_square',
  'green_square',
  'orange_square',
  'red_square'
]

targets = targets.map(name => {
  return {
    name: name,
    path: './targets/' + name + '.png'
  }
})


// calcul des essais ------------------------------------------------

let positions = [
  {
    name: 'top-left',
    symbol: 'TL',
    x: 1/8,
    y: 1/8
  },{
    name: 'top-right',
    symbol: 'TR',
    x: 7/8,
    y: 1/8
  },{
    name: 'bottom-left',
    symbol: 'BL',
    x: 1/8,
    y: 7/8
  },{
    name: 'top-left',
    symbol: 'BR',
    x: 7/8,
    y: 7/8
  }
]

let possibilities = []
images.forEach(image => { // pour chaque image
  targets.forEach(target => { // pour chaque cible
    positions.forEach(position => { // pour chaque position

      possibilities.push({ // ajoute une possibilité
        image,
        target,
        position
      })

    })
  })
})

function shuffle(arr) { // fonction pour mélanger un array (liste)
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

shuffle(possibilities) // on mélange les possibilités

// TEST __________________________________________________________
// enfin, les fonctions du test

function setupImageWithTarget(possibility) {

  let image = document.createElement('img')
  image.id = 'testImage'
  image.src = possibility.image.path

  let target = document.createElement('img')
  target.id = 'testTarget'
  target.src = possibility.target.path
  target.testPosition = possibility.position

  clearElement(testSection)

  resizeImageAndTarget(image, target)

  testSection.appendChild(image)
  testSection.appendChild(target)
}

function resizeImageAndTarget(image, target) {
  const testDimensions = calculateTestDimensions()
  image.width = testDimensions[0]
  image.height = testDimensions[1]

  target.style.position = 'absolute'
  target.width = testDimensions[0] * params.targetSizePercent
  target.height = testDimensions[1] * params.targetSizePercent
  target.style.top =
    (image.height * target.testPosition.y - target.height / 2)
    + 'px'
  target.style.left =
    (image.width * target.testPosition.x - target.width / 2)
    + 'px'
}

function resizeTestSection () {
  const testDimensions = calculateTestDimensions()
  testSection.setAttribute(
    'style',
    //'width: ' +
    //testDimensions[0] +
    //'px; ' +
    'height: ' +
    testDimensions[1] +
    'px;'
  )
}

function calculateTestDimensions () {
  const fullHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  )
  const maxHeight = fullHeight * params.maxTestSizeScreenPercent

  const fullWidth = testSection.offsetWidth
  let testWidth = fullWidth

  let testHeight = testWidth * 1 / params.imageRatio

  if (testHeight > maxHeight) {
    testHeight = maxHeight
    testWidth = testHeight * params.imageRatio
  }

  return [testWidth, testHeight, fullWidth, fullHeight]
}

resizeTestSection();

window.addEventListener('resize', function () {
  const image = document.getElementById('testImage')
  const target = document.getElementById('testTarget')

  if (image && target) {
    testSection.removeAttribute('style')
    resizeImageAndTarget(
      image,
      target
    )
  } else {
    resizeTestSection()
  }
})




let currentTest = {
  isTesting: false
}// une variable pour savoir ou on en est dans le test
// comme javascript est un langage asynchrone
// (il fait les choses en réponse à des évènements
// plutot que dans un ordre précis)
// la programmation du test est un peu plus complexe

function startTest () {
  currentTest.conditions = shuffle(possibilities) // on mélange les possibilités
  currentTest.round = 0
  currentTest.isTesting = true
  testRound(0)

  setupImageWithTarget(possibilities[0])
}

function testRound (round) {
  if (round === currentTest.round) {
    if (currentTest.round < currentTest.conditions.length) {
      currentTest.round++ // on ajoute un au compteur de rounds

    } else {

    }
  }
}

// MOUSE TRACKER -------------------------------------------------
let mouse

const mouseTracker = document.getElementById('mouseTracker')

testSection.addEventListener('mousemove', function (event) {
  mouse = event
  mouseTracker.innerHTML = event.offsetX + '|' + event.offsetY
})

testSection.addEventListener('mouseleave', function (event) {
  mouseTracker.innerHTML = '-1|-1'
})
let loop = setInterval(
  _ => {

  },
  1 / params.loopsPerSecond
)
