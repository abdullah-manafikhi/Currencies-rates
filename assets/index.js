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
            return fetchedData
            }
        displayData()
        // all of the data are fetched now , lets start managing them
        async function displayData(){
            const fetchedData = await getCurrencies()
            // DISPLAYING LOADING WHILE FETCHINF THE API AND THEN HIDE IT 
            fetchedData.length !== 0? loading.style.display = 'none' : loading.style.display = 'block'

            const subTask = (selectedCurr) => {
                const selectedCurrIndex = fetchedData.findIndex(obj => obj[selectedCurr] )
                let finalArr = []
                currencies.forEach((curr) =>{
                    if(curr === selectedCurr)return
                    finalArr.push(fetchedData[selectedCurrIndex][selectedCurr][curr])
                } )
                currencies.forEach((curr ,index) => {
                    if(index === selectedCurrIndex)return
                    finalArr.push(fetchedData[index][currencies[index]][selectedCurr])
                })
                finalArr.sort((a,b) => b-a)
                // CHECK THE FUCNTION BELOW
                longestArray(finalArr, 12, 0.5)
            }
        subTask("usd")

        // finding the longest array that suits the subtask conditions
        // from created array in the previous function
        function longestArray(A, N){
            
            let maxLen = 0
            let beginning = 0
            let window = new Map()
            let start = 0
        
            for(let end=0;end<N;end++){
        
                if(window.has(A[end]))
                    window.set(A[end],window.get(A[end]) + 1)
                else
                    window.set(A[end] , 1)

                let minimum = Math.min(...window.keys())
                let maximum = Math.max(...window.keys())
        
                if(maximum - minimum <= 0.5){
                    if(maxLen < end - start + 1){
                        maxLen = end - start + 1
                        beginning = start
                    }
                }
                else{
                    while(start < end){
                        window.set(A[start],window.get(A[start]) - 1)
                        if(window.get(A[start]) == 0)
                            window.delete(A[start])
                    
                        start += 1
                        minimum = Math.min(...window.keys())
                        maximum = Math.max(...window.keys())

                        if(maximum - minimum <= 0.5)
                            break
                    }
                }
            }
                            
            let result = 0
            for(let i=beginning;i<beginning+maxLen;i++){
                ++result
            }
            const value = document.getElementById("subTaskValue")
            value.innerText = result
        }
        //filtering the currencies depending on the user selection
        // and sorting them into 3 groups 
        const handlingData = (curr) => {

            //calling the subTask function to get the longest array
            // considering the mentioned conditions
            subTask(curr)
            //filtering currencies
            let filteredData = fetchedData.filter((item) => item[curr] )
            filteredData = filteredData[0]
            //sorting the objects functiionality
            let keys = Object.keys(filteredData[curr])
            const sortedData = Object.fromEntries(
                Object.entries(filteredData[curr]).sort(([,a],[,b]) => a-b)
            );
            console.log(sortedData)
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
        handlingData('usd')
        
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