const WW = function(...arg){
    const all = arg.join(' ').split(' ');
    const min = all.filter(numb => !Number(numb)).reduce((m, word) => 
        word.length < m.length ? word : m
    ).length;
    const result = all.filter(word => word.length === min);
    return result.join(' ');
}
console.log(WW("яблоко кот пес 12", "яблоко дом"));

