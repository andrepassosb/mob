import fs from 'fs';
import path from 'path';

export function appendCss(css: string[], filePath: string) {
    const cssString = css.join('\n');
    const directory = path.dirname(`src/styles/${filePath}`);

    // Cria o diretório, se ele não existir
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Escreve no arquivo
    fs.writeFileSync(`src/styles/${filePath}`, cssString);
}