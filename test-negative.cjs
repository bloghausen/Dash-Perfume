const val = "R$ -10,00";
let str = String(val).trim();
let isNegative = false;
if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
    isNegative = true;
}
str = str.replace(/[R$\s%a-zA-Z()\-]/g, '');
console.log(isNegative ? "-" + str : str);
