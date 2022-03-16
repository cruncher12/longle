App = async ()=>{
    const tileContainer = document.querySelector(".tile-container")
    const popupContainer = document.querySelector(".popup-container")
    const keyboard = document.querySelector(".key-container")

    let word = "TRACK";

        let response  = await fetch("https://random-words5.p.rapidapi.com/getMultipleRandom?count=5&wordLength=5", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "random-words5.p.rapidapi.com",
                "x-rapidapi-key": "ed2ee44e46msh04d7678aac070dcp125e81jsn5b4ee8961b0f"
            }
        })

        response = await response.json()
        console.log(response)
        word = response[Math.floor(Math.random()*5)].toUpperCase()

    let activeGame = true

    const keys = "Q.W.E.R.T.Y.U.I.O.P.A.S.D.F.G.H.J.K.L.ENTER.Z.X.C.V.B.N.M.BACK".split(".")

    const tileRows = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
    ]

    const congratulations = ["Genius!", "Amazing!", "Impressive!", "Nicely Done!", "You got it!", "Phew!"]

    let currentRow = 0;
    let currentTile = 0;
    let currentGuess = "";

    document.addEventListener("keydown", (event)=>{
        keyClick(event.key)
    })

    keyClick = (key_lowercase) => {

        if (!activeGame)
            return;

        let key = key_lowercase.toUpperCase()

        if (key.length == 1){

            if (currentTile < 5){

                const tile = document.getElementById('guessRow-'+currentRow+"-tile-"+currentTile)
                tile.innerText = key;
                currentGuess += key;
                currentTile++;
            }

        }

        else if (key === "BACKSPACE"  || key === "BACK"){
            
            if (currentTile > 0){

                const tile = document.getElementById('guessRow-'+currentRow+"-tile-"+(currentTile-1))
                tile.innerText = "";
                currentGuess = currentGuess.slice(0, -1);
                currentTile--;

            }

        }

        else if (key === "ENTER"){

            if (currentGuess.length < 5){
                showPopUp("Guess must be 5 letters long")
                return;
            }

            //let guess = document.getElementById('guessRow-'+currentRow)
            guessMade()

        }


    }

    guessMade = async () =>{

        //later: check if the word entered is a real word
        let response = await fetch(`https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=${currentGuess}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com",
                "x-rapidapi-key": "ed2ee44e46msh04d7678aac070dcp125e81jsn5b4ee8961b0f"
            }
        })
        response = await response.json()
        const isWordFake = (response.result_msg == 'Entry word not found')
        
        if (isWordFake){
            showPopUp("Not a real word")
            return false;
        }

        const checked = new Map([])

        for (let index = 0 ; index < 5 ; index++){

            const tile = document.getElementById('guessRow-'+currentRow+"-tile-"+index)
            const curKey = document.getElementById(tile.innerText)
            
            setTimeout(()=>{
                tile.classList.add("flip")

                if(!checked.has(tile.innerText) && word[index]==tile.innerText){
                    tile.classList.add("green-tile")
                    curKey.classList.add("green-tile")
                    checked.set(tile.innerText, true)
                }
                
                if(!checked.has(tile.innerText) && word.includes(tile.innerText)){
                    tile.classList.add("yellow-tile")
                    curKey.classList.add("yellow-tile")
                    checked.set(tile.innerText, true)
                }

                tile.classList.add("grey-tile")
                curKey.classList.add("grey-tile")
            }, 500*index)

        }

        //check if the guess is correct
        if (currentGuess === word){
            activeGame =  false;
            showPopUp(congratulations[currentRow])  
        } //later: remove event listeners

        //reset guessed word, tile index and increment row index
        currentGuess = ""
        currentTile = activeGame ? 0 : 5
        currentRow = currentRow+1

        if (currentRow == 6 && !activeGame)
            showPopUp(`The word is ${word}`)

    }

    showPopUp = (message) => {
        const popup = document.createElement('div')
        popup.classList.add("popup")
        popup.innerText = message
        popupContainer.append(popup)
        setTimeout(()=>{popupContainer.removeChild(popup)},2000)

    }

    tileRows.forEach((tileRow, rowIndex) => {
        const tileRowElement = document.createElement('div')
        tileRowElement.setAttribute('id', 'guessRow-'+rowIndex)
        tileRowElement.classList.add("tile-row")
        tileRow.forEach((tile, tileIndex) => {
            const tileElement = document.createElement('div')
            tileElement.setAttribute('id', 'guessRow-'+rowIndex+"-tile-"+tileIndex)
            tileElement.classList.add('tile')
            tileRowElement.append(tileElement)
        })
        tileContainer.append(tileRowElement)
    })

    keys.forEach(key => {
        const keybtn = document.createElement('button')
        keybtn.innerText = key
        keybtn.setAttribute('id', key)
        keybtn.className = "key"
        keybtn.addEventListener("click", ()=>{keyClick(key)})
        keyboard.append(keybtn)
        // += `<button class="key" id=${key}>${key}</button>`
    })
}

App()