import fs from 'fs-extra';
import path from 'path';

const htmlFilePath = path.join(process.cwd(), 'public/index.html');

async function adjustFootnotes() {
    try {
        // 1. HTML 파일을 읽어들입니다.
        let htmlContent = await fs.readFile(htmlFilePath, 'utf8');

        // 2. 각주 참조와 각주 항목을 문자열로 처리합니다.
        const footnoteRefRegex = /<a href="#fn\d+" class="footnote-ref" id="fnref\d+" role="doc-noteref"><sup>\d+<\/sup><\/a>/g;
        const footnoteRegex = /<li id="fn\d+">([\s\S]*?)<\/li>/g;

        let footnoteRefs = [];
        let footnotes = [];

        // 각주 참조를 배열에 저장
        htmlContent.replace(footnoteRefRegex, (match) => {
            footnoteRefs.push(match);
            return match;
        });

        // 각주 항목을 배열에 저장
        htmlContent.replace(footnoteRegex, (match, content) => {
            footnotes.push({ match, content });
            return match;
        });

        // 3. 각주 번호를 재정렬합니다.
        let currentNumber = 1;
        footnoteRefs.forEach((ref) => {
            const newRef = ref.replace(/href="#fn\d+"/, `href="#fn${currentNumber}"`)
                              .replace(/id="fnref\d+"/, `id="fnref${currentNumber}"`)
                              .replace(/<sup>\d+<\/sup>/, `<sup>${currentNumber}</sup>`);
            htmlContent = htmlContent.replace(ref, newRef);
            currentNumber++;
        });

        // 4. 각주 항목 번호를 재정렬합니다.
        currentNumber = 1;
        footnotes.forEach((footnote) => {
            const newFootnote = `<li id="fn${currentNumber}">${footnote.content}</li>`;
            htmlContent = htmlContent.replace(footnote.match, newFootnote);
            currentNumber++;
        });

        // 5. 수정된 HTML을 파일에 다시 씁니다.
        await fs.writeFile(htmlFilePath, htmlContent);
        console.log('각주가 성공적으로 조정되었습니다.');
    } catch (error) {
        console.error('각주 조정 중 오류 발생:', error);
    }
}

// 실행
adjustFootnotes();