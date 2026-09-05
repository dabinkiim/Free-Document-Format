import fs from 'fs-extra';
import path from 'path';

const indexFilePath = path.join(process.cwd(), 'markdown/addindex.md');
const htmlFilePath = path.join(process.cwd(), 'public/index.html');

async function addIndexSpans() {
    try {
        // 1. index.md 파일에서 색인 단어를 읽고 배열로 변환
        const indexData = await fs.readFile(indexFilePath, 'utf8');
        console.log("Index Data Loaded:", indexData); // 디버깅: index.md 내용 출력

        const keywords = indexData.split(/[\n,]+/).map(word => word.trim()).filter(word => word.length > 0);
        console.log("Keywords Array:", keywords); // 디버깅: 키워드 배열 출력

        // 2. text.html 파일에서 <main> 내용 가져오기
        let htmlContent = await fs.readFile(htmlFilePath, 'utf8');
        console.log("HTML Content Loaded"); // 디버깅: HTML 로드 확인

        // <main> 내용만 추출하여 대상 부분을 별도로 저장
        const mainContentRegex = /<main>([\s\S]*?)<\/main>/i;
        const mainMatch = htmlContent.match(mainContentRegex);

        if (!mainMatch) {
            throw new Error("HTML 파일에서 <main> 태그를 찾을 수 없습니다.");
        }

        let mainContent = mainMatch[1];
        console.log("Main Content Extracted"); // 디버깅: 메인 콘텐츠 추출 확인

        // 3. 각 단어에 대해 <span> 태그를 추가하는 정규식 변환
        keywords.forEach(word => {
            // 괄호를 이스케이프 처리
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // 단어 경계를 공백이나 문장 부호로 처리
            const regex = new RegExp(`(^|\\s|\\W)(${escapedWord})(?=\\s|\\W|$)`, "gi");
            mainContent = mainContent.replace(regex, `$1<span class="book-index" data-book-index="${word}">$2</span>`);
        });

        // 4. 변환된 <main> 내용을 기존 HTML 콘텐츠에 다시 삽입
        htmlContent = htmlContent.replace(mainContentRegex, `<main>${mainContent}</main>`);
        console.log("Main Content Replaced"); // 디버깅: 메인 콘텐츠 교체 확인

        // 5. 변경 내용을 다시 text.html에 저장
        await fs.writeFile(htmlFilePath, htmlContent);
        console.log("색인 스팬 추가 완료 및 HTML 파일 업데이트 완료");
    } catch (error) {
        console.error("색인 스팬 추가 중 오류 발생:", error);
    }
}

// 실행
addIndexSpans();