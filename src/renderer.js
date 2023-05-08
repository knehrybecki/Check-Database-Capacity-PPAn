// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

;(async () => {
  window.addEventListener('DOMContentLoaded', () => {
    const path = localStorage.getItem('FolderPath')
    const infoStart = document.querySelector('.infoStart')
    const loader = document.querySelector('.loader')

    if (path) {
      infoStart.remove()
      loader.style.display = 'block'
      selectFolder()
    }
    if (path === null) {
      infoStart.style.display = 'block'
      selectFolder()
    }

    setTimeout(() => {
      newFunc()
    }, 1000)

    reload()
  })

  const ShopsDiv = document.querySelector('#Shops')
  const shopsDict = {}
  const shops = [
    'M02',
    'M03',
    'M04',
    'M08',
    'M10',
    'M11',
    'M13',
    'M15',
    'M16',
    'M17',
    'M18',
    'M19',
    'M22',
    'M23',
    'M24',
    'M25',
    'M26',
    'M27',
    'M28',
    'M31',
    'M33',
    'M34',
    'M35',
    'M36',
    'M37',
    'M38',
    'M39',
    'M40',
    'M41',
    'M42',
    'M43',
    'M44',
    'M45',
    'M46',
    'M47',
    'M48',
    'M49',
    'M51',
    'M52'
  ]

  const newFunc = () => {
    const path = localStorage.getItem('FolderPath')

    if (path) {
      shops.forEach((NumberShop) => {
        fetch(`file:///${path}/${NumberShop}_Dane.txt`)
          .then((response) => response.text())
          .then((data) => {
            const lines = data.split('\n')
            const foundLine = lines.find(
              (line) => line.includes(` ${NumberShop}.DAN`) || line.includes(` ${NumberShop}.dan`)
            )
            // console.log(foundLine) // wyświetla linię zawierającą szukany_tekst
            const regex = /\d[�\d]*/g
            const matches = foundLine.match(regex)

            const date = `${matches[0]}-${matches[1]}-${matches[2]}`
            const content = matches[5]
            const NameShop = matches[6]

            const replace = parseFloat(content.replaceAll('�', ''))

            const gbSize = (replace / 1000000000).toFixed(3)

            const addNameShops = () => {
              const liShops = document.createElement('li')
              liShops.className = 'ShopsNumber'
              liShops.textContent = `M${NameShop}`
              // liShops.style.display = 'flex'
              liShops.style.display = 'none'

              const Date = document.createElement('span')
              Date.className = 'date'
              Date.textContent = `${date}`

              const ValueCapacity = document.createElement('span')
              ValueCapacity.className = 'capacity'
              if (gbSize >= 1.0) {
                ValueCapacity.textContent = `${gbSize} GB`
              }
              if (gbSize < 1.0) {
                ValueCapacity.textContent = `${gbSize} MB`
              }

              liShops.append(Date)
              liShops.append(ValueCapacity)

              const shopName = `M${NameShop}`
              if (!shopsDict[shopName]) {
                shopsDict[shopName] = []
              }
              shopsDict[shopName].push(liShops)

              const sortedShopNames = Object.keys(shopsDict).sort()
              ShopsDiv.innerHTML = ''
              sortedShopNames.forEach((shopName) => {
                shopsDict[shopName].forEach((shop) => {
                  ShopsDiv.append(shop)
                })
              })
            }

            addNameShops()
          })
          .catch((err) => {
            const errorDiv = document.querySelector('#error')
            errorDiv.append(err)

            const install = document.createElement('div')
            install.textContent = `Nieprawidłowa ścieżka lub brak sklepu ${NumberShop}`
            install.style.textAlign = 'center'
            errorDiv.append(install)

            ShopsDiv.remove()
            document.querySelector('.loader').remove()
            // console.log(err)
          })
          .finally(() => {
            const intervalCapacity = setInterval(() => {
              if (document.querySelectorAll('.capacity').length > 0) {
                checkValue()
                const shopsNumbers = Array.from(document.querySelectorAll('.ShopsNumber'))

                const capacityDataElements = document.querySelectorAll('[data-capacity]')

                let highCapacityCount = 0
                let mediumCapacityCount = 0
                let lowCapacityCount = 0

                capacityDataElements.forEach((element) => {
                  const capacity = element.dataset.capacity
                  if (capacity === 'high') {
                    highCapacityCount++
                  } else if (capacity === 'medium') {
                    mediumCapacityCount++
                  } else {
                    lowCapacityCount++
                  }
                })

                document.querySelector('#countShops').textContent = ` ${shopsNumbers.length}`
                document.querySelector('#countLow_number').textContent = ` ${lowCapacityCount}`
                document.querySelector('#countMid_number').textContent = ` ${mediumCapacityCount}`
                document.querySelector('#countHig_number').textContent = ` ${highCapacityCount}`

                const sortedShopsNumbers = shopsNumbers.sort((a, b) => {
                  const textA = a.textContent.slice(1, 3)
                  const textB = b.textContent.slice(1, 3)
                  if (textA < textB) {
                    return -1
                  } else if (textA > textB) {
                    return 1
                  } else {
                    return 0
                  }
                })

                sortedShopsNumbers.forEach((e) => {
                  e.style.display = 'flex'
                })

                clearInterval(intervalCapacity)
                document.querySelector('.count').style.display = 'flex'
                if (document.querySelector('.loader')) {
                  document.querySelector('.loader').remove()
                }
              }
            }, 1000)
          })
      })
    }
  }

  const checkValue = () => {
    const capacityValue = document.querySelectorAll('.capacity')

    capacityValue.forEach((element) => {
      const getCapacity = parseFloat(element.textContent)
      let capacityData

      if (getCapacity >= 1.4 && getCapacity < 1.6) {
        element.style.background = '#ffcc00'

        element.style.color = '#000'
        element.style.borderRadius = '10px'

        element.style.color = '#000'
        element.style.textAlign = 'center'
        element.parentElement.style.borderRadius = '10px'
        capacityData = 'medium'
      }
      if (getCapacity >= 1.6) {
        element.parentElement.style.background = '#cc3300'
        element.parentElement.style.color = '#000'
        element.parentElement.style.borderRadius = '10px'
        capacityData = 'high'
      }
      if (getCapacity < 1.4) {
        element.style.background = '#99cc33'
        element.style.color = '#000'
        element.parentElement.style.borderRadius = '10px'
        element.style.borderRadius = '10px'
        capacityData = 'low'
      }
      element.parentElement.setAttribute('data-capacity', capacityData)
    })
  }

  const reload = () => {
    const reloadFile = document.querySelector('#reload')
    reloadFile.addEventListener('click', () => {
      location.reload()
    })
  }

  const selectFolder = () => {
    const folderInput = document.getElementById('input-folder')
    const addFolder = document.getElementById('addFolder')
    const addFolderStart = document.querySelector('#addFolderStart')

    addFolder.addEventListener('click', () => {
      folderInput.click()
    })
    if (addFolderStart) {
      addFolderStart.addEventListener('click', () => {
        folderInput.click()
      })
    }

    folderInput.addEventListener('change', (event) => {
      const folderPath2 = event.target.files[0].path
      // console.log(event)
      const separator = folderPath2.lastIndexOf('\\') > -1 ? '\\' : '/'

      const folderPath = folderPath2.slice(0, folderPath2.lastIndexOf(separator))
      // console.log(folderPath)
      localStorage.setItem('FolderPath', `${folderPath}`)
      location.reload()
    })
  }
})()
