import fs from 'fs-extra';
import path from 'path';

// 실험용 초안. Node에서는 실행되지 않습니다.
// 실제 색인은 브라우저의 js/createIndex.js가 조판 시점에 만듭니다.
// 본문에 색인 태그를 심으려면 scripts/make-index.js를 사용하세요.

const indexFilePath = path.join(process.cwd(), 'markdown/addindex.md');
const htmlFilePath = path.join(process.cwd(), 'public/index.html');

async function createIndex() {
    try {
        // 1. index.md 파일을 읽어 ','로 구분된 단어 배열 생성
        const indexData = await fs.readFile(indexFilePath, 'utf8');
        const keywords = indexData.split('\n').map(word => word.trim()).sort();
        const index = {};

        // 2. Paged.Handler 클래스 정의 - 자동 색인을 위해 after() 메서드 사용
        class IndexHandler extends Paged.Handler {
            after(chunker) {
                console.log("자동 색인 시작");

                // 색인 단어마다 페이지 번호 검색
                keywords.forEach(word => {
                    const regex = new RegExp(`\\b(${word})\\b`, "gi");

                    // 각 페이지에서 인덱스용 단어 찾기
                    chunker.pages.forEach(page => {
                        const pageNumber = page.element.dataset.pageNumber;
                        const pageContent = page.element.textContent;

                        if (regex.test(pageContent)) {
                            if (!index[word]) {
                                index[word] = new Set();
                            }
                            index[word].add(pageNumber);
                        }
                    });
                });

                // 3. 색인 HTML 생성 (단어와 페이지 번호)
                const indexHTML = "<h2>Index</h2>" + Object.keys(index).sort().map(term => {
                    const pages = Array.from(index[term]).join(", ");
                    return `<p>${term}: ${pages}</p>`;
                }).join("");

                // 4. HTML 파일 업데이트
                fs.readFile(htmlFilePath, 'utf8', (err, htmlContent) => {
                    if (err) throw err;
                    const updatedHtmlContent = htmlContent.replace(
                        /<section id="index-box">.*<\/section>/s,
                        `<section id="index-box">${indexHTML}</section>`
                    );

                    fs.writeFile(htmlFilePath, updatedHtmlContent, err => {
                        if (err) throw err;
                        console.log('자동 색인 완료 및 HTML 파일 업데이트');
                    });
                });
            }
        }

        // 5. Paged.js와 IndexHandler를 연결하여 인덱스 생성
        window.PagedPolyfill = window.PagedPolyfill || {};
        window.PagedPolyfill.preview().then(() => {
            Paged.registerHandlers(IndexHandler);
        });

    } catch (error) {
        console.error('자동 색인 중 오류 발생:', error);
    }
}

// 자동 색인 실행
createIndex();
