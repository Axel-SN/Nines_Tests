let x = 9;
const nines = [];

for (let i = 0; i < x; i++){
    nines[i] = Math.floor(Math.random() * 9) + 1;
    console.log("Nines Array at Position [" + i + "]: " + nines[i] +" !")
}