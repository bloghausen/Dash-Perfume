let quantityRaw = null;
let parsedQuantity = Number(quantityRaw);
if (isNaN(parsedQuantity) && quantityRaw !== 0 && quantityRaw !== '0') parsedQuantity = 1;
console.log("Parsed Qty:", parsedQuantity);
