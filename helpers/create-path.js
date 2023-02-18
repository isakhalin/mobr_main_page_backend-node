import path from 'path';

export const createPath = () => path.resolve('build/index.html');
console.log("Запускаемый билд расположен: ", createPath());