    document.addEventListener("DOMContentLoaded", function(){

        let loading = document.getElementById("loading")
        let groups = document.querySelectorAll(".group-data")
        let currencies = ['usd' , 'eur' , 'aud' , 'cad' , 'chf' , 'nzd' , 'bgn']
        // ====== FETCHING API ========
        const getCurrencies = async () => {
            let fetchedData = []
                await Promise.all(
                currencies.map( async (currency) => {
                    const result = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`)
                    const data = await result.json()
                    fetchedData.push(data)
                })
            );
            //sorting currencies array by the consequence of the fethced currenciew
            let keys = fetchedData.map((data) =>Object.keys(data))
            currencies = keys.map((key) => key[1])
            return fetchedData
        }
        displayData()
        // all of the data are fetched now , lets start managing them
        async function displayData(){
            const fetchedData = await getCurrencies()
            // DISPLAYING LOADING WHILE FETCHINF THE API AND THEN HIDE IT 
            fetchedData.length !== 0? loading.style.display = 'none' : loading.style.display = 'block'
            
            //filtering the currencies depending on the user selection
            // and sorting them into 3 groups 
            const handlingData = (curr) => {
                
                //getting the object of the selected currency
                let filteredData = fetchedData.filter((item) => item[curr] )
                filteredData = filteredData[0]
                //sorting the objects functiionality
                let keys = Object.keys(filteredData[curr])
                const sortedData = Object.fromEntries(
                    Object.entries(filteredData[curr]).sort(([,a],[,b]) => a-b)
                );
                //sorting the selected currency into 3 groups by the value of the exchange rate
                keys.forEach((key , index) => {
                    index === 0 ? (groups.forEach((group) => group.innerHTML="")) : null 
                    if(key !== curr &&( key === "usd" ||  key === "eur" || key === "aud" || key === "cad" || key === "chf" || key === "nzd" || key === "bgn")){
                        if(sortedData[`${key}`] < 1){
                            let test = document.createElement("p")
                            test.textContent =curr.toUpperCase() + "-" + key.toUpperCase() + " : " +sortedData[`${key}`]
                            groups[0].appendChild(test)
                        }
                        else if(sortedData[`${key}`] >= 1 && sortedData[`${key}`] < 1.5  ){
                            let test = document.createElement("p")
                            test.textContent = curr.toUpperCase() + "-" + key.toUpperCase() + " : " +sortedData[`${key}`]
                            groups[1].appendChild(test)
                        }
                        else{
                            let test = document.createElement("p")
                            test.textContent = curr.toUpperCase() + "-" + key.toUpperCase()  + " : " +sortedData[`${key}`]
                            groups[2].appendChild(test)
                        }
                    }    
                })
            }
        //when the website first load it will display usd rates
        handlingData("usd")
        
        // Listening to the user select
        let select = document.getElementById("choosedCurrency")
        select.addEventListener("change" , (e) => {
            e.preventDefault()
            const selectedCurr = e.target.value
            handlingData(selectedCurr)
        })
        }
      
        try{
            getCurrencies()
        }
        catch(error){
            console.log(error)
        }
    })