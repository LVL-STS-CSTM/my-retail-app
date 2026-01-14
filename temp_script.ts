
import { initialProductsData } from './context/initialProductData';
import * as fs from 'fs';

const a = JSON.stringify(initialProductsData, null, 2);
fs.writeFileSync("products.json", a)
