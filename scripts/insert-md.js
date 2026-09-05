import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';

const markdownFilePath = path.join(process.cwd(), 'markdown/text.md');
const htmlFilePath = path.join(process.cwd(), 'public/index.html');

async function convertMarkdownToHTML() {
    try {
        // Convert Markdown to HTML with Pandoc
        exec(`pandoc "${markdownFilePath}" -f markdown -t html`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Pandoc conversion error: ${stderr}`);
                return;
            }

            // stdout contains the HTML content
            const htmlContent = stdout;

            // Read current HTML content and replace <main> section
            let htmlFileContent = await fs.readFile(htmlFilePath, 'utf8');
            htmlFileContent = htmlFileContent.replace(/<main>.*<\/main>/s, `<main>${htmlContent}</main>`);
            await fs.writeFile(htmlFilePath, htmlFileContent);

            console.log('Markdown content successfully inserted into index.html');
        });
    } catch (error) {
        console.error('Error converting Markdown to HTML:', error);
    }
}

// Run the function to load and convert Markdown
convertMarkdownToHTML();
